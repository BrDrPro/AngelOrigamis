// Deriva um nome de pasta seguro (sem acentos, espaços ou separadores de caminho)
// a partir de um nome de categoria/subcategoria digitado pelo admin.
export function normalizeFolderName(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '')
    .replace(/[\\/]/g, '')
    .trim();
}
