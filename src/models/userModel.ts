import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Empresa } from '../models/empresaModel'

export interface UserInstance extends Model {
    id: number;
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    cadastro: Date | string;
    empresa_id: number | null;
    data_nasc: Date | string
}
export const User = sequelize.define<UserInstance>("User", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER        
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
    telefone: {
        type: DataTypes.STRING
    },
    cadastro: {
        type: DataTypes.DATE
    },
    empresa_id: {
        type: DataTypes.INTEGER
    },
    data_nasc: {
        type: DataTypes.DATE
    }
},
{
    tableName: "usuarios",
    freezeTableName: false, 
    timestamps: false
});
User.belongsTo(Empresa, {
    constraints: true,
    foreignKey: 'empresa_id'
})

Empresa.hasMany(User, {
    foreignKey: 'empresa_id',
})