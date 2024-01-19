import express from 'express';
import { relatorioEmpresa, relatorioGeral } from '../controllers/relatoriosController';
import { verifyToken } from '../config/passport'

export const relatoriosRoute = express()

relatoriosRoute.get('/relatorio', verifyToken, relatorioEmpresa)
relatoriosRoute.get('/geral/relatorio', verifyToken, relatorioGeral)