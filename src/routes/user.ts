import express from 'express';
import { cadastrarUsuario, deletarUsuario, listarUsuariosEmpresa, getUserById, getUserByName, atualizarUsuario, perfil, adicionarAvatar, getUserByEmail } from '../controllers/userController';
import { verifyToken } from '../config/passport';
import multer from 'multer';
import crypto from 'crypto'

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, hash) =>{
            const fileName = `${hash.toString('hex')}-avatar.jpg`;

            cb(null, fileName)
        })
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

userRoute.use('/file', express.static('images'))

userRoute.get('/usuarios', verifyToken, listarUsuariosEmpresa)
userRoute.get('/usuarios/id/:id', getUserById)
userRoute.get('/usuarios/email/:email', getUserByEmail)
userRoute.get('/usuarios/buscar/:nome', getUserByName)

userRoute.post('/usuarios/cadastrar', cadastrarUsuario)
userRoute.put('/usuarios/atualizar',verifyToken, atualizarUsuario)
userRoute.delete('/usuarios/deletar',verifyToken, deletarUsuario)

userRoute.get('/usuarios/perfil', verifyToken, perfil)

userRoute.post('/usuarios/avatar', verifyToken, upload.single('avatar'), adicionarAvatar)
