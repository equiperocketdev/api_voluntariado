import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Vaga } from "./vagasModel";

export interface EmpresaInstance extends Model {
    id: number;
    cnpj: string;
    nome: string;
    email: string;
    senha: string;
    cadastro: Date | string;
    sobre: string
    logo: string;
}

export const Empresa = sequelize.define<EmpresaInstance>("Empresa", {
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
    },
    logo: {
        type: DataTypes.STRING
    }
},
{
    tableName: "empresas",
    freezeTableName: false, 
    timestamps: false
});

