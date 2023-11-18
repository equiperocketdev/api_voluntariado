import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Empresa } from '../models/empresaModel'

export interface UserInstance extends Model {
    id: number;
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    telefone: string;
    tempo_volun: number;
    cadastro: Date | string;
    empresa_id: number;
    data_nasc: Date | string,
    avatar: string | null
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
    sobrenome: {
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
    tempo_volun: {
        type: DataTypes.INTEGER
    },
    cadastro: {
        type: DataTypes.DATE
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'empresas', key: 'id'  },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    data_nasc: {
        type: DataTypes.DATE
    },
    avatar: {
        type: DataTypes.STRING
    }
},
{
    tableName: "usuarios",
    freezeTableName: false, 
    timestamps: false
});
User.belongsTo(Empresa, {
    constraints: true,
    foreignKey: 'empresa_id',
    onDelete: 'CASCADE'
})

Empresa.hasMany(User, {
    foreignKey: 'empresa_id',
})