import { useEffect, useState } from "react";
import type { Activity } from "../services/ActivityService";
import { getAllCaregivers, type CaregiverApiResponse } from "../services/CaregiverService";
import { errorAlert } from "../js/alerts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
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
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { hasAuthority } = useAuth();
    useEffect(() => {
        if (initialData) {
            console.log("Cargando initialData en form:", initialData);
            setData({
                ...initialData,
                caregiverId: initialData.caregiver?.id ?? 0
            });
        }
    }, [initialData]);

    const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

        const target = e.target as HTMLInputElement;
        const { name, type, value } = target;

        if ((name === "name" || name === "description") && value !== "" && value.trim() === "") {
            return;
        }
        setData(prev => ({
            ...prev, //version anterior del form
            [name]: type === 'number' ? Number(value) : value,
        }))
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const requiredFields = [
            "name", "description", "type", "date",
            "startTime", "endTime", "location", "status", "caregiverId"
        ];

        const emptyFields = requiredFields.filter((field) => !data[field as keyof typeof data]);

        if (emptyFields.length > 0) {
            errorAlert("Por favor complete todos los campos antes de guardar.");
            return;
        }

        if (data.status === "En progreso") {
            const today = new Date();
            const selectedDate = new Date(data.date);

            today.setHours(0, 0, 0, 0);
            selectedDate.setHours(0, 0, 0, 0);

            if (selectedDate.getTime() !== today.getTime()) {
                setErrors({ status: "Solo se puede marcar como 'En progreso' una actividad en la fecha actual." });
                return;
            }
        } else {
            setErrors((prev) => ({ ...prev, status: "" }));
        }

        onSubmit(data);
        console.log(data);
    };

    const [caregivers, setCaregivers] = useState<CaregiverApiResponse[]>([]);

    useEffect(() => {
        getAllCaregivers()
            .then(res => setCaregivers(res))
            .catch(err => console.error("Error al obtener cuidadores", err));

    }, []);

    const getNext30Min = (time: string): string => {
        const [hour, minute] = time.split(":").map(Number);
        let newHour = hour;
        let newMinute = minute + 30;

        if (newMinute >= 60) {
            newMinute = 0;
            newHour += 1;
        }

        if (newHour > 22) {
            return "22:00";
        }

        return `${newHour.toString().padStart(2, "0")}:${newMinute
            .toString()
            .padStart(2, "0")}`;
    };



    return (
        <form onSubmit={handleSubmit} className="residentForm p-4 border rounded">

            <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                    type="text"
                    name="name"
                    value={data.name}
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
                    <option value="">Seleccione un tipo</option>
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
                    step={1800}
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
                    min={data.startTime ? getNext30Min(data.startTime) : "07:30"}
                    max="22:00"
                    step={1800}
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
                <select
                    name="status"
                    value={data.status}
                    onChange={handleForm}
                    className={`form-select ${errors.status ? "is-invalid" : ""}`}
                >
                    <option value="">Seleccione el estado de la actividad</option>
                    <option value="Pendiente">Pendiente</option>
                    <option
                        value="En progreso"
                        disabled={!!data.date && new Date(data.date).toDateString() !== new Date().toDateString()}
                    >
                        En progreso
                    </option>
                    <option value="Finalizada">Finalizada</option>
                </select>
                {errors.status && <div className="invalid-feedback">{errors.status}</div>}
            </div>


            <div className="mb-3">
                <label className="form-label">Encargado(a)</label>
                <select name="caregiverId" value={data.caregiverId} onChange={handleForm} className="form-select">
                    <option value="">Seleccione el encargado</option>
                    {caregivers.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-3 d-flex gap-2 justify-content-end gap-2">
                {hasAuthority('PERMISSION_ACTIVIDADES_CREATE') && (
                    <button type="submit" className="btn btn-success float-end float-end">Guardar</button>
                )}
                <Link className='btn btn-secondary float-end' to="/actividades/mostrar">Volver</Link>
            </div>
        </form>
    );
};

export default ActivityForm;