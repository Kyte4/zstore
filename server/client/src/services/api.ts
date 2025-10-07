interface ApiConfig {
  baseURL: string;
}

const config: ApiConfig = {
  baseURL: process.env.REACT_APP_API_URL || '/api'
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${config.baseURL}/products`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchProduct = async (id: number): Promise<Product> => {
  const response = await fetch(`${config.baseURL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};