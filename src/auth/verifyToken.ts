import { Request, Response, NextFunction } from 'express'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from 'jwt-decode'
import dotenv from 'dotenv'

dotenv.config()

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    if (!authorization){
        return res.status(401).json({ message: 'Não autorizado'})
    }

    try {
        const [_bearer, token] = authorization.split(' ')
        const decoded = jwtDecode<JwtPayload>(token)
        const { id } = decoded

        req.user = id

        next()
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)    
    }
}