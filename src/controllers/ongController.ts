import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { criptografarSenha } from '../auth/bcrypt'
import { Ong, OngInstance } from '../models/ongModel'

export const listarOngs = async (req: Request, res: Response) => {
    try {
        const ongs = await Ong.findAll({
            attributes: {
                exclude: ['senha']
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
    if (!nome || !email || !senha || !sobre) {
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
        const nome = req.params.nome
        const ongs = await Ong.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${nome}%`
                }
            },
            attributes: {
                exclude: ['senha']
            }
        })
        res.status(200).json(ongs)
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const atualizarOng = async (req: Request, res: Response) => {
    const { cnpj, nome, email, sobre  } = req.body
    const id = req.user

    const ong = { cnpj, nome, email, sobre }
    
    try {
        await Ong.update(ong, {
            where: { id }
        })
        return res.status(201).send()        
    }
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const deletarOng = async (req: Request, res: Response) => {
    try {
        const id = req.user
        const ong = await Ong.findOne({ where: { id } })
    
        if(ong){
            await ong.destroy()
            return res.status(200).send()
        }
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const adicionarLogoOng = async (req: Request, res: Response) => {
    const id = req.user

    try {
        if(req.file){
            const logo = req.file.filename
            const arquivo = { logo }

            await Ong.update(arquivo, {
                where: { id }
            })
        }

        return res.status(201).send()
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}