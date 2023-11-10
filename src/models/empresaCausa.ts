import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";

export interface EmpresaCausaInstance extends Model {
    id: number;
    causa_id: number;
    empresa_id: number;
}

export const EmpresaCausa = sequelize.define<EmpresaCausaInstance>("Empresa", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    causa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'causas', key: 'id' },
        onDelete: 'CASCADE'
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        references: { model: 'empresas', key: 'id' },
        onDelete: 'CASCADE'
    }
},
{
    tableName: "empresa_causa",
    freezeTableName: false, 
    timestamps: false
});