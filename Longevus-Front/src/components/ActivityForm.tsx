import { useEffect, useState } from "react";
import type { Activity } from "../services/ActivityService";
import { getAllCaregivers, type CaregiverApiResponse } from "../services/CaregiverService";

interface ActivityProps {
    onSubmit: (data: Activity) => void;
    initialData?: Activity;
}

const ActivityForm: React.FC<ActivityProps> = ({ onSubmit, initialData }) => {
    const [data, setData] = useState<Activity>(
        initialData !== null && initialData !== undefined ? initialData : {
            id: 0,
            name: '',
            description: '',
            type: '',
            date: '',
            startTime: '',
            endTime: '',
            location: '',
            status: '',
            caregiverId: 0
        });

    const isEditing = !!initialData;

    useEffect(() => {
        if (initialData) {
            console.log("Cargando initialData en form:", initialData);
            setData(initialData);
        }
    }, [initialData]);

    const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const target = e.target as HTMLInputElement;
        const { name, type, value } = target;

        setData(prev => ({
            ...prev, //version anterior del form
            [name]: type === 'number' ? Number(value) : value,
        }))
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(data);
        console.log(data);
    };

    const [caregivers, setCaregivers] = useState<CaregiverApiResponse[]>([]);

    useEffect(() => {
        getAllCaregivers()
            .then(res => setCaregivers(res))
            .catch(err => console.error("Error al obtener cuidadores", err));

    }, []);


    return (
        <form onSubmit={handleSubmit} className="residentForm p-4 border rounded">

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={data.name}
                    readOnly={isEditing}
                    onChange={handleForm}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Descripción</label>
                <input
                    type="text"
                    name="description"
                    value={data.description}
                    onChange={handleForm}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Tipo</label>
                <select name="type" value={data.type}
                    onChange={handleForm} className="form-select">
                    <option value="Recreativa">Recreativa</option>
                    <option value="Física">Física</option>
                    <option value="Educativa">Educativa</option>
                    <option value="Médica">Médica</option>
                    <option value="Social">Social</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Fecha</label>
                <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={handleForm}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Hora de inicio</label>
                <input
                    type="time"
                    name="startTime"
                    value={data.startTime}
                    onChange={handleForm}
                    className="form-control"
                    min="07:00"
                    max="22:00"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Hora de fin</label>
                <input
                    type="time"
                    name="endTime"
                    value={data.endTime}
                    onChange={handleForm}
                    className="form-control"
                    min={data.startTime || "07:00"}
                    max="22:00"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Localización</label>
                <input
                    type="text"
                    name="location"
                    value={data.location}
                    onChange={handleForm}
                    className="form-control"
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Estado</label>
                <select name="status" value={data.status}
                    onChange={handleForm} className="form-select">
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Finalizada">Finalizada</option>

                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Encargado(a)</label>
                <select name="caregiverId" value={data.caregiverId} onChange={handleForm} className="form-select">
                    {caregivers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" className="btnAddCaregiver">Guardar</button>
        </form>
    );
};

export default ActivityForm;