import { Request, Response } from 'express'
import { Endereco } from '../models/enderecoModel'
import { jwtDecode } from 'jwt-decode'
import { JwtPayload } from 'jsonwebtoken'

export const cadastrarEndereco = async (req: Request, res: Response) => {
    const { cep, rua, bairro, cidade, estado } = req.body
    let usuario_id: any, empresa_id: any, ong_id: any
    const id = req.user

    const { authorization } = req.headers
    if (!authorization){
        return res.status(401).json({ message: 'Não autorizado'})
    }

    if(!cep || !rua || !bairro || !cidade || !estado ){
        return res.status(400).json("Digite todos os dados!")
    }

    try {
        const [_bearer, token] = authorization.split(' ')
        const decoded = jwtDecode<JwtPayload>(token)
        const { tipo } = decoded

        if(tipo == 'user'){
            usuario_id = id
        } else if(tipo == 'empresa'){
            empresa_id = id
        } else if(tipo == 'ong'){
            ong_id = id
        }
        
        const endereco = await Endereco.create({
            cep,
            rua,
            bairro,
            cidade,
            estado,
            usuario_id,
            empresa_id,
            ong_id
        })
        return res.status(201).send()
        
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}