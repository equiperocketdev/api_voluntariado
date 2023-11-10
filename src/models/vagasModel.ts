import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { User } from "./userModel";
import { Ong } from "./ongModel";
import { VagaUsuario } from "./vagaUsuarioModel";
import { Empresa } from "./empresaModel";

export interface VagaInstance extends Model {
    id: number;
    titulo: string;
    sobre: string;
    data: Date;
    cadastro: Date;
    qtd_vagas: number;
    qtd_volun: number;
    capa: string;
    disponivel: boolean;
    empresa_id: number;
    causa_id: number;
    ong_id: number;
}

export const Vaga = sequelize.define<VagaInstance>("Vagas", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    titulo: {
        type: DataTypes.STRING
    },
    sobre: {
        type: DataTypes.STRING
    },
    data: {
        type: DataTypes.DATE(6)
    },
    cadastro: {
        type: DataTypes.DATE
    },
    capa: {
        type: DataTypes.STRING
    },
    qtd_vagas: {
        type: DataTypes.INTEGER
    },
    disponivel: {
        type: DataTypes.BOOLEAN
    },
    empresa_id: {
        type: DataTypes.INTEGER
    },
    causa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'causas', key: 'id' },
        onDelete: 'CASCADE'
    },
    ong_id: {
        type: DataTypes.INTEGER,
        references: { model: 'ongs', key: 'id' },
        onDelete: 'CASCADE'
    },
    qtd_volun: {
        type: DataTypes.INTEGER
    }
},
{
    tableName: "vagas",
    freezeTableName: false, 
    timestamps: false
});
Vaga.belongsTo(Ong, {
    foreignKey: 'ong_id',
    constraints: true,
    onDelete: 'CASCADE'
})
Ong.hasMany(Vaga, {
    foreignKey: 'ong_id'
})

User.belongsToMany(Vaga, {
    through: {
        model: VagaUsuario
    },
    foreignKey: 'usuario_id',
    constraints: true
})
Vaga.belongsToMany(User, {
    through: {
        model: VagaUsuario
    },
    foreignKey: 'vaga_id',
    constraints: true
})

Vaga.belongsTo(Empresa, {
    constraints: true,
    foreignKey: 'empresa_id',
    onDelete: 'CASCADE'
})
Empresa.hasMany(Vaga, {
    foreignKey: 'empresa_id',
})