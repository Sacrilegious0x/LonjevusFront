import { useState, type ChangeEvent, type FormEvent } from'react';
import Footer from '../../components/Footer';


const Index = () =>{

const [formData, setFormData] = useState({
    userEmail: "",
    password: ""
}); 

    const handleForm = (e: ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target 
        setFormData(prevForm => ({
            ...prevForm, 
            [name]: value,        
        }));
    }

   
    const submit = (e: FormEvent<HTMLFormElement>)=>{
        if (formData.password === "pass"){
            console.log("Puede ingresar");
        }else{
            console.log("No puede ingresar");
        }
    }

    
    return(
        <>
            
                <div className = 'card'>
                    <div className='row'>
                        <div className='card-body text-center'>
                            <h3>Inicio de Sesion</h3>
                            <form onSubmit={submit}>
                                <input type='text' name='userEmail' onChange={handleForm} placeholder='Ingrese su correo' value={formData.userEmail}/>
                                <input type='password' name='password' onChange={handleForm} placeholder='Ingrese su contraseña ' value={formData.password}/> 
                                <button className='btn btn-success btn-fload-end' type='submit'> <i className="bi bi-box-arrow-in-right"> </i>Iniciar sesion</button>
                            </form>
                            <div className='card-footer'>
                                <a href='#'>Olvide mi contraseña</a>
                            </div>
                            
                        </div> 
                    </div>
                    
                </div>
            
        
        </>
    )
}

export default Index


