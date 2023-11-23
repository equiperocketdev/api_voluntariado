import express from 'express';
import { adicionarLogo, atualizarEmpresa, cadastrarEmpresa, deletarEmpresa, getEmpresaByEmail, getEmpresaById, infoEmpresa, listarEmpresas, listarVagasEmpresa } from '../controllers/empresaController';
import { verifyToken } from '../config/passport'
import multer from 'multer';
import crypto from 'crypto'

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, hash) =>{
            const fileName = `${hash.toString('hex')}-logo.jpg`;

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

export const empresaRoute = express();

empresaRoute.use('/file', express.static('images'))

empresaRoute.get('/empresas', listarEmpresas)
empresaRoute.get('/empresas/buscar/:email', getEmpresaByEmail)
empresaRoute.get('/empresas/id/:id', getEmpresaById)
empresaRoute.get('/empresas/info', verifyToken, infoEmpresa)
empresaRoute.get('/empresas/vagas', verifyToken, listarVagasEmpresa)

empresaRoute.post('/empresas/cadastrar', cadastrarEmpresa)
empresaRoute.post('/empresas/logo', verifyToken, upload.single('logo'), adicionarLogo)
empresaRoute.put('/empresas/atualizar', verifyToken, atualizarEmpresa)
empresaRoute.delete('/empresas/deletar', verifyToken, deletarEmpresa)