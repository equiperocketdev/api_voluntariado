import express from 'express';
import { verifyToken } from '../auth/verifyToken';
import { cadastrarVaga, fazerInscricao, filtrarVagas } from '../controllers/vagaController';

export const vagaRoute = express();

vagaRoute.get('/vagas/:causa', filtrarVagas)

vagaRoute.post('/vagas/cadastrar', verifyToken, cadastrarVaga)
vagaRoute.post('/vagas/inscricao/:vaga_id', verifyToken, fazerInscricao)