import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { criptografarSenha } from '../auth/bcrypt'
import { Ong, OngInstance } from '../models/ongModel'

export const listarOngs = async (req: Request, res: Response) => {
    try {
        const ongs = await Ong.findAll({
            attributes: {
                exclude: ['id', 'senha']
            },
            order: ['nome']
        })
        res.status(200).json(ongs)
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const cadastrarOng = async (req: Request, res: Response) => {
    const { cnpj, nome, email, senha, sobre } = req.body
    if (!cnpj || !nome || !email || !senha || !sobre) {
        return res.status(400).json("Digite todos os dados!")
    }
    
    try {
        const ong = await Ong.create({
            cnpj,
            nome,
            email,
            senha: await criptografarSenha(senha),
            sobre
        })
        res.status(201).send()
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const getOngByName = async (req: Request, res: Response) => {
    try {
        const { nome } = req.params
        const ongs = Ong.findAll({
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

        return res.status(200).json(ongs)

    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}