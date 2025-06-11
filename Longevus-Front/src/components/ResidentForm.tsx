import React, { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ResidentData } from "../services/ResidentService";
import { errorAlert } from "../js/alerts";

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


  useEffect(() => {
    if (initialData) {
      console.log("Cargando initialData en form:", initialData);
      setData(initialData);
    }
  }, [initialData]);

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

      if (value.length > 0 && (value.length < 8 || value.length > 12)) {
        setErrors(prev => ({
          ...prev,
          identification: "Debe tener entre 8 y 12 dígitos"
        }));
      } else {
        setErrors(prev => ({
          ...prev,
          identification: ""
        }));
      }
    }


    setData(prev => ({
      ...prev, //version anterior del form
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
          accept="image/*"
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <button type="submit" className="btnAddResident float-end">Guardar</button>
    </form>
  );
};

export default ResidentForm;


