import express from 'express';
import dotenv from 'dotenv';
import { userRoute } from './src/routes/user';
import { empresaRoute } from './src/routes/empresa';
import passport from 'passport';
import path from 'path';
import { ongRoute } from './src/routes/ong';
import bodyParser from 'body-parser';
import { login } from './src/auth/login';
import { enderecoRoute } from './src/routes/endereco';
import { vagaRoute } from './src/routes/vaga';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.json())
app.use(express.json())

app.post('/login/:tipo', login)
app.use(userRoute)
app.use(empresaRoute)
app.use(ongRoute)
app.use(enderecoRoute)
app.use(vagaRoute)

app.listen(process.env.PORT || 3000)