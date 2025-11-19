const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/api/products'
    : 'https://angelorigamis.com.br/api/products';

export async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Erro ao buscar produtos');
  return response.json();
}