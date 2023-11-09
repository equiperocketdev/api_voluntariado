import { Request, Response } from 'express'
import { Vaga } from '../models/vagasModel'
import { Causa } from '../models/causaModel'
import { VagaUsuario } from '../models/vagaUsuarioModel'
import { Op, or } from 'sequelize'
import { Ong } from '../models/ongModel'

export const cadastrarVaga = async (req: Request, res: Response) => {
    const { titulo, sobre, data, qtd_vagas, causa_id } = req.body
    const ong_id = req.user

    if(!titulo || !sobre || !data || !qtd_vagas || !causa_id){
        return res.status(400).json("Digite todos os dados!")
    }

    try {
        const vaga = await Vaga.create({
            titulo,
            sobre,
            data,
            qtd_vagas,
            causa_id,
            ong_id
        });

        return res.status(201).send()
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const fazerInscricao = async (req: Request, res: Response) => {
    const usuario_id = req.user
    const { vaga_id } = req.params

    try {
        const inscricao = await VagaUsuario.create({
            usuario_id,
            vaga_id
        })
        const vaga = await Vaga.findByPk(vaga_id);
        if(vaga){
            const qtdInscritos = vaga.qtd_volun
            const qtd_volun = qtdInscritos + 1
            const updateVaga = { qtd_volun }

            await Vaga.update(updateVaga, {
                where: { id: vaga_id }
            })
        }

        return res.status(201).send()
        
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const filtrarVagas = async (req: Request, res: Response) => {
    const { causa } = req.params

    try {
        const vagas = await Causa.findAll({
            where: {
                nome: { [Op.iLike]: `%${causa}%` }
            },
            attributes: {
                exclude: ['id']
            },
            include: [{
                model: Vaga,
                attributes: {
                    exclude: ['id', 'cadastro', 'causa_id', 'ong_id']
                }
            }]
        })

        return res.status(200).json(vagas)        
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}

export const listarVagasOng = async (req: Request, res: Response) => {
    try {
        const { nome } = req.params
        const vagas = await Ong.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${nome}%`
                }
            },
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
        res.status(400).json("Deu ruim: " + error)
    }
} 

export const listarVagas = async (req: Request, res: Response) => {
    try {
        const vagas = await Vaga.findAll()

        return res.status(200).json(vagas)
        
    } catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}