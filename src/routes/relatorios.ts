import express from 'express';
import { relatorioEmpresa } from '../controllers/relatoriosController';
import { verifyToken } from '../config/passport'

export const relatoriosRoute = express()

relatoriosRoute.get('/relatorio', verifyToken, relatorioEmpresa)