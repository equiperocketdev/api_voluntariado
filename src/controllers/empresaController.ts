import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Empresa } from '../models/empresaModel'
import { criptografarSenha } from '../auth/bcrypt'
import { User } from '../models/userModel'
import { isEmpresa } from '../auth/verifyType'
import { Vaga } from '../models/vagasModel'
import { Endereco } from "../models/enderecoModel";

export const listarEmpresas = async (req: Request, res: Response) => {
    try {
        const empresas = await Empresa.findAll({
            attributes: {
                exclude: ['senha']
            },
            include: [{
                model: User,
                attributes: ['nome']
            }],
            order: ['nome']
        })
        
        return res.status(200).json(empresas)

    } catch (error) {
        res.status(400).json({message: error})
    }
}

export const getEmpresaByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params

        const empresa = await Empresa.findOne({
            where: { email },
            attributes: ['id', 'nome', 'email']
        })

        return res.status(200).json(empresa)
    } 
    catch (error) {
        res.status(400).json({message: error})
    }
}

export const getEmpresaById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const empresa = await Empresa.findByPk(id, {
            include: [{
                model: User,
                attributes: ['nome']
            }, {
                model: Vaga
            },
            {
                model: Endereco
            }],
            attributes: {
                exclude: ['senha']
            }
        })

        if(empresa){
            return res.status(200).json(empresa)
        }
        
        return res.status(404).json("Empresa não encontrada")

    } catch (error) {
        res.status(400).json({message: error})
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
        res.status(400).json("Mensagem: " + error)
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
        res.status(400).json({message: error})
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
        res.status(400).json({message: error})
    }
}

export const infoEmpresa = async (req: Request, res: Response) => {
    const id = req.user

    try {
        const empresa = await Empresa.findOne({ 
            where: { id },
            attributes: {
                exclude: ['senha']
            }
        });

        return res.status(200).json(empresa)
    } 
    catch (error) {
        res.status(400).json({message: error})
    }
}

export const listarVagasEmpresa = async (req: Request, res: Response) => {
    const id = req.user

    try {
        const vagas = await Empresa.findAll({
            where: { id },
            attributes: ['nome'],
            include: [{
                model: Vaga,
                attributes: {
                    exclude: ['ong_id', 'id', 'causa_id']
                }
            }]
        })

        return res.status(200).json(vagas)
        
    } catch (error) {
        res.status(400).json({message: error})
    }
}

export const adicionarLogo = async (req: Request, res: Response) => {
    const id = req.user

    try {
        if(req.file){
            const logo = req.file.filename
            const arquivo = { logo }

            await Empresa.update(arquivo, {
                where: { id }
            })
        }

        return res.status(201).send()
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}