import passport from "passport";
import dotenv from 'dotenv';
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Request, Response, NextFunction } from "express";
import { User, UserInstance } from "../models/userModel";
import { isEmpresa, isUsuario, isOng } from "../auth/verifyType";
import { Empresa, EmpresaInstance } from "../models/empresaModel";
import { Ong, OngInstance } from "../models/ongModel";

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY as string
}
const notAuthorized = { 
    status: 401, 
    message: 'Não autorizado'
}

let user: UserInstance | EmpresaInstance | OngInstance | null

passport.use(new JWTStrategy(options, async (payload, done) => {
    const id = payload.id

    if(isUsuario(id)) user = await User.findByPk(id)
    if(isEmpresa(id)) user = await Empresa.findByPk(id)
    if(isOng(id)) user = await Ong.findByPk(id)
    
    if(user){
        return done(null, user)
    } else {
        return done(notAuthorized.message, false)
    }   
}))

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (_erro: any, user: UserInstance | EmpresaInstance | OngInstance) => {
        req.user = user.id
        return user ? next() : next(notAuthorized.message)
    })(req, res, next)
}

export default passport;