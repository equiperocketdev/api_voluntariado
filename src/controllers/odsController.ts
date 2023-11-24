import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { Ods } from '../models/odsModel' 

export const getOds = async (req: Request, res: Response) => {
    try {
        const ods = await Ods.findAll()

        return res.status(200).json(ods)        
    } 
    catch (error) {
        res.status(400).json("Deu ruim: " + error)
    }
}