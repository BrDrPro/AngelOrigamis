interface User {
    id: number;
    username: string;
    password: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

interface Order {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
    totalPrice: number;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

interface ClientAttributes {
  id: number;
  email: string;
}

interface AdminAttributes {
  id: number;
  email: string;
  password: string;
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}