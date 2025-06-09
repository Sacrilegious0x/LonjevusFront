import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import axios from "axios";
import Swal from "sweetalert2";

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PurchaseItem {
  productId: number;
  quantity: number;
  expirationDate: string;
}

interface Admin {
  id: number;
  name: string;
}

interface PurchasePayload {
  date: string;
  amount: number;
  admin: { id: number; name: string };
  items: {
    idProduct: number;
    name: string;
    quantity: number;
    expirationDate: string;
  }[];
}

const isValidDate = (dateString: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(dateString);
  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
};

const AddPurchase = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [items, setItems] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products/list");
        setProducts(response.data.products);
        if (response.data.products.length > 0) {
          setItems([
            {
              productId: response.data.products[0].id,
              quantity: 1,
              expirationDate: "",
            },
          ]);
        }
      } catch (error) {
        Swal.fire("Error", "No se pudieron cargar los productos.", "error");
      }
    };

    const fetchAdmin = async () => {
      try {
        const response = await axios.get<Admin>(
          "http://localhost:8080/admin/getAdmin/1"
        );
        setAdmin(response.data);
      } catch (err) {
        Swal.fire("Error", "No se pudo cargar el administrador.", "error");
      }
    };

    fetchProducts();
    fetchAdmin();
  }, []);

  const handleAddProduct = () => {
    if (products.length === 0) return;
    setItems([
      ...items,
      { productId: products[0].id, quantity: 1, expirationDate: "" },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof PurchaseItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === "expirationDate" ? String(value) : Number(value),
            }
          : item
      )
    );
  };

  const handleRemoveProduct = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getTotal = (): number => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!admin) {
      Swal.fire("Error", "No se pudo obtener el administrador.", "error");
      return;
    }

    if (items.some((item) => !isValidDate(item.expirationDate))) {
      Swal.fire("Advertencia", "Hay una o más fechas inválidas.", "warning");
      return;
    }

    const payload: PurchasePayload = {
      date,
      amount: getTotal(),
      admin: { id: admin.id, name: admin.name },
      items: items.map((item) => ({
        idProduct: item.productId,
        name: "",
        quantity: item.quantity,
        expirationDate: item.expirationDate,
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/purchases/add", payload);
      await Swal.fire("Éxito", "Compra registrada correctamente", "success");
      navigate("/compras");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      Swal.fire("Error", "Ocurrió un error al registrar la compra.", "error");
    }
  };

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Agregar Nueva Compra</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Encargado</label>
            <input
              type="text"
              className="form-control"
              value={admin?.name ?? ""}
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
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const product = products.find((p) => p.id === item.productId);
                const price = product?.price ?? 0;
                const fechaInvalida =
                  item.expirationDate && !isValidDate(item.expirationDate);

                return (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "productId",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
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
                        onChange={(e) =>
                          handleChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        className={`form-control ${
                          fechaInvalida ? "is-invalid" : ""
                        }`}
                        value={item.expirationDate}
                        onChange={(e) =>
                          handleChange(index, "expirationDate", e.target.value)
                        }
                        required
                      />
                      {fechaInvalida && (
                        <div className="invalid-feedback">
                          Por favor ingrese una fecha válida (AAAA-MM-DD).
                        </div>
                      )}
                    </td>
                    <td>${(price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveProduct(index)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={handleAddProduct}
            >
              + Agregar Producto
            </button>
          </div>

          <div className="text-end mb-3">
            <strong>Total: ${getTotal().toFixed(2)}</strong>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/compras")}
            >
              ← Volver
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Compra
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddPurchase;
