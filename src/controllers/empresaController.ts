import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Empresa } from '../models/empresaModel'
import { criptografarSenha } from '../auth/bcrypt'
import { User } from '../models/userModel'
import JWT, { JwtPayload } from 'jsonwebtoken'
import { jwtDecode } from "jwt-decode";

export const listarEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await Empresa.findAll({
            attributes: {
                exclude: ['id', 'senha']
            },
            include: [{
                model: User,
                attributes: ['nome']
            }],
            order: ['nome']
        })
        
        return res.status(200).json(empresas)

    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const getEmpresaByName = async (req: Request, res: Response) => {
    try {
        const { nome } = req.params
        const empresas = await Empresa.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${nome}%`
                }
            },
            attributes: {
                exclude: ['id', 'senha']
            },
            order: ['nome']
        })
        return res.status(200).json(empresas)

    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const getEmpresaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const empresa = await Empresa.findByPk(id, {
            include: [{
                model: User,
                attributes: ['nome']
            }],
            attributes: {
                exclude: ['id', 'senha']
            }
        })

        if(empresa){
            return res.status(200).json(empresa)
        }
        
        return res.status(404).json("Empresa não encontrada")

    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const cadastrarEmpresa = async (req: Request, res: Response) => {
    const { cnpj, nome, email, senha, sobre } = req.body

    if (!cnpj || !nome || !email || !senha || !sobre) {
        return res.status(400).json("Digite todos os dados!")
    }
    if(cnpj.length != 14){
        return res.status(400).json("Formato de CNPJ inválido")
    }

    try {
        const empresa = await Empresa.create({
            cnpj,
            nome,
            email,
            senha: await criptografarSenha(senha),
            sobre
        })
        return res.status(201).send()

    } catch (error) {
        res.json("Deu ruim: " + error)
    }
}

export const atualizarEmpresa = async (req: Request, res: Response) => {
    const { cnpj, nome, email, sobre  } = req.body
    const id = req.user

    const empresa = { cnpj, nome, email, sobre }
    
    try {
        await Empresa.update(empresa, {
            where: { id }
        })
        return res.status(201).send()        
    }
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const deletarEmpresa = async (req: Request, res: Response) => {
    try {
        const id = req.user
        const empresa = await Empresa.findOne({ where: { id } })
    
        if(empresa){
            await empresa.destroy()
            return res.status(200).send()
        }
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}