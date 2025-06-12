import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ResidentData } from "../services/ResidentService";

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

  useEffect(() => {
    if (initialData) {
      console.log("Cargando initialData en form:", initialData);
      setData(initialData);
    }
  }, [initialData]);

  const handleForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

    const target = e.target as HTMLInputElement;
    const { name, type, value, checked, files } = target;

    setData(prev => ({
      ...prev, //version anterior del form
      [name]: type === 'file' && files ? files[0]
        : type === 'checkbox' ? checked
          : type === 'number' ? Number(value) : value,
    }))
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="residentForm p-4 border rounded">

      <div className="mb-3">
        <label className="form-label">Identificacion</label>
        <input
          type="text"
          name="identification"
          value={data.identification}
          readOnly={isEditing}
          onChange={handleForm}
          className="form-control"
        />
      </div>

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
        <label className="form-label">Número de habitación</label>
        <input
          type="number"
          name="numberRoom"
          value={data.numberRoom}
          onChange={handleForm}
          min={1}
          max={15}
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Foto</label>
        <input
          type="file"
          name="photo"
          required
          accept="image/*"
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <button type="submit" className="btnAddResident">Guardar</button>
    </form>
  );
};

export default ResidentForm;


