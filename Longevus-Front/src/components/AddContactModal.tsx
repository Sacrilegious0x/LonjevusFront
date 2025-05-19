import type { Contact } from "./ViewContactModal";
import { useState, useEffect } from "react";

interface AddContactProps {
    show: boolean;
    onClose: () => void;
    residentName?: string;
    residentId: number;
    onAddContact: (contact: Contact) => void; //para agregar un contacto
    editingContact: Contact;
}

const AddContactModal: React.FC<AddContactProps> = ({ show, onClose, residentName, residentId, onAddContact, editingContact }) => {
    if (!show)
        return null
    
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [relationShip, setRelationship] = useState("");

    useEffect(() =>{
        if(editingContact){
            setName(editingContact.name);
            setPhone(editingContact.phoneNumber);
            setRelationship(editingContact.relationShip);
        }else{
            setName("");
            setPhone("");
            setRelationship("");
        }
    }, [editingContact, show])

    const handleSubmit = () => {
        if (!name || !phone || !relationShip) return alert("Completa todos los campos");

        const newContact: Contact = {
            id: editingContact?.id ?? 0,
            idResident: residentId,
            name,
            phoneNumber: phone,
            relationShip,
        };

        onAddContact(newContact);
        onClose();
        setName("");
        setPhone("");
        setRelationship("");
    };

    return (
        <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">Agregar contacto para {residentName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label">Nombre del contacto</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input
                                type="tel"
                                className="form-control"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Parentesco</label>
                            <input
                                type="text"
                                className="form-control"
                                value={relationShip}
                                onChange={(e) => setRelationship(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Guardar
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddContactModal;