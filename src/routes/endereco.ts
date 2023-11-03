import express from 'express';
import { verifyToken } from '../auth/verifyToken'
import { cadastrarEndereco } from '../controllers/enderecoController';

export const enderecoRoute = express();

enderecoRoute.post('/enderecos/cadastrar', verifyToken, cadastrarEndereco)