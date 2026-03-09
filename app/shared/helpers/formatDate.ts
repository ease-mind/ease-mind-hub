
export const formatDateISO = (d: Date | null) => (d ? d.toISOString() : "");
export const formatDate = (d: Date | string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR") : "";
