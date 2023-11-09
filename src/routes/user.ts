import express from 'express';
import { cadastrarUsuario, deletarUsuario, listarUsuarios, getUserById, getUserByName, atualizarUsuario, perfil, adicionarAvatar } 
from '../controllers/userController';
import { verifyTokenUser } from '../config/passport';
import multer from 'multer';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/avatar')
    },
    filename: (req, file, cb) => {
        const id = req.user
        cb(null, id + '_' + file.fieldname + '.jpg')
    }
})
const upload = multer({
    storage: storageConfig,
    fileFilter: (req, file, cb) => {
        const mimetypes: string[] = ['image/jpeg', 'image/jpg', 'image/png']
        cb(null, mimetypes.includes(file.mimetype))
    },
    limits: { fieldSize: 1024 * 1024} // 1MB
})

export const userRoute = express();

userRoute.get('/usuarios', listarUsuarios)
userRoute.get('/usuarios/id/:id', getUserById)
userRoute.get('/usuarios/buscar/:nome', getUserByName)

userRoute.post('/usuarios/cadastrar', cadastrarUsuario)
userRoute.put('/usuarios/atualizar',verifyTokenUser, atualizarUsuario)
userRoute.delete('/usuarios/deletar',verifyTokenUser, deletarUsuario)

userRoute.get('/usuarios/perfil', verifyTokenUser, perfil)

userRoute.post('/usuarios/avatar', verifyTokenUser, upload.single('avatar'), adicionarAvatar)
