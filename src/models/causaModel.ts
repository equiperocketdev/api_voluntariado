import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Vaga } from "./vagasModel";

export interface CausaInstance extends Model {
    id: number;
    nome: string
}

export const Causa = sequelize.define<CausaInstance>("Causas", {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    nome: {
        type: DataTypes.STRING
    }
},
{
    tableName: "causas",
    freezeTableName: false, 
    timestamps: false
});
Vaga.belongsTo(Causa, {
    foreignKey: 'causa_id',
    constraints: true,
    onDelete: 'CASCADE'
})

Causa.hasMany(Vaga, {
    foreignKey: 'causa_id'
})