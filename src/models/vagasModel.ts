import { Model, DataTypes } from "sequelize";
import { sequelize } from "../db/pg";
import { User } from "./userModel";
import { Ong } from "./ongModel";
import { VagaUsuario } from "./vagaUsuarioModel";
import { Empresa } from "./empresaModel";
import { VagaEmpresa } from "./vagaEmpresaModel";

export interface VagaInstance extends Model {
    id: number;
    titulo: string;
    sobre: string;
    data: Date;
    cadastro: Date;
    qtd_vagas: number;
    qtd_volun: number;
    duracao: number;
    impacto: number;
    politica_id: number;
    capa: string;
    empresa_id: number;
    causa_id: number;
    ong_id: number;
    ods_id: number;
    cep: string;
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    disponivel: boolean;
    finalizada: boolean;
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
    duracao: {
        type: DataTypes.INTEGER
    },
    impacto: {
        type: DataTypes.INTEGER
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
    ods_id: {
        type: DataTypes.INTEGER,
        references: { model: 'ods', key: 'id' },
    },
    politica_id: {
        type: DataTypes.INTEGER,
        references: { model: 'politicas', key: 'id' },
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
    qtd_volun: {
        type: DataTypes.INTEGER
    },
    disponivel: {
        type: DataTypes.BOOLEAN
    },
    finalizada: {
        type: DataTypes.BOOLEAN
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

Empresa.belongsToMany(Vaga, {
    through: {
        model: VagaEmpresa
    },
    onDelete: 'CASCADE',
    foreignKey: 'empresa_id',
    constraints: true
})
Vaga.belongsToMany(Empresa, {
    through: {
        model: VagaEmpresa
    },
    onDelete: 'CASCADE',
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