import StandardTable from "../../components/StandardTable";
import type { Column } from "../../components/StandardTable";
import 'bootstrap/dist/css/bootstrap.min.css';

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  expirationDate: string;
  supplierName: string;
  purchaseId: string;
  photoUrl: string;
}

const inventoryData: InventoryItem[] = [
  {
    id: 1,
    name: "Vitamina C",
    quantity: 100,
    expirationDate: "2025-12-31",
    supplierName: "Proveedor Salud", 
    purchaseId: "COMP-001",
    photoUrl: "https://picsum.photos/60/60",
  },
];


const InventoryPage = () => {
  const columns: Column<InventoryItem>[] = [
    { header: "#", accessor: "id" },
    { header: "Producto", accessor: "name" },
    { header: "Cantidad", accessor: "quantity" },
    { header: "Fecha de Vencimiento", accessor: "expirationDate" },
    { header: "Proveedor", accessor: "supplierName" },
    { header: "Id de la compra", accessor: "purchaseId" },
    {
       header: "Fotografía",
  accessor: "photoUrl",
  render: (item: InventoryItem) => (
    <img
      src={item.photoUrl}
      alt={item.name}
      className="img-thumbnail"
      width="60"
      height="60"
      style={{ objectFit: "cover" }}
    />
  ),
},
  ];

  const handleEdit = (item: InventoryItem) => {
    console.log("Editar", item);
  };

  const handleDelete = (id: number) => {
    console.log("Eliminar ID", id);
  };

  return (
    <div className="container mt-4">
      <h1>Inventario</h1>
      <StandardTable<InventoryItem>
        data={inventoryData}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default InventoryPage;
