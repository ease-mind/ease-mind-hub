export const maskDocument = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    
    // Formata como CPF: xxx.xxx.xxx-xx
    return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .substring(0, 14);
};
