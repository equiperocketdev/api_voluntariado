import express from 'express';
import { loginUser } from '../auth/login/loginUser';
import { loginEmpresa } from '../auth/login/loginEmpresa';
import { loginOng } from '../auth/login/loginOng';

export const loginRoute = express();

loginRoute.post('/usuarios/login', loginUser)
loginRoute.post('/empresas/login', loginEmpresa)
loginRoute.post('/ongs/login', loginOng)
