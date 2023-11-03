import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { User } from "./userModel";
import { Empresa } from "./empresaModel";
import { Ong } from "./ongModel";

export interface EnderecoInstance extends Model {
    id: number;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    usuario_id: number;
    empresa_id: number;
    ong_id: number
}

export const Endereco = sequelize.define<EnderecoInstance>("Endereco", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    cep: {
        type: DataTypes.STRING
    },
    rua: {
        type: DataTypes.STRING
    },
    bairro: {
        type: DataTypes.STRING
    },
    cidade: {
        type: DataTypes.STRING
    },
    estado: {
        type: DataTypes.STRING
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: { model: 'usuario', key: 'id'  },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'empresa', key: 'id'  },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    ong_id: {
        type: DataTypes.INTEGER,
        references: { model: 'ong', key: 'id'  },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
},
{
    tableName: "enderecos",
    freezeTableName: false, 
    timestamps: false
});
Endereco.belongsTo(User, {
    constraints: true,
    foreignKey: 'usuario_id',
    onDelete: 'CASCADE'
})
User.hasOne(Endereco, {
    constraints: false,
    foreignKey: 'usuario_id',
})

Endereco.belongsTo(Empresa, {
    constraints: true,
    foreignKey: 'empresa_id',
    onDelete: 'CASCADE'
})
Empresa.hasOne(Endereco, {
    constraints: false,
    foreignKey: 'empresa_id',
})

Endereco.belongsTo(Ong, {
    constraints: true,
    foreignKey: 'ong_id',
    onDelete: 'CASCADE'
})
Ong.hasOne(Endereco, {
    constraints: false,
    foreignKey: 'ong_id',
})