import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { userRoute } from './routes/user';
import { empresaRoute } from './routes/empresa';
import passport from 'passport';
import path from 'path';
import { ongRoute } from './routes/ong';
import bodyParser from 'body-parser';
import { enderecoRoute } from './routes/endereco';
import { vagaRoute } from './routes/vaga';
import { loginRoute } from './routes/login';
import { relatoriosRoute } from './routes/relatorios';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(passport.initialize());
app.use(bodyParser.json())
app.use(express.json())

app.use(userRoute)
app.use(empresaRoute)
app.use(ongRoute)
app.use(enderecoRoute)
app.use(vagaRoute)
app.use(loginRoute)
app.use(relatoriosRoute)

app.listen(process.env.PORT || 3000)