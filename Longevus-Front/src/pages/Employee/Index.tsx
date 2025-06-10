import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import {login} from '../../services/AuthService' 
import { succesAlert, errorAlert } from '../../js/alerts';
import { useAuth } from '../../context/AuthContext';
const Index = () => {
    const { hasAuthority } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        userEmail: "",
        password: ""
    });

    const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    }

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
    console.log("CREDENCIALES" , formData);
       try {
         await login({
            email: formData.userEmail,
            password: formData.password
         });
            succesAlert("Login exitoso!","Puede ingresar")
             console.log("Puede ingresar");
             navigate("/residente/mostrar")
             
         
       } catch (error) {
            errorAlert("Credenciales incorrectas")
       }
    }


    return (
        <>
            <Header/>
            <div className='cardLogin'>
                <div className='row'>
                    <div className='cardLogin-body text-center'>
                        <h3>Inicio de Sesion</h3>
                        <form onSubmit={submit}>
                            <input type='text' name='userEmail' onChange={handleForm} placeholder='Ingrese su correo' value={formData.userEmail} />
                            <input type='password' name='password' onChange={handleForm} placeholder='Ingrese su contraseña ' value={formData.password} />
                            <button className='btn btn-success btn-fload-end' type='submit'> <i className="bi bi-box-arrow-in-right" />Iniciar sesion</button>
                        </form>
                        <div className='card-footer'>
                            <a href='#'>Olvide mi contraseña</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Index


