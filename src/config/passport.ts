import passport from "passport";
import dotenv from 'dotenv';
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { User, UserInstance } from "../models/userModel";
import { Request, Response, NextFunction } from "express";

dotenv.config()

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_KEY as string
}

const notAuthorized = { 
    status: 401, 
    message: 'Não autorizado'
}

passport.use(new JWTStrategy(options, async (payload, done) => {
    const user = await User.findByPk(payload.id)
    if(user){
        return done(null, user)
    } else {
        return done(notAuthorized, false)
    }   
}))

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', (erro: any, user: UserInstance) => {
        const { id } = user
        req.user = id
        return user ? next() : next(notAuthorized.message)
    })(req, res, next)
}

export default passport;