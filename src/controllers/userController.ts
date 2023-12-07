import { Request, Response } from 'express'
import { Op } from 'sequelize'
import { User } from '../models/userModel'
import { criptografarSenha } from '../auth/bcrypt'
import { Empresa } from '../models/empresaModel'
import { Endereco } from '../models/enderecoModel'
import { Vaga } from '../models/vagasModel'
import { transport } from '../config/nodemailer'

export const listarUsuariosEmpresa = async (req: Request, res: Response) => {
    const empresa_id = req.user

    try {
        const usuarios = await User.findAll({
            where: {
                empresa_id
            },
            attributes: {
                exclude: ['senha']
            }
        })

        return res.status(200).json(usuarios)
    }
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const getUserByName = async (req: Request, res: Response) => {
    try {
        const nome = req.params.nome
        const users = await User.findAll({
            where: {
                nome: {
                    [Op.iLike]: `%${nome}%`
                }
            },
            order: ['nome'],
            include: [{
                model: Empresa,
                attributes: ['nome']
            }],
            attributes: {
                exclude: ['senha', 'data_nasc']
            }
        })
        res.status(200).json(users)

    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const getUserByEmail = async (req: Request, res: Response) => {
    try {
        const { email } = req.params

        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'nome', 'email']
        })

        if (!user) {
            return res.status(404).json("Usuário não encontrado!")
        }

        return res.status(200).json(user)
    }
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params

        const user = await User.findByPk(id, {
            include: [{
                model: Empresa,
                attributes: ['nome']
            }, {model: Vaga}],
            attributes: { exclude: ['senha']}
        })

        if (!user) {
            return res.status(404).json("Usuário não encontrado!")
        }

        return res.status(200).json(user)
    }
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const cadastrarUsuario = async (req: Request, res: Response) => {
    const { nome, sobrenome, email, senha, telefone, data_nasc, empresa_id } = req.body

    if (!nome || !sobrenome || !email || !senha || !empresa_id) {
        return res.status(400).json("Digite todos os dados!")
    }

    try {
        const user = await User.create({
            nome,
            sobrenome,
            email,
            senha: await criptografarSenha(senha),
            telefone,
            data_nasc,
            empresa_id
        })

        transport.sendMail({
            from: 'equiperocket.dev@gmail.com',
            to: email,
            subject: 'Cadastro Voluntariado',
            html: 
            `
            <img src="https://i.imgur.com/4cBoQqe.png" alt="CBVE" width="50%">
            <h1 style="width: 100%; color: #1A2E44;">Olá, ${nome}</h1>
            <p style="color: #1A2E44;">Obrigado por se juntar a nós! Seu perfil já está prontinho para que possa encontrar vagas de voluntariado e se engajar em nossa sociedade.</p>
            <p style="color: #1A2E44;">Aaah! E qualquer dúvida, não hesite em nos contatar, estaremos à disposição para qualquer dúvida.</p>
            `
        })

        return res.status(201).send()
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }

}

export const atualizarUsuario = async (req: Request, res: Response) => {
    const id = req.user
    const { nome, email, telefone, empresa_id, data_nasc } = req.body

    const user = { nome, email, telefone, empresa_id, data_nasc }
    
    try {
        await User.update(user, {
            where: { id }
        })
        return res.status(201).send()
    } 
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const deletarUsuario = async (req: Request, res: Response) => {
    try {
        const id = req.user
        const user = await User.findOne({ where: { id } })
    
        if(user){
            await user.destroy()
            return res.status(200).send()
        }
    } 
    catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const perfil = async (req: Request, res: Response) => {
    try {
        const id = req.user
        const user = await User.findOne({
            where: { id },
            attributes: {
                exclude: ['senha', 'empresa_id']
            },
            include: [
                { model: Empresa, attributes: ['nome'] },
                { model: Endereco, attributes: {exclude: ['usuario_id', 'empresa_id', 'ong_id']} },
                { model: Vaga, attributes: ['titulo'] }
            ]
        })
    
        return res.status(200).json(user)
        
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}

export const adicionarAvatar = async (req: Request, res: Response) => {
    const id = req.user

    try {
        if(req.file){
            const avatar = req.file.filename
            const arquivo = { avatar }

            await User.update(arquivo, {
                where: { id }
            })
        }

        return res.status(201).send()
    } catch (error) {
        res.status(400).json("Mensagem: " + error)
    }
}