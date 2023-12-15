import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { Vaga } from '../models/vagasModel'
import { Empresa } from '../models/empresaModel'
import { VagaEmpresa } from '../models/vagaEmpresaModel'

export const relatorioEmpresa = async (req: Request, res: Response) => {
    const empresa_id = req.user
    let tempoVoluntariado = 0
    let pessoasImpcatadas = 0

    try {
        const usuarios = await User.findAll({
            where: { empresa_id }
        })

        const usuariosCadastrados = usuarios.length
        
        usuarios.forEach((usuario) => {
            tempoVoluntariado += usuario.tempo_volun
        })

        const vagas = await Vaga.findAll({
            where: { empresa_id }
        })
        vagas.forEach((vaga) => {
            pessoasImpcatadas += vaga.impacto
        })

        const vagasAssociadas = await VagaEmpresa.findAll({
            where: {
                empresa_id
            }
        })
        for(let i = 0; i < vagasAssociadas.length; i++) {
            const vaga = await Vaga.findOne({
                where: {
                    id: vagasAssociadas[i].vaga_id
                }
            })
            if(vaga) pessoasImpcatadas += vaga?.impacto
        }

        const relatorio = {
            usuariosCadastrados,
            tempoVoluntariado,
            pessoasImpcatadas,
            vagasAssociadas
        }

        return res.json(relatorio)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}