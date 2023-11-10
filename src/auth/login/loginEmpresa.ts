import { verificarSenha } from '../bcrypt'
import { Request, Response } from 'express'
import { Empresa } from '../../models/empresaModel'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const loginEmpresa = async (req: Request, res: Response) => {
    const { email, senha } = req.body

    try {
        const empresa = await Empresa.findOne({where: { email }})

        if(empresa){
            const autorizado = await verificarSenha(senha, empresa.senha)
            
            if(autorizado){
                const token = JWT.sign({id: empresa.id}, process.env.JWT_KEY as string, {expiresIn: '24h'})
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