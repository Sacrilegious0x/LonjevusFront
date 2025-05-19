import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAllProducts } from '../../services/productService';
import { createPurchase } from '../../services/purchaseService';
import axios from "axios";


interface Product {
  id: number;
  name: string;
  price: number;
}

const AddPurchase = () => {
  
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
 const [date, setDate] = useState(() => {
  const today = new Date();
  return today.toISOString().split("T")[0]; 
});
  const [managerName, setManagerName] = useState('');
  const [items, setItems] = useState<{ productId: number; quantity: number }[]>([]);
  
  const getAdminName = async (): Promise<string> => {
  const response = await axios.get("http://localhost:8080/api/admin/name");
  return response.data;
};


  useEffect(() => {
    
    getAllProducts()
      .then(data => {
        setProducts(data);

        if (data.length > 0) {
          setItems([{ productId: data[0].id, quantity: 1 }]);
        }
      })
      .catch(error => {
        console.error("Error cargando productos:", error);
      });
  }, []);
  
  useEffect(() => {
  getAdminName()
    .then(name => setManagerName(name))
    .catch(err => console.error("Error obteniendo administrador:", err));
}, []);

  const handleAddProduct = () => {
    if (products.length === 0) return;
    setItems([...items, { productId: products[0].id, quantity: 1 }]);
  };

  const handleProductChange = (index: number, newProductId: number) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, productId: newProductId } : item
    ));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setItems(items.map((item, i) =>
      i === index ? { ...item, quantity } : item
    ));
  };

  const getTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const purchasePayload = {
    date: new Date().toISOString().split("T")[0],
    amount: getTotal(),
    admin: { id: 1 },
    items: items.map(item => ({
      idProduct: item.productId,
      quantity: item.quantity
    }))
  };

  try {
    await createPurchase(purchasePayload);
    alert("Compra registrada correctamente");
    navigate("/compras");
  } catch (error) {
    console.error("Error al guardar la compra:", error);
    alert("Ocurrió un error al registrar la compra.");
  }
};


  return (
    <div className="container mt-4">
      <h2>Agregar Nueva Compra</h2>

      <button className="btn btn-secondary mb-3" onClick={() => navigate('/compras')}>
        ← Volver
      </button>

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
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              const price = product?.price || 0;
              return (
                <tr key={index}>
                  <td>
                    <select
                      className="form-select"
                      value={item.productId}
                      onChange={e => handleProductChange(index, parseInt(e.target.value))}
                    >
                      {products
  .filter(p => !items.some(item => item.productId === p.id) || item.productId === p.id)
  .map(p => (
    <option key={p.id} value={p.id}>{p.name}</option>
))}

                    </select>
                  </td>
                  <td>${price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      value={item.quantity}
                      onChange={e => handleQuantityChange(index, parseInt(e.target.value))}
                    />
                  </td>
                  <td>${(price * item.quantity).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mb-3">
          <button type="button" className="btn btn-outline-success" onClick={handleAddProduct}>
            + Agregar Producto
          </button>
        </div>

        <div className="text-end mb-3">
          <strong>Total: ${getTotal().toFixed(2)}</strong>
        </div>

        <button type="submit" className="btn btn-primary">Guardar Compra</button>
      </form>
    </div>
  );
};

export default AddPurchase;
