import { useState, type ChangeEvent } from'react';
import Footer  from '../../components/Footer';

const AddEmployee = ()=>{
    const [formData, setFormData] = useState({
        name: "",
        identification: "",
        email: "",
        password: "",

    }); 
    const handleForm = (e: ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target 
        setFormData(prevForm => ({
            ...prevForm, 
            [name]: value,        
        }));
    }
    return(
        <>
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-12'>
                        <h1>Agregar un empleado</h1>
                        <form>
                            <div className='mb-3'>
                                <label className='form-label'>Nombre: </label>
                                <input type='text' name='name' onChange={handleForm} value={formData.name} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Identificaci&oacute;n: </label>
                                <input type='text' name='identification' onChange={handleForm}value={formData.identification} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Correo: </label>
                                <input type='text' name='email' onChange={handleForm} value={formData.email} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Contrase&ntile;a: </label>
                                <input type='text' name='password' onChange={handleForm} value={formData.password} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <label>Fotografia: </label>
                                <input type='file' name='photo' onChange={handleForm} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <h6>Turno <i className="bi bi-calendar-week-fill"></i> </h6>                             
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio1" value="M"/>
                                        <label className="form-check-label" htmlFor="inlineRadio1">M</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio2" value="T"/>
                                        <label className="form-check-label" htmlFor="inlineRadio2">T</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="checkbox" name="inlineRadioOptions" id="inlineRadio3" value="N" />
                                        <label className="form-check-label" htmlFor="inlineRadio3">N</label>
                                    </div>
                            </div>
                            <div className='mb-3'>
                                <label>Suelo: </label>
                                <input type='number' name='salary' onChange={handleForm} className='form-control' required/>
                            </div>
                            <div className='mb-3'>
                                <input type='submit' value={"Guardar"} className='btn btn-primary' required/>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )

}
export default AddEmployee