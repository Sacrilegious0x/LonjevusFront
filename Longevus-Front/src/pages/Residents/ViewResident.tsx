import { useEffect, useState } from "react";
import type { ResidentData } from "../../components/ResidentForm";
import ViewContactModal from "../../components/ViewContactModal";
import AddContactModal from "../../components/AddContactModal";
import type { Contact } from "../../components/ViewContactModal";
import { useParams } from "react-router-dom";
import axios from "axios";


const ViewResident: React.FC = () => {

    const {id} = useParams();
    const [residentData, setResidentData] = useState<ResidentData | null>(null);
    const [contactsData, setContactsData] = useState<Contact | null>(null);

    useEffect(() => {
        if(id){
            axios.get<ResidentData>(`http://localhost:8080/findResident?id=${id}`)
            .then(response => setResidentData(response.data))
            .catch(error => console.error("Error al obtener residente", error))
        }
        //setResidentData(data);
    }, [id]);

    useEffect(() => {
        if(id){
            axios.get<Contact>(`http://localhost:8080/getContacts?id=${id}`)
            .then(response => setContactsData(response.data))
            .catch(error => console.error("Error al obtener contactos", error))
        }
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
                            src={residentData.photo}
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
                contactsList={contactsData}
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