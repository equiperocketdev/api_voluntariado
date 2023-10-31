import { verificarSenha } from './bcrypt'
import { Request, Response } from 'express'
import { User, UserInstance } from '../models/userModel'
import { Empresa, EmpresaInstance } from '../models/empresaModel'
import { Ong, OngInstance } from '../models/ongModel'
import JWT from 'jsonwebtoken'
import dotenv from 'dotenv'


export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body
    const { tipo } = req.params
    dotenv.config()

    let user: UserInstance | EmpresaInstance | OngInstance | any

    try {
        if(tipo == 'user'){
            user = await User.findOne({where: { email }})
        } 
        else if(tipo == 'empresa'){
            user = await Empresa.findOne({where: { email }})
        } 
        else if(tipo == 'ong'){
            user = await Ong.findOne({where: { email }})
        }

        if(user){
            const autorizado = await verificarSenha(senha, user.senha)
            
            if(autorizado){
                const token = JWT.sign({id: user.id, tipo}, process.env.JWT_KEY as string, {expiresIn: '24h'})
                return res.json(token);
            }
            else {
                return res.status(401).json(`Senha incorreta!`)
            }
        }
        else {
            return res.status(404).json("Não encontrado!")
        }

    } 
    catch (error) {
        res.json("Deu ruim: " + error)
    }
}