import { verificarSenha } from '../bcrypt'
import { Request, Response } from 'express'
import { Ong } from '../../models/ongModel'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const loginOng = async (req: Request, res: Response) => {
    const { email, senha } = req.body

    try {
        const ong = await Ong.findOne({where: { email }})

        if(ong){
            const autorizado = await verificarSenha(senha, ong.senha)
            
            if(autorizado){
                const token = JWT.sign({id: ong.id}, process.env.JWT_KEY as string, {expiresIn: '24h'})
                return res.json(token);
            }
            else {
                return res.status(401).json({message: "Senha incorreta"})
            }
        }

        return res.status(404).json("Não encontrado!")
    } 
    catch (error) {
        res.json("Deu ruim: " + error)
    }
}