import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";

export interface OngInstance extends Model {
    id: number;
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    cadastro: Date | string;
    sobre: string
}

export const Ong = sequelize.define<OngInstance>("Ong", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    cnpj: {
        type: DataTypes.STRING
    },
    nome: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    senha: {
        type: DataTypes.STRING
    },
    cadastro: {
        type: DataTypes.DATE
    },
    sobre: {
        type: DataTypes.STRING
    }
},
{
    tableName: "ongs",
    freezeTableName: false, 
    timestamps: false
});