import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ResidentData } from "../services/ResidentService";
import { errorAlert } from "../js/alerts";
import { getRooms, type IRoom } from "../services/RoomService";

interface ResidentProps {
  onSubmit: (data: ResidentData) => void;
  initialData?: ResidentData;
}

const ResidentForm: React.FC<ResidentProps> = ({ onSubmit, initialData }) => {
  const [data, setData] = useState<ResidentData>(
    initialData !== null && initialData !== undefined ? initialData : {
      id: 0,
      identification: '',
      name: '',
      birthdate: '',
      age: 0,
      healthStatus: 'Bueno',
      numberRoom: 0,
      photo: null,
    });

  const isEditing = !!initialData;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filteredRooms, setFilteredRooms] = useState<IRoom[]>([]);


  useEffect(() => {
    if (initialData) {
      console.log("Cargando initialData en form:", initialData);
      setData(initialData);
    }
  }, [initialData]);


  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const allRooms = await getRooms();
        const availableRooms = allRooms.filter(
          (room) => room.statusRoom.toLowerCase() === "disponible"
        );
        setFilteredRooms(availableRooms);
      } catch (err) {
        console.error("Error al cargar habitaciones", err);
      }
    };

    fetchRooms();
  }, []);


  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const target = e.target as HTMLInputElement;
    const { name, type, value, checked, files } = target;

    if (name === "name" && value !== "" && value.trim() === "") {
      return;
    }

    if (name === "name" && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      return;
    }

    if (name === "identification") {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }

    if (name === "identification") {
      if (!/^\d*$/.test(value)) {
        return;
      }

      if (value.length > 0 && (value.length < 9 || value.length > 12)) {
        setErrors(prev => ({
          ...prev,
          identification: "Debe tener entre 9 y 12 dígitos"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          identification: ""
        }));
      }
    }


    setData(prev => ({
      ...prev,
      [name]: type === 'file' && files ? files[0]
        : type === 'checkbox' ? checked
          : type === 'number' ? Number(value) : value,
    }));


  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validIdentification = /^\d{9,12}$/.test(data.identification);

    if (!validIdentification) {
      setErrors({ identification: "La identificación debe tener entre 9 y 12 digitos" });
      return;
    }

    const requiredFields = [
      "name", "identification", "birthdate", "healthStatus",
      "numberRoom", "photo"
    ];

    const emptyFields = requiredFields.filter((field) => !data[field as keyof typeof data]);

    if (emptyFields.length > 0) {
      errorAlert("Por favor complete todos los campos antes de guardar.");
      return;
    }


    if (!data.photo && isEditing) {
      errorAlert('Seleccione una foto');
      return;
    }


    onSubmit(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="residentForm p-4 border rounded">

      <div className="mb-3">
        <label className="form-label">Identificación</label>
        <input
          type="text"
          name="identification"
          value={data.identification}
          placeholder="ej: 703230654"
          onChange={handleForm}
          className={`form-control ${errors.identification ? "is-invalid" : ""}`}
        />
        {errors.identification && <div className="invalid-feedback">{errors.identification}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="name"
          placeholder="ej: María Gómez"
          value={data.name}
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Fecha de nacimiento</label>
        <input
          type="date"
          name="birthdate"
          value={data.birthdate}
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Estado de Salud</label>
        <select name="healthStatus" value={data.healthStatus}
          onChange={handleForm} className="form-select">
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Malo">Malo</option>

        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Habitación</label>
        <select name="numberRoom" value={data.numberRoom} onChange={handleForm} className="form-select">
          <option value="">Seleccione una habitación</option>
          {filteredRooms.map((room) => (
            <option key={room.id} value={room.id}>
              Habitación #{room.roomNumber} - {room.roomType}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Foto</label>
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-success float-end">Guardar</button>
    </form>
  );
};

export default ResidentForm;


