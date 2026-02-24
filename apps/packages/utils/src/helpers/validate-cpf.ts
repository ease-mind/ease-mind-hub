export function validateCPF(value: string) {
    // Remove tudo que não for número
    if (!value) return true;
    const cpf = value.replace(/[^\d]+/g, '');
    if (cpf.length !== 11) return "CPF deve ter 11 dígitos";
    // Validação básica de CPF (pode ser melhorada)
    let sum = 0;
    let rest;
    if (/^(\d)\1+$/.test(cpf)) return "CPF inválido";
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(9, 10))) return "CPF inválido";
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if ((rest === 10) || (rest === 11)) rest = 0;
    if (rest !== parseInt(cpf.substring(10, 11))) return "CPF inválido";
    return true;
}

export function formatCPF(value: string) {
    const cpf = value.replace(/\D/g, '').slice(0, 11);
    return cpf
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}