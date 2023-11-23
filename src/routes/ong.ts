import express from 'express';
import { adicionarLogoOng, atualizarOng, cadastrarOng, getOngByEamil, getOngById, getOngByName, listarOngs } from '../controllers/ongController';
import { verifyToken } from '../config/passport'
import multer from 'multer';
import crypto from 'crypto'

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, hash) =>{
            const fileName = `${hash.toString('hex')}-logo-ong.jpg`;

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

export const ongRoute = express()

ongRoute.use('/file', express.static('images'))

ongRoute.get('/ongs', listarOngs)
ongRoute.get('/ongs/buscar/:nome', getOngByName)
ongRoute.get('/ongs/id/:id', getOngById)
ongRoute.get('/ongs/email/:email', getOngByEamil)

ongRoute.post('/ongs/cadastrar', cadastrarOng)
ongRoute.post('/ongs/atualizar', atualizarOng)
ongRoute.post('/ongs/logo', verifyToken, upload.single('logo'), adicionarLogoOng)