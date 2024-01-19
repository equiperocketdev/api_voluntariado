import { Request, Response } from 'express'
import { Politica } from '../models/politicaModel'

export const getPoliticas = async (req: Request, res: Response) => {
    try {
        const politicas = await Politica.findAll()

        return res.json(politicas)        
    }
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}