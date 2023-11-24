import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Vaga } from "./vagasModel";

export interface OdsInstance extends Model {
    id: number;
    nome: string
}

export const Ods = sequelize.define<OdsInstance>("Odss", {
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
    tableName: "ods",
    freezeTableName: false, 
    timestamps: false
});

Vaga.belongsTo(Ods, {
    foreignKey: 'ods_id',
    constraints: true,
    onDelete: 'CASCADE'
})

Ods.hasMany(Vaga, {
    foreignKey: 'ods_id'
})