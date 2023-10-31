import { verificarSenha } from './bcrypt'
import { Request, Response } from 'express'
import { User } from '../models/userModel'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body
    dotenv.config()

    try {
        const user = await User.findOne({where: { email }})
        if(user){
            const autorizado = await verificarSenha(senha, user.senha)
            
            if(autorizado){
                const token = JWT.sign({id: user.id}, process.env.JWT_KEY as string, {expiresIn: '24h'})
                return res.json(token);
            }
            else {
                return res.status(401).json(`Senha incorreta!`)
            }
        } 
        else {
            return res.status(404).json("Usuário não encontrado!")
        }
    } 
    catch (error) {
        res.json("Deu ruim: " + error)
    }
}