import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Empresa } from '../models/empresaModel'
import { criptografarSenha } from '../auth/bcrypt'
import { User } from '../models/userModel'

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
        res.json("Deu ruim: " + error)
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
            order: ['id']
        })
        return res.status(200).json(empresas)

    } catch (error) {
        res.json("Deu ruim: " + error)
    }
}

export const cadastrarEmpresa = async (req: Request, res: Response) => {
    const { cnpj, nome, email, senha, sobre } = req.body

    if (!cnpj || !nome || !email || !senha || !sobre) {
        return res.status(400).json("Digite todos os dados!")
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
    const { id } = req.params
    const { cnpj, nome, email, sobre  } = req.body

    const empresa = { cnpj, nome, email, sobre }

    try {
        await Empresa.update(empresa, {
            where: { id }
        })
        return res.status(200).send()

    } catch (error) {
        res.json("Deu ruim: " + error)
    }
}