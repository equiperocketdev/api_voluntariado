import express from 'express';
import { atualizarEmpresa, cadastrarEmpresa, deletarEmpresa, getEmpresaById, getEmpresaByName, infoEmpresa, listarEmpresas } 
from '../controllers/empresaController';
import { verifyToken } from '../auth/verifyToken'

export const empresaRoute = express();

empresaRoute.get('/empresas', listarEmpresas)
empresaRoute.get('/empresas/buscar/:nome', getEmpresaByName)
empresaRoute.get('/empresas/id/:id', getEmpresaById)
empresaRoute.get('/empresas/info', infoEmpresa)


empresaRoute.post('/empresas/cadastrar', cadastrarEmpresa)
empresaRoute.put('/empresas/atualizar', verifyToken, atualizarEmpresa)

empresaRoute.delete('/empresas/deletar', verifyToken, deletarEmpresa)