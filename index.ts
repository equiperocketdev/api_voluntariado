import express from 'express';
import dotenv from 'dotenv';
import { userRoute } from './src/routes/user';
import { empresaRoute } from './src/routes/empresa';
import passport from 'passport';
import path from 'path';
import { ongRoute } from './src/routes/ong';

dotenv.config();

const app = express();

app.use(passport.initialize());

app.use(express.json())
app.use(userRoute)
app.use(empresaRoute)
app.use(ongRoute)

app.listen(process.env.PORT || 3000)