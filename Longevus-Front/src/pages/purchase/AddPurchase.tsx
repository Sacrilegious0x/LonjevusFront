import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import DatePicker from "react-datepicker";
import axios from "axios";
import { errorAlert, succesAlert, confirmExitAlert } from "../../js/alerts";
import {
  type Product,
  type Admin,
  type PurchasePayload,
} from "../../services/PurchaseService";

interface LocalPurchaseItem {
  productId: number;
  quantity: number;
  expirationDate: string;
}

const isValidDate = (dateString: string): boolean => {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return false;
  const [day, month, year] = dateString.split("-").map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const convertToISODate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

const parseLocalDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day); // mes va de 0 a 11
};

const AddPurchase = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [date, setDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate()); // sin desfase horario
  });

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [items, setItems] = useState<LocalPurchaseItem[]>([]);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products/list");
        setProducts(response.data.products);
      } catch {
        errorAlert("No se pudieron cargar los productos.");
      }
    };

    const fetchAdmin = async () => {
      try {
        const response = await axios.get<Admin>(
          "http://localhost:8080/admin/getAdmin/1"
        );
        setAdmin(response.data);
      } catch {
        errorAlert("No se pudo obtener el administrador.");
      }
    };

    fetchProducts();
    fetchAdmin();
  }, []);

  const handleAddProduct = () => {
    if (products.length === 0) {
      errorAlert("No hay productos disponibles.");
      return;
    }
    setIsModified(true);
    setItems([
      ...items,
      { productId: products[0].id, quantity: 1, expirationDate: "" },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof LocalPurchaseItem,
    value: string | number
  ) => {
    setIsModified(true);
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "expirationDate" ? String(value) : Number(value),
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
      errorAlert("No se pudo obtener el administrador.");
      return;
    }

    if (products.length === 0) {
      errorAlert("No se puede guardar la compra porque no hay productos disponibles.");
      return;
    }

    if (items.some((item) => !isValidDate(item.expirationDate))) {
      errorAlert("Hay una o más fechas inválidas");
      return;
    }

    if (items.some((item) => !item.expirationDate)) {
      errorAlert(
        "Debes seleccionar la fecha de vencimiento de todos los productos."
      );
      return;
    }

    if (items.length === 0) {
      errorAlert("Debes agregar al menos un producto a la compra.");
      return;
    }

    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const payload: PurchasePayload = {
      date: formattedDate,
      amount: getTotal(),
      admin: { id: admin.id, name: admin.name },
      items: items.map((item) => ({
        idProduct: item.productId,
        name: "",
        quantity: item.quantity,
        expirationDate: convertToISODate(item.expirationDate),
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/purchases/add", payload);
      succesAlert("Éxito", "Compra registrada correctamente");
      navigate("/compras");
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      errorAlert("Ocurrió un error al registrar la compra.");
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
            <DatePicker
              selected={date}
              onChange={(date: Date | null) => {
                if (date) setDate(date);
              }}
              dateFormat="dd-MM-yyyy"
              className="form-control"
              placeholderText="Selecciona una fecha"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              onKeyDown={(e) => e.preventDefault()}
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
                      <DatePicker
                        selected={
                          item.expirationDate
                            ? parseLocalDate(item.expirationDate)
                            : null
                        }
                        onChange={(date: Date | null) => {
                          const formatted = date
                            ? `${String(date.getDate()).padStart(
                                2,
                                "0"
                              )}-${String(date.getMonth() + 1).padStart(
                                2,
                                "0"
                              )}-${date.getFullYear()}`
                            : "";
                          handleChange(index, "expirationDate", formatted);
                        }}
                        dateFormat="dd-MM-yyyy"
                        className={`form-control ${
                          !isValidDate(item.expirationDate) ? "is-invalid" : ""
                        }`}
                        placeholderText="Selecciona una fecha"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        onKeyDown={(e) => e.preventDefault()}
                      />
                      {!isValidDate(item.expirationDate) && (
                        <div className="invalid-feedback">
                          Por favor ingrese una fecha válida (DD-MM-AAAA).
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

          <div className="d-flex gap-2 mt-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={async () => {
                if (!isModified) {
                  navigate("/compras");
                } else {
                  const result = await confirmExitAlert(
                    "Perderás los cambios no guardados."
                  );
                  if (result.isConfirmed) {
                    navigate("/compras");
                  }
                }
              }}
            >
              <i className="bi bi-reply me-1"></i>
              Volver
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
