import express from 'express';
import { cadastrarEndereco, getEndereco } from '../controllers/enderecoController';
import { verifyToken } from '../config/passport'

export const enderecoRoute = express();

enderecoRoute.post('/enderecos/cadastrar', verifyToken, cadastrarEndereco)
enderecoRoute.get('/endereco', verifyToken, getEndereco)