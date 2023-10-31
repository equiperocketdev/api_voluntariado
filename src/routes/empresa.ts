import express from 'express';
import { cadastrarEmpresa, getEmpresaByName, listarEmpresas } from '../controllers/empresaController';

export const empresaRoute = express();

empresaRoute.get('/empresas', listarEmpresas)
empresaRoute.get('/empresas/buscar/:nome', getEmpresaByName)
empresaRoute.post('/empresas/cadastrar', cadastrarEmpresa)