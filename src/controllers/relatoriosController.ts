import { Request, Response } from 'express'
import { User } from '../models/userModel'

export const relatorioEmpresa = async (req: Request, res: Response) => {
    const empresa_id = req.user
    let tempoVoluntariado = 0

    try {
        const usuarios = await User.findAll({
            where: { empresa_id }
        })

        const usuariosCadastrados = usuarios.length
        
        usuarios.forEach((usuario) => {
            tempoVoluntariado += usuario.tempo_volun
        })

        const relatorio = {
            usuariosCadastrados,
            tempoVoluntariado
        }

        return res.json(relatorio)
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}