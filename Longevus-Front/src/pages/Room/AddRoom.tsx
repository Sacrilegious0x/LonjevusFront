import React, {useState} from 'react';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../../services/RoomService';

export default function AddRoom(){

 const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
  statusRoom: '',
  roomType: '',
  bedCount: 0,
  isActive: true,
  roomNumber: 0,
  });

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target;
  const name = target.name;

  let value: string | number | boolean;
  if (target.type === 'checkbox') {
    // para verificar que es un HTMLInputElement y el necio ts no se queje
    value = (target as HTMLInputElement).checked;
  } else if (target.type === 'number') {
    value = Number(target.value);
  } else {
    value = target.value;
  }

  setFormData(form => ({
    ...form,
    [name]: value,
  }));
};

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {

    const roomJson = { ...formData };
    const newRoom = await createRoom(roomJson);
    console.log('Habitación creada:', newRoom);
    navigate('/habitaciones');
  } catch (error) {
    console.error('Error al crear la habitación:', error);
  }
};

return (
<>
      <Header />
      <div className="container mt-5 form-container">
        <div className="row">
          <div className="col-12">
            <center>
              <h1 className="mt-2">Agregar Habitación</h1>
            </center>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="statusRoom" className="form-label">
                  <i className="bi bi-door-closed-fill"></i> Estado de la habitación:
                </label>
                <select
                  id="statusRoom"
                  name="statusRoom"
                  value={formData.statusRoom}
                  onChange={handleChange}
                  className="form-control"
                  required>
                      <option value="">
                        Seleccione el estado de la habitacion
                    </option>
                    <option value="Disponible">
                        Disponible
                    </option>
                     <option value="No Disponible">
                        No Disponible
                    </option>

                  </select>
              </div>

              <div className="mb-3">
                <label htmlFor="roomType" className="form-label">
                  <i className="bi bi-building"></i> Tipo de habitación:
                </label>
                <select
                  id="roomType"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  className="form-select"
                  required>
                     <option value="">
                        Seleccione un Tipo
                    </option>
                    <option value="Individual">
                        Individual
                    </option>
                     <option value="Grupal">
                        Grupal
                    </option>
                
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="bedCount" className="form-label">
                  <i className="bi bi-houses-fill"></i> Número de camas:
                </label>
                <input
                  type="number"
                  id="bedCount"
                  name="bedCount"
                  value={formData.bedCount}
                  onChange={handleChange}
                  className="form-control"
                  min={1}
                  max={100}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="roomNumber" className="form-label">
                  <i className="bi bi-hash"></i> Número de habitación:
                </label>
                <input
                  type="number"
                  id="roomNumber"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                  className="form-control"
                  min={1}
                  required
                />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-primary">Guardar</button>
                <a href="/habitaciones" className="btn btn-secondary m-1">Volver</a>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
)


}