import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

interface RawProductFromAPI {
  id: number;
  name: string;
  price: number;
  expirationDate: string; 
  category: string;
  unit: { id: number; unitType: string; isActive: boolean };
  supplier: { id: number; name: string; phoneNumber: string; email: string; address: string; isActive: boolean; photo?: string };
  photoURL: string;
  isActive: boolean;
}

interface IProduct {
  id:number,
  name: string,
  price: number,
  expirationDate: string,
  category: string,
  unit: string,
  supplier: string,
  photoUrl: string,
  isActive:boolean
}

interface ProductListResponse{
    products: RawProductFromAPI[];
}

export const getProducts = async (): Promise<IProduct[]> => {
    try {

    const response = await axios.get<ProductListResponse>(`${API_BASE_URL}/products/list`);
    // “response.data.products” es RawProductFromAPI[]
    const flattened: IProduct[] = response.data.products.map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      expirationDate: p.expirationDate, 
      category: p.category,
      unit: p.unit.unitType,            
      supplier: p.supplier.name,        
      photoUrl: p.photoURL,
      isActive: p.isActive,
    }));
    console.log(flattened);

    return flattened;
        
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        throw new Error('No se pudo cargar la lista de productos');
    }
};

export const createProduct = async (data: FormData): Promise<IProduct> => {
  try {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
    };
    const response = await axios.post<IProduct>(`${API_BASE_URL}/products/save`, data, config);
    return response.data;
  } catch (error) {
    console.error('Error al agregar un producto:', error);
    throw new Error('No se pudo agregar un producto');
  }
};