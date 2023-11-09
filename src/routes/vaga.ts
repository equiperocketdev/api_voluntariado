import express from 'express';
import { verifyToken } from '../auth/verifyToken';
import { cadastrarVaga, fazerInscricao, filtrarVagas, listarVagasOng } from '../controllers/vagaController';

export const vagaRoute = express();

vagaRoute.get('/vagas/:causa', filtrarVagas)
vagaRoute.get('/vagas', listarVagasOng)
vagaRoute.get('/vagas/pesquisar/:nome', listarVagasOng)

vagaRoute.post('/vagas/cadastrar', verifyToken, cadastrarVaga)
vagaRoute.post('/vagas/inscricao/:vaga_id', verifyToken, fazerInscricao)