import { Request, Response } from 'express'
import { Vaga } from '../models/vagasModel'
import { Causa } from '../models/causaModel'
import { VagaUsuario } from '../models/vagaUsuarioModel'
import { Op } from 'sequelize'
import { Ong } from '../models/ongModel'
import { User } from '../models/userModel'
import { Empresa } from '../models/empresaModel'
import { Endereco } from '../models/enderecoModel'

export const cadastrarVaga = async (req: Request, res: Response) => {
    const { titulo, sobre, data, qtd_vagas, causa_id, capa, cep, rua, bairro, cidade, estado } = req.body
    const id = req.user

    if(!titulo || !sobre || !data || !qtd_vagas || !causa_id ||
        !cep || !rua || !bairro || !cidade || !estado){
        return res.status(400).json("Digite todos os dados!")
    }

    try {     
        const ong = await Ong.findOne({ where: { id }})
        const empresa = await Empresa.findOne({ where: { id }})

        if(ong){
            const vaga = await Vaga.create({
                titulo,
                sobre,
                data,
                qtd_vagas: parseInt(qtd_vagas),
                causa_id,
                ong_id: id,
                capa,
                cep,
                rua,
                bairro,
                cidade,
                estado
            });
            return res.status(201).send()
        } else if(empresa){
            const vaga = await Vaga.create({
                titulo,
                sobre,
                data,
                qtd_vagas,
                causa_id,
                empresa_id: id,
                capa,
                cep,
                rua,
                bairro,
                cidade,
                estado
            });
            return res.status(201).send()
        }

        return res.status(400).json("Ação não autorizada!")
    } 
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const adicionarCapa = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        if(req.file){
            const capa = req.file.filename
            const arquivo = { capa }

            await Vaga.update(arquivo, {
                where: { id }
            })
        }

        return res.status(201).send()
    } catch (error) {
        res.status(300).json("Deu ruim: " + error)
    }
}

// Empresa assume a responsabilidade pela vaga
export const associarEmpresa = async (req: Request, res: Response) => {
    const empresa_id = req.user
    const { vaga_id } = req.params

    try {
        const vaga = await Vaga.findOne({ where: { id: vaga_id }})

        if(vaga){
            const updateVaga = { empresa_id }

            await Vaga.update(updateVaga, {
                where: { id: vaga_id }
            })
            return res.status(200).send()
        }
        return res.status(400).send()
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

// Usuario se inscreve para uma vaga
export const fazerInscricao = async (req: Request, res: Response) => {
    const id = req.user
    const { vaga_id } = req.params

    try {
        const inscricao = await VagaUsuario.create({
            usuario_id: id,
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
        res.status(400).json("Mensagem: " + error)
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
                    exclude: ['cadastro', 'causa_id', 'ong_id']
                }
            }]
        })

        return res.status(200).json(vagas)        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
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
                model: Vaga
            }]
        })
        return res.status(200).json(vagas)
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
} 

export const listarVagas = async (req: Request, res: Response) => {
    try {
        const vagas = await Vaga.findAll({
            include: [{
                model: Ong,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            },
            {
                model: Empresa,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            }]
        })

        return res.status(200).json(vagas)
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const listarVagasEmpresa = async (req: Request, res: Response) => {
    try {
        const id = req.user
        const usuario = await User.findOne({ where: { id } })

        if(usuario){
            const vagas = await Vaga.findAll({
                where: {
                    empresa_id: usuario.empresa_id
                }
            })
            return res.status(200).json(vagas)
        }
    
        return res.status(200).json("Ocorreu algum erro.")        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}