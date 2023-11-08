import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//Config variaveis de ambiente
dotenv.config();

export const sequelize = new Sequelize(process.env.DATABASE_URL as string)
