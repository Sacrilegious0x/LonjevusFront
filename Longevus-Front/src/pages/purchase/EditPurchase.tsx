import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PurchaseItem {
  idProduct: number;
  quantity: number;
  expirationDate?: string;
  productName?: string;
  price?: number;
}

interface Purchase {
  id: string;
  date: string;
  admin: {
    id: number;
    name: string;
  };
  items: PurchaseItem[];
}

const EditPurchase = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [managerName, setManagerName] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number; expirationDate: string }[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [initialData, setInitialData] = useState('');

  const getAllProducts = async (): Promise<Product[]> => {
    const response = await fetch("http://localhost:8080/api/products/all");
    return await response.json();
  };

  const getPurchaseById = async (id: string): Promise<Purchase> => {
    const response = await fetch(`http://localhost:8080/api/purchases/${id}`);
    if (!response.ok) throw new Error("No se pudo obtener la compra");
    const text = await response.text();
    if (!text) throw new Error("Respuesta vacía del servidor");
    return JSON.parse(text);
  };

  const updatePurchase = async (id: string, data: any): Promise<boolean> => {
    const response = await fetch(`http://localhost:8080/api/purchases/update/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return response.ok;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getAllProducts();
        setAllProducts(products);

        if (id) {
          const data: Purchase = await getPurchaseById(id);
          setDate(data.date);
          setManagerName(data.admin?.name ?? "No asignado");

          const compraItems = data.items.map((item: PurchaseItem) => ({
            productId: item.idProduct,
            quantity: item.quantity,
            expirationDate: item.expirationDate ?? ""
          }));

          const productosFaltantes = data.items
            .filter((item: PurchaseItem) => !products.some((p: Product) => p.id === item.idProduct))
            .map((item: PurchaseItem) => ({
              id: item.idProduct,
              name: `Producto eliminado (#${item.idProduct})`,
              price: 0,
            }));

          setAllProducts(prev => [...prev, ...productosFaltantes]);
          setItems(compraItems);
          setInitialData(JSON.stringify({ date: data.date, items: compraItems }));
        }
      } catch (error) {
        console.error("Error cargando productos o compra:", error);
        alert("Error cargando productos o compra");
      }
    };

    fetchData();
  }, [id]);

  const handleProductChange = (index: number, newProductId: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, productId: newProductId } : item
      )
    );
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity } : item
      )
    );
  };

  const handleExpirationChange = (index: number, newDate: string) => {
    setItems(prev =>
      prev.map((item, i) =>
        i === index ? { ...item, expirationDate: newDate } : item
      )
    );
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = allProducts.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Debe seleccionar al menos un producto.");
      return;
    }

    if (items.some(item => !item.expirationDate)) {
      alert("Todos los productos deben tener una fecha de vencimiento.");
      return;
    }

    const payload = {
      id: id ?? '',
      date,
      amount: getTotal(),
      admin: { id: 1 },
      items: items.map(item => ({
        idProduct: item.productId,
        quantity: item.quantity,
        expirationDate: item.expirationDate
      }))
    };

    try {
      const success = await updatePurchase(payload.id, payload);
      if (success) {
        alert("Compra actualizada correctamente");
        navigate('/compras');
      } else {
        alert("Error al actualizar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al actualizar");
    }
  };

  const handleBack = () => {
    const currentData = JSON.stringify({ date, items });
    if (currentData !== initialData) {
      const confirmExit = window.confirm("Tienes cambios sin guardar. ¿Deseas salir sin guardar?");
      if (!confirmExit) return;
    }
    navigate('/compras');
  };

  return (
    <div className="container mt-4">
      <h2>Editar Compra #{id}</h2>

      <div className="mb-3">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          ← Volver a Compras
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Encargado</label>
          <input
            type="text"
            className="form-control"
            value={managerName}
            readOnly
          />
        </div>

        <h5>Productos</h5>
        <table className="table table-bordered">
          <thead className="table-secondary">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Fecha de Vencimiento</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const selectedProduct = allProducts.find(p => p.id === item.productId);
              const price = selectedProduct?.price || 0;

              return (
                <tr key={index}>
                  <td>
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={e => handleProductChange(index, parseInt(e.target.value))}
                    >
                      {allProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>${price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={item.quantity}
                      min={1}
                      onChange={e => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      className="form-control"
                      value={item.expirationDate}
                      required
                      onChange={e => handleExpirationChange(index, e.target.value)}
                    />
                  </td>
                  <td>${(item.quantity * price).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-end mb-3">
          <strong>Total:</strong> ${getTotal().toFixed(2)}
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditPurchase;