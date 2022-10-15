// needed for swagger generator
export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
}

export type products = Product[];