import bcrypt from "bcrypt";

export const criptografarSenha = async (senha: string) => {
    return await bcrypt.hash(senha, 10)
}

export const verificarSenha = async (senha: string, senhaCriptografada: string) => {
    return await bcrypt.compare(senha, senhaCriptografada)
    
}