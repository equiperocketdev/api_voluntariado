import express from 'express';
import { cadastrarUsuario, deletarUsuario, listarUsuarios, getUserById, getUserByName, atualizarUsuario, perfil } 
from '../controllers/userController';
import { verifyTokenUser } from '../config/passport';

export const userRoute = express();

userRoute.get('/usuarios', listarUsuarios)
userRoute.get('/usuarios/id/:id', getUserById)
userRoute.get('/usuarios/buscar/:nome', getUserByName)

userRoute.post('/usuarios/cadastrar', cadastrarUsuario)
userRoute.put('/usuarios/atualizar',verifyTokenUser, atualizarUsuario)
userRoute.delete('/usuarios/deletar',verifyTokenUser, deletarUsuario)

userRoute.get('/usuarios/perfil', verifyTokenUser, perfil)
