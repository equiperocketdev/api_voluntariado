import { Request, Response } from 'express'
import { User } from '../models/userModel'
import { Vaga } from '../models/vagasModel'
import { Ods } from '../models/odsModel'
import { Causa } from '../models/causaModel'
import { Politica } from '../models/politicaModel'
import { VagaEmpresa } from '../models/vagaEmpresaModel'
import { Empresa } from '../models/empresaModel'
import { Ong } from '../models/ongModel'

export const relatorioEmpresa = async (req: Request, res: Response) => {
    const empresa_id = req.user
    let tempoVoluntariado = 0
    let pessoasImpactadas = 0
    let causas: number[] = []
    let odss: number[] = []
    let politicas: number[] = []

    try {
        const usuarios = await User.findAll({
            where: { empresa_id }
        })

        const usuariosCadastrados = usuarios.length
        
        usuarios.forEach((usuario) => {
            tempoVoluntariado += usuario.tempo_volun
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
            if(vaga){
                pessoasImpactadas += vaga?.impacto
                causas.push(vaga.causa_id)
                odss.push(vaga.ods_id)
                politicas.push(vaga.politica_id)
            }
        }
        //Principal Causa
        let countsCausas: {[key: number]: number} = {}
        causas.forEach((count) => {
            countsCausas[count] = (countsCausas[count] || 0) + 1;
        })
        const maxValueCausa = Math.max(...Object.values(countsCausas))
        const idCausa = Number(Object.keys(countsCausas).find(key => countsCausas[Number(key)] == maxValueCausa))
        const causa = await Causa.findByPk(idCausa)

        //Principal Ods
        let countsOds: {[key: number]: number} = {}
        odss.forEach((count) => {
            countsOds[count] = (countsOds[count] || 0) + 1;
        })
        const maxValueOds = Math.max(...Object.values(countsOds))
        const idOds = Number(Object.keys(countsOds).find(key => countsOds[Number(key)] == maxValueOds))
        const ods = await Ods.findByPk(idOds)

        //Principal Politica
        let countsPolitica: {[key: number]: number} = {}
        politicas.forEach((count) => {
            countsPolitica[count] = (countsPolitica[count] || 0) + 1;
        })
        const maxValuePolitica = Math.max(...Object.values(countsPolitica))
        const idPolitica = Number(Object.keys(countsPolitica)
        .find(key => countsPolitica[Number(key)] == maxValuePolitica))
        const politica = await Politica.findByPk(idPolitica)

        const relatorio = {
            usuariosCadastrados,
            tempoVoluntariado,
            pessoasImpactadas,
            idCausa,
            causa: causa?.nome,
            ods: ods?.nome,
            politica: politica?.id == 1 ? "Não há informações suficientes" : politica?.nome,
            qtdVagas: vagasAssociadas.length,
        }

        return res.json(relatorio)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const relatorioGeral = async (req: Request, res: Response) => {
    const id = req.user
    let tempoVoluntariado = 0
    let pessoasImpactadas = 0
    let causas: number[] = []
    let odss: number[] = []
    let politicas: number[] = []

    try {
        if(id != 75017){
            return res.status(401).json({mensagem: "Somente super usuarios têm permissão!"})
        }
        const usuarios = await User.findAll()
        const vagas = await Vaga.findAll()
        const empresas = await Empresa.findAll()
        const instituicoes = await Ong.findAll()
        
        vagas.forEach((vaga) => {
            if(vaga.finalizada){
                pessoasImpactadas += vaga.impacto
                tempoVoluntariado += vaga.duracao
                causas.push(vaga.causa_id)
                odss.push(vaga.ods_id)
                politicas.push(vaga.politica_id)
            }
        })

        //Principal Causa
        let countsCausas: {[key: number]: number} = {}
        causas.forEach((count) => {
            countsCausas[count] = (countsCausas[count] || 0) + 1;
        })
        const maxValueCausa = Math.max(...Object.values(countsCausas))
        const idCausa = Number(Object.keys(countsCausas).find(key => countsCausas[Number(key)] == maxValueCausa))
        const causa = await Causa.findByPk(idCausa)

        //Principal Ods
        let countsOds: {[key: number]: number} = {}
        odss.forEach((count) => {
            countsOds[count] = (countsOds[count] || 0) + 1;
        })
        const maxValueOds = Math.max(...Object.values(countsOds))
        const idOds = Number(Object.keys(countsOds).find(key => countsOds[Number(key)] == maxValueOds))
        const ods = await Ods.findByPk(idOds)

        //Principal Politica
        let countsPolitica: {[key: number]: number} = {}
        politicas.forEach((count) => {
            countsPolitica[count] = (countsPolitica[count] || 0) + 1;
        })
        const maxValuePolitica = Math.max(...Object.values(countsPolitica))
        const idPolitica = Number(Object.keys(countsPolitica)
        .find(key => countsPolitica[Number(key)] == maxValuePolitica))
        const politica = await Politica.findByPk(idPolitica)

        const relatorio = {
            tempoVoluntariado,
            pessoasImpactadas,
            vagas: vagas.length,
            empresas: empresas.length,
            usuarios: usuarios.length,
            instituicoes: instituicoes.length,
            causa: causa?.nome,
            ods: ods?.nome,
            politica: politica?.id == 1 ? "Informações insuficientes" : politica?.nome,
        }

        return res.json(relatorio)
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}