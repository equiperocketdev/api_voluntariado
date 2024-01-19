import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Causa } from '../models/causaModel' 

export const getCausas = async (req: Request, res: Response) => {
    try {
        const causas = await Causa.findAll()

        return res.status(200).json(causas)        
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}