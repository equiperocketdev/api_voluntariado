import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRoute } from './routes/user';
import { empresaRoute } from './routes/empresa';
import passport from 'passport';
import path from 'path';
import { ongRoute } from './routes/ong';
import bodyParser from 'body-parser';
import { login } from './auth/login';
import { enderecoRoute } from './routes/endereco';
import { vagaRoute } from './routes/vaga';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.json())
app.use(express.json())
app.use(cors());

app.post('/login/:tipo', login)
app.use(userRoute)
app.use(empresaRoute)
app.use(ongRoute)
app.use(enderecoRoute)
app.use(vagaRoute)

app.listen(process.env.PORT || 3000)