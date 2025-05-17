import { useEffect, useState } from "react";
import { ResidentData } from "../../components/ResidentForm";
import ViewContactModal from "../../components/ViewContactModal";
import AddContactModal from "../../components/AddContactModal";
import type { Contact } from "../../components/ViewContactModal";

const data = {
    id: 1,
    identification: "123456789",
    name: "Jose",
    age: 80,
    healthStatus: "Buena",
    numberRoom: 2,
    photo: "/residentes/adulto-mayor.png",
};

const mockContacts: Contact[] = [
    {
        id: 1,
        idResident: 1,
        name: "Ana Gómez",
        phone_number: "+50688888888",
        relationship: "Hija",
    },
    {
        id: 2,
        idResident: 1,
        name: "Carlos Pérez",
        phone_number: "+50699999999",
        relationship: "Hermano",
    },
];

const ViewResident: React.FC = () => {

    const [residentData, setResidentData] = useState<ResidentData | null>(null);

    useEffect(() => {
        setResidentData(data);
    }, []);


    const [showContactModal, setShowContactModal] = useState(false);
    const [showAddContactModal, setShowAddContactModal] = useState(false);

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Información del Residente</h2>
            <div className="card shadow p-4">
                {residentData?.photo && (
                    <div className=" mb-3">
                        <img
                            src={data.photo}
                            alt="Foto del residente"
                            width="150"
                            className="img-thumbnail"
                        />
                    </div>
                )}
                <p><strong>Identificación:</strong> {residentData?.identification}</p>
                <p><strong>Nombre:</strong> {residentData?.name}</p>
                <p><strong>Edad:</strong> {residentData?.age} años</p>
                <p><strong>Estado de salud:</strong> {residentData?.healthStatus}</p>
                <p><strong>Número de habitación:</strong> {residentData?.numberRoom}</p>

                <center>
                    <button className="btn btn-primary mt-3" onClick={() =>  setShowAddContactModal(true)}>
                        Agregar contactos
                    </button>
                    <button className="btn btn-info mt-3" onClick={() => setShowContactModal(true)}>
                        Ver contactos
                    </button>
                </center>
                
            </div>

            <ViewContactModal
                show={showContactModal}
                onClose={() => setShowContactModal(false)}
                residentName={residentData?.name}
                contactsList={mockContacts}
                onDeleteContact={(id) => alert(`Eliminar contacto con ID ${id}`)}
                onEditContact={(contact) => alert(`Editar contacto ${contact.name}`)}
            />

            <AddContactModal
                show={showAddContactModal}
                onClose={() => setShowAddContactModal(false)}
                residentName={residentData?.name}
                residentId={residentData?.id}
                onAddContact={(id) => alert(`Eliminar contacto con ID ${id}`)}
            />
        </div>
    );
};

export default ViewResident;