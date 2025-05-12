import React, { useState, ChangeEvent } from "react";

interface ResidentData{
    identification: string;
    name: string;
    age: number;
    healthStatus: string;
    numberRoom: number;
    photo: File | null;
    isActive:boolean;
}

const ResidentForm: React.FC = () => {
const [data, setData] = useState<ResidentData>({
    identification: '',
    name: '',
    age: 0,
    healthStatus: '',
    numberRoom: 0,
    photo: null,
    isActive: false
});

const handleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, type, value, checked, files } = e.target;

    setData(prev => ({
        ...prev, //version anterior del form
        [name]: type === 'file' && files ? files[0]
            : type === 'checkbox' ? checked
            : type === 'number' ? Number(value) : value,
    })) 
};


const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <label className="form-label">Edad</label>
        <input
          type="number"
          name="age"
          value={data.age}
          onChange={handleForm}
          className="form-control"
        />
      </div>

      <div className="mb-3">
          <label className="form-label">Estado de Salud</label>
          <select name="healthStatus" value={data.healthStatus}
                  onChange={handleForm} className="form-select">          
                  <option value="bueno">Bueno</option>
                  <option value="regular">Regular</option>
                  <option value="malo">Malo</option>
                  
          </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Número de habitación</label>
        <input
          type="number"
          name="numberRoom"
          value={data.numberRoom}
          onChange={handleForm}
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

      <div className="form-check mb-3">
        <input
          type="checkbox"
          name="isActive"
          checked={data.isActive}
          onChange={handleForm}
          className="form-check-input"
          id="active"
        />
        <label className="form-check-label" htmlFor="subscribed">
          ¿Está activo?
        </label>
      </div>

      <button type="submit" className="btn">Enviar</button>
    </form>
  );
};

export default ResidentForm;


