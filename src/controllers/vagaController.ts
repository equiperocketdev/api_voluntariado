import { Request, Response } from 'express'
import { Vaga } from '../models/vagasModel'
import { Causa } from '../models/causaModel'
import { VagaUsuario } from '../models/vagaUsuarioModel'
import { VagaEmpresa } from '../models/vagaEmpresaModel'
import { Op } from 'sequelize'
import { Ong } from '../models/ongModel'
import { Ods } from '../models/odsModel'
import { Empresa } from '../models/empresaModel'
import { User } from '../models/userModel'

export const cadastrarVaga = async (req: Request, res: Response) => {
    const { titulo, sobre, data, qtd_vagas, causa_id, ods_id, duracao, impacto, politica, capa, cep, rua, bairro, cidade, estado, disponivel } = req.body
    const id = req.user

    if(!titulo || !sobre || !data || !qtd_vagas || !causa_id || !ods_id ||
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
                duracao,
                impacto,
                politica,
                qtd_vagas: parseInt(qtd_vagas),
                causa_id,
                ong_id: id,
                ods_id,
                capa,
                cep,
                rua,
                bairro,
                cidade,
                estado,
                disponivel
            });
            return res.status(201).send()
        } else if(empresa){
            const vaga = await Vaga.create({
                titulo,
                sobre,
                data,
                duracao,
                impacto,
                politica,
                qtd_vagas,
                causa_id,
                empresa_id: id,
                ods_id,
                capa,
                cep,
                rua,
                bairro,
                cidade,
                estado,
                disponivel
            });
            const associar = await VagaEmpresa.create({
                empresa_id: id,
                vaga_id: vaga.id
            })
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
        const associado = await VagaEmpresa.findOne({
            where: {
                [Op.and]: [
                    { empresa_id },
                    { vaga_id }
                ]
            }
        })
        if(associado) return res.status(400).send()

        if(vaga){
            const associar = await VagaEmpresa.create({
                empresa_id,
                vaga_id
            })

            return res.status(200).send()
        }
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const removeAssociacao = async (req: Request, res: Response) => {
    const empresa_id = req.user
    const { vaga_id } = req.params

    try {
        const associado = await VagaEmpresa.findOne({
            where: {
                [Op.and]: [
                    { empresa_id },
                    { vaga_id }
                ]
            }
        })
        if(associado){
            await associado.destroy()
            return res.status(201).send()
        }
        
        return res.status(400).json("Objeto não deletado.")
    } 
    catch (error) {
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

export const removerInscricao = async (req: Request, res: Response) => {
    const usuario_id = req.user
    const { vaga_id } = req.params

    try {
        const inscricao = await VagaUsuario.findOne({
            where: {
                [Op.and]: [
                    { usuario_id },
                    { vaga_id }
                ]
            }
        })
        if(inscricao){
            await inscricao.destroy()
            return res.status(201).send()
        }
        
        return res.status(400).json("Objeto não deletado.")
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const filtrarVagas = async (req: Request, res: Response) => {
    const causa = req.params.causa

    try {
        const vagas = await Vaga.findAll({
            where: {
                causa_id: causa
            },
            limit: 10,
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
            limit: 20,
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

export const listarVagasEmpresaLogada = async (req: Request, res: Response) => {
    try {
        const id = req.user

        const vagas = await Vaga.findAll({
            where: {
                empresa_id: id
            },
            include: [{
                model: Empresa,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            }]
        })

        if(vagas){
            return res.status(200).json(vagas)
        }
    
        return res.status(200).json("Ocorreu algum erro.")        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const listarVagasEmpresa = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const vagas = await Vaga.findAll({
            where: {
                empresa_id: id
            },
            include: [{
                model: Empresa,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            }]
        })

        if(vagas){
            return res.status(200).json(vagas)
        }
    
        return res.status(200).json("Ocorreu algum erro.")        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const listarVagasCidade = async (req: Request, res: Response) => {
    const id = req.user
    const { cidade } = req.params

    try {
        const vagas = await Vaga.findAll({
            where: {
                cidade: {
                    [Op.iLike]: `%${cidade.trim()}%`
                }
            }
        })
        
        return res.status(200).json(vagas)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const getVaga = async (req: Request, res: Response) => {
    const id = req.user
    const { vaga_id } = req.params

    try {
        const vaga = await Vaga.findByPk(vaga_id, {
            include: [
                { model: Causa }, 
                { model: Ods },
                { model: Empresa, attributes: { exclude: ['senha']} },
                { model: Ong, attributes: { exclude: ['senha']} },
                { model: User, attributes: { exclude: ['senha']} }
            ]
        })
        
        return res.status(200).json(vaga)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const verificaAssociacao = async (req: Request, res: Response) => {
    const empresa_id = req.user
    const { vaga_id } = req.params

    try {
        const associado = await VagaEmpresa.findOne({
            where: {
                [Op.and]: [
                    { empresa_id },
                    { vaga_id }
                ]
            }
        })
        if(!associado) return res.send()

        return res.status(200).json(associado)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const verificaInscricao = async (req: Request, res: Response) => {
    const usuario_id = req.user
    const { vaga_id } = req.params

    try {
        const inscrito = await VagaUsuario.findOne({
            where: {
                [Op.and]: [
                    { usuario_id },
                    { vaga_id }
                ]
            }
        })
        if(!inscrito) return res.send()

        return res.status(200).json(inscrito)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const ultimasVagas = async (req: Request, res: Response) => {
    try {
        const vagas = await Vaga.findAll({
            limit: 10,
            include: [{
                model: Ong,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            },
            {
                model: Empresa,
                attributes: ['id', 'nome', 'email', 'logo', 'sobre']
            }]
        })

        return res.json(vagas)
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}