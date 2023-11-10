import express from 'express';
import { cadastrarOng, getOngByName, listarOngs } from '../controllers/ongController';

export const ongRoute = express()

ongRoute.get('/ongs', listarOngs)
ongRoute.get('/ongs/buscar/:nome', getOngByName)
ongRoute.post('/ongs/cadastrar', cadastrarOng)