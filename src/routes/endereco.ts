import express from 'express';
import { cadastrarEndereco } from '../controllers/enderecoController';
import { verifyToken } from '../config/passport'

export const enderecoRoute = express();

enderecoRoute.post('/enderecos/cadastrar', verifyToken, cadastrarEndereco)