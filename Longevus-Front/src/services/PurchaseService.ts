import axios from "axios";

export interface PurchaseItem {
  idProduct: number;
  name : string;
  quantity: number;
  expirationDate: string;
  productName?: string;
}

export interface Purchase {
  id: string;
  date: string;
  amount: number;
  admin: {
    id: number;
    name: string;
  };
  items: PurchaseItem[];
}


// Obtener todas las compras
export const getAllPurchases = async (): Promise<Purchase[]> => {
  const response = await axios.get("http://localhost:8080/api/purchases/all");
  return response.data;
};

// Obtener una compra por ID
export const getPurchaseById = async (id: string): Promise<Purchase> => {
  const response = await axios.get(`http://localhost:8080/api/purchases/${id}`);
  return response.data;
};

// Crear una nueva compra
export const createPurchase = async (purchase: Purchase): Promise<void> => {
  await axios.post("http://localhost:8080/api/purchases/add", purchase);
};

// Actualizar una compra existente
export const updatePurchase = async (id: string, purchase: Purchase): Promise<void> => {
  await axios.put(`http://localhost:8080/api/purchases/update/${id}`, purchase);
};

// Eliminar una compra (lógico)
export const deletePurchase = async (id: string): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/purchases/delete/${id}`);
};