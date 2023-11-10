import express from 'express';
import { cadastrarVaga, fazerInscricao, filtrarVagas, listarVagas, listarVagasOng, associarEmpresa } 
from '../controllers/vagaController';
import { verifyToken } from '../config/passport';

export const vagaRoute = express();

vagaRoute.get('/vagas/:causa', filtrarVagas)
vagaRoute.get('/vagas', listarVagas)
vagaRoute.get('/vagas/pesquisar/:nome', listarVagasOng)

vagaRoute.post('/vagas/cadastrar', verifyToken, cadastrarVaga)
vagaRoute.post('/vagas/inscricao/:vaga_id', verifyToken, fazerInscricao)

vagaRoute.post('/vagas/associar/:vaga_id', verifyToken, associarEmpresa)