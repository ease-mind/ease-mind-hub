export const maskDocument = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');

    return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .substring(0, 14);
};
