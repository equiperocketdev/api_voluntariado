export const isOng = (id: any) => {
    if(id >= 72000 && id < 75000) return true
}

export const isEmpresa = (id: any) => {
    if(id >= 75000 && id < 78000) return true
}

export const isUsuario = (id: any) => {
    if(id >= 78000) return true
}