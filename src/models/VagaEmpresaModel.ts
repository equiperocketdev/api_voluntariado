import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";

export interface VagaEmpresaInstance extends Model {
    id: number;
    vaga_id: number;
    empresa_id: number
}

export const VagaEmpresa = sequelize.define<VagaEmpresaInstance>("vaga_empresa", {
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
    empresa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'empresas', key: 'id' },
        onDelete: 'CASCADE'
    }
},
{
    tableName: "vaga_empresa",
    freezeTableName: false, 
    timestamps: false
});
