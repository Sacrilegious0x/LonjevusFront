import { useState, type ChangeEvent, type FormEvent } from'react';



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
                    <div className='card-body'>
                        <h3>Inicio de Sesion</h3>
                        <form onSubmit={submit}>
                            <input type='text' name='userEmail' onChange={handleForm} placeholder='Ingrese su correo' value={formData.userEmail}/>
                            <input type='text' name='password' onChange={handleForm} placeholder='Ingrese su contraseña' value={formData.password}/>
                            <button className='btn btn-success' type='submit'>Iniciar sesion</button>
                        </form>
                        <a href='#'>Registrarse</a>
                        <a href='#'>Olvide mi contraseña</a>
                    </div>
                </div>
            
        
        </>
    )
}

export default Index

