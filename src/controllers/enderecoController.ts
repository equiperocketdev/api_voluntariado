import { Request, Response } from 'express'
import { Endereco, EnderecoInstance } from '../models/enderecoModel'
import { isUsuario, isEmpresa, isOng} from '../auth/verifyType'
import { UserInstance } from '../models/userModel'
import { Empresa } from '../models/empresaModel'

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

    if(isUsuario(id)) usuario_id = id
    if(isEmpresa(id)) empresa_id = id
    if(isOng(id)) ong_id = id

    try {
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
        res.status(400).json("Mensagem: " + error)
    }
}

export const getEndereco = async (req: Request, res: Response) => {
    const id = req.user

    try {
        if(isEmpresa(id)){
            const endereco = await Endereco.findOne({
                where: {
                    empresa_id: id
                }
            })
            return res.json(endereco)
        }
        else if(isUsuario(id)){
            const endereco = await Endereco.findOne({
                where: {
                    usuario_id: id
                }
            })
            return res.json(endereco)
        }
        else if(isOng(id)){
            const endereco = await Endereco.findOne({
                where: {
                    ong_id: id
                }
            })
            return res.json(endereco)
        }

    return res.status(400).json("Endereço não encontrado")        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}