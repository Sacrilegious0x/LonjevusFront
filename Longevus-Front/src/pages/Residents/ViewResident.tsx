import { useEffect, useState } from "react";
import type { ResidentData } from "../../services/ResidentService";
import ViewContactModal from "../../components/ViewContactModal";
import AddContactModal from "../../components/AddContactModal";
import type { Contact } from "../../components/ViewContactModal";
import { useParams } from "react-router-dom";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import { Link } from 'react-router-dom';
import { getResidentById } from "../../services/ResidentService";
import { getContactsByResidentId, addContact, updateContact, deleteContact } from "../../services/ContactService";


const ViewResident: React.FC = () => {

    const { id } = useParams();
    const [residentData, setResidentData] = useState<ResidentData | null>(null);
    const [contactsData, setContactsData] = useState<Contact[]>([]);

    useEffect(() => {
        if (id) {
            getResidentById(Number(id))
                .then(res => setResidentData(res))
                .catch(err => console.error("Error al obtener el residente", err));
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            getContactsByResidentId(Number(id))
                .then(res => setContactsData(res))
                .catch(err => console.error("Error al obtener contactos", err));
        }
    }, [id]);


    const [showContactModal, setShowContactModal] = useState(false);
    const [showAddContactModal, setShowAddContactModal] = useState(false);

    const handleAddContact = (contact: Contact) => {
        addContact(contact)
            .then(() => {
                console.log("Contacto agregado");
                setContactsData(prev => [...prev, contact]);
            })
            .catch((error) => {
                console.error("Error al guardar el contacto", error);
            });
    }

    const handleEditContact = (updatedContact: Contact) => {
        updateContact(updatedContact)
            .then(() => {
                console.log("Contacto actualizado");
                setContactsData(prev =>
                    prev.map(contact =>
                        contact.id === updatedContact.id ? updatedContact : contact
                    )
                );
            })
            .catch((error) => {
                console.error("Error al actualizar contacto", error);
            });
    };

    const handleDeleteContact = (contactId: number) => {
        if (window.confirm(`¿Estás seguro de eliminar el contacto?`)) {
            deleteContact(contactId).then(() => {
                    console.log("Contacto eliminado");
                    setContactsData(prev =>
                        prev.filter(contact => contact.id !== contactId)
                    );
                }).catch((error) => {
                    console.error("Error al eliminar contacto", error);
                });
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-5 mb-5">
                <h2 className="mb-4">Información del Residente</h2>
                <div className="card shadow p-4">

                    {residentData?.photo && (
                        <div className=" mb-3">
                            <img
                                src={`http://localhost:8080/${residentData.photo}`}
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
                        <button className="btn btn-primary mt-3" onClick={() => setShowAddContactModal(true)}>
                            Agregar contactos
                        </button>
                        <button className="btn btn-info mt-3 ms-2" onClick={() => setShowContactModal(true)}>
                            Ver contactos
                        </button>
                        <Link className='btn btn-secondary float-end' to="/residente/mostrar"><i className="bi bi-reply" /> Volver</Link>
                    </center>

                </div>

                <ViewContactModal
                    show={showContactModal}
                    onClose={() => setShowContactModal(false)}
                    residentName={residentData?.name}
                    contactsList={contactsData}
                    onDeleteContact={handleDeleteContact}
                    onEditContact={handleEditContact}
                />

                <AddContactModal
                    show={showAddContactModal}
                    onClose={() => setShowAddContactModal(false)}
                    residentName={residentData?.name}
                    residentId={residentData?.id}
                    onAddContact={handleAddContact}
                />
            </div>
            <Footer />
        </>
    );
};

export default ViewResident;