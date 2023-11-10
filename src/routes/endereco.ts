import express from 'express';
import { cadastrarEndereco } from '../controllers/enderecoController';

export const enderecoRoute = express();

enderecoRoute.post('/enderecos/cadastrar', cadastrarEndereco)