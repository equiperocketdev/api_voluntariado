import { Sequelize } from "sequelize";
import dotenv from "dotenv";

//Config variaveis de ambiente
dotenv.config();

//export const sequelize = new Sequelize(process.env.DATABASE_URL as string)

export const sequelize = new Sequelize(
    process.env.PG_DB as string,
    process.env.PG_USER as string,
    process.env.PG_PASSWORD as string,
    {
        dialect: 'postgres',
        port: parseInt(process.env.PG_DB_PORT as string)
    }
);