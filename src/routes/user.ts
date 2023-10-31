import express from 'express';
import { cadastrarUsuario, deletarUsuario, listarUsuarios, getUserById, getUserByName, atualizarUsuario, perfil } 
from '../controllers/userController';
import { login } from '../auth/login';
import { verifyToken } from '../config/passport';

export const userRoute = express();

userRoute.get('/usuarios', listarUsuarios)
userRoute.get('/usuarios/id/:id', getUserById)
userRoute.get('/usuarios/buscar/:nome', getUserByName)

userRoute.post('/usuarios/cadastrar', cadastrarUsuario)
userRoute.put('/usuarios/atualizar/:id', atualizarUsuario)
userRoute.delete('/usuarios/deletar',verifyToken, deletarUsuario)

userRoute.post('/usuarios/login', login)
userRoute.get('/usuarios/perfil', verifyToken, perfil)
