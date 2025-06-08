export type InventoryItem = {
  id: number;
  quantity: number;
  category: string;
  photoURL: string;
  product: {
    name: string;
    expirationDate: string | null;
    supplier: {
      name: string;
    };
  };
  purchase: {
    id: string;
  };
};

const BASE_URL = "http://localhost:8080/api/inventory";

export const getAllInventory = async (): Promise<InventoryItem[]> => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) {
    throw new Error("Error al obtener inventario");
  }
  const data = await res.json();
  return data.inventory || [];
};

export const deleteInventory = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/delete?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error al eliminar inventario");
  }
};
