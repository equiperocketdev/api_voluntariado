import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { User } from "./userModel";
import { Ong } from "./ongModel";
import { VagaUsuario } from "./vagaUsuario";

export interface VagaInstance extends Model {
    id: number;
    titulo: string;
    sobre: string;
    data: Date;
    cadastro: Date;
    qtd_vagas: number;
    causa_id: number;
    ong_id: number
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
    qtd_vagas: {
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
