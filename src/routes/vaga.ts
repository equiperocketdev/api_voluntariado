import express from 'express';
import { cadastrarVaga, fazerInscricao, filtrarVagas, listarVagas, listarVagasOng, associarEmpresa, listarVagasEmpresa, adicionarCapa, listarVagasCidade, getVaga, verificaAssociacao, removeAssociacao } 
from '../controllers/vagaController';
import { verifyToken } from '../config/passport';
import multer from 'multer';
import crypto from 'crypto'
import { getCausas } from '../controllers/causaController';
import { getOds } from '../controllers/odsController';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images')
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(8, (err, hash) =>{
            const fileName = `${hash.toString('hex')}-capa.jpg`;

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
    limits: { fieldSize: 2 * 1024 * 1024} // 2MB
})

export const vagaRoute = express();

vagaRoute.use('/file', express.static('images'))

vagaRoute.get('/vagas/:causa', filtrarVagas)
vagaRoute.get('/vagas', listarVagas)
vagaRoute.get('/vagas/ong/:nome', listarVagasOng)
vagaRoute.get('/vagas/cidade/:cidade', listarVagasCidade)
vagaRoute.get('/vagas/empresa/listar', verifyToken, listarVagasEmpresa)
vagaRoute.get('/vagas/info/:vaga_id', getVaga)
vagaRoute.get('/vagas/verificar/empresa/:vaga_id', verifyToken, verificaAssociacao)

vagaRoute.post('/vagas/cadastrar', verifyToken, upload.single('capa'), cadastrarVaga)
vagaRoute.post('/vagas/capa/:id', verifyToken, upload.single('capa'), adicionarCapa)
vagaRoute.post('/vagas/inscricao/:vaga_id', verifyToken, fazerInscricao)
vagaRoute.post('/vagas/associar/:vaga_id', verifyToken, associarEmpresa)
vagaRoute.delete('/vagas/deletar/associacao/:vaga_id', verifyToken, removeAssociacao)

vagaRoute.get('/causas', getCausas)
vagaRoute.get('/ods', getOds)