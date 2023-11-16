import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";

export interface VagaUsuarioInstance extends Model {
    id: number;
    vaga_id: number;
    usuario_id: number
}

export const VagaUsuario = sequelize.define<VagaUsuarioInstance>("vaga_usuario", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    vaga_id: {
        type: DataTypes.INTEGER,
        references: { model: 'vagas', key: 'id' },
        onDelete: 'CASCADE'
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        references: { model: 'usuarios', key: 'id' },
        onDelete: 'CASCADE'
    }
},
{
    tableName: "vaga_usuario",
    freezeTableName: false, 
    timestamps: false
});
