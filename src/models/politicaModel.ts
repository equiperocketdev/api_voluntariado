import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { Vaga } from "./vagasModel";

export interface PoliticaInstance extends Model {
    id: number;
    nome: string
}

export const Politica = sequelize.define<PoliticaInstance>("Politicas", {
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
    tableName: "politicas",
    freezeTableName: false, 
    timestamps: false
});
Vaga.belongsTo(Politica, {
    foreignKey: 'politica_id',
    constraints: true,
    onDelete: 'CASCADE'
})

Politica.hasMany(Vaga, {
    foreignKey: 'politica_id'
})