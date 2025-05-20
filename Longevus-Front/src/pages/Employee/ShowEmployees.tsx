import Table from '../../components/TableBasic';
import type {columnDefinition} from '../../components/TableBasic';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdmin';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllCaregivers, deleteCaregiver} from '../../services/CaregiverService';

interface IPerson{
    id: number;
    name: string;
    identification: string;
    email: string;
    salary: string;
}
const ShowEmployee = () =>{
    const navigate = useNavigate();
    const [userData, setUserData] = useState<IPerson[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const caregivers = await getAllCaregivers();
                setUserData(caregivers);
            } catch (error) {
                console.error("Error al cargar los cuidadores:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredUsers = userData.filter(user => {
        const term = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(term) ||
            user.identification.includes(term)||
            user.email.toLowerCase().includes(term) ||
            user.salary.toString().toLowerCase().includes(term)
        );
    });
    const handleDeleteCaregiver = async (caregiverId: number) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar al cuidador con ID ${caregiverId}?`)) {
            return;
        }

        setLoading(true); 
        setError(null);

        try {
            const response = await deleteCaregiver(caregiverId);
            console.log(response.data); 
            alert(response.data || "Cuidador eliminado exitosamente");

        
            setUserData(prevUsers => prevUsers.filter(user => user.id !== caregiverId));
        } catch (err) {
            console.error(`Error al eliminar el cuidador ${caregiverId}:`, err);
            let errorMessage = "Error al eliminar el cuidador.";
          
            
            setError(errorMessage);
            alert(errorMessage); 
        } finally {
            setLoading(false);
        }
    };

   const personColumns: columnDefinition<IPerson>[] =[
    {header: '#', accessor: 'id', Cell:(person, index)=>{return(index+1)}},
    {header: 'Nombre', accessor: 'name'},
    {header: 'Identificacion', accessor: 'identification'},
    {header: 'Correo', accessor: 'email'},
    {header: 'Salario', accessor: 'salary'},
    {header: 'Acciones', accessor: (person) => person,   
        Cell: (person) =>(
            <>
            <a className='btn btn-info me-2' onClick={()=>navigate(`/empleado/perfil/${person.id}`)}>
                <i className='bi bi-eye'/>
            </a>
            <a className='btn btn-warning me-2' onClick={()=>navigate(`/empleado/editar/${person.id}`)}>
                <i className='bi bi-pencil-square'/>
            </a>
            
            <a className='btn btn-danger me-2' onClick={() => handleDeleteCaregiver(person.id)}>
                <i className="bi bi-trash"/>
            </a>
            
            </>
        )
        
    }
   ];
    if (loading) return <div className="container mt-5">Cargando cuidadores...</div>;
   return(
    <>
    <Header/>
    <div className='container'>
            <div className='row'>
                <div className='card mt-5 mb-5'>
                    <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4>Lista de empleados</h4>
                        <Link className='btn btn-success' to='/empleado/agregar'><i className='bi bi-person-plus-fill'/></Link>
                    </div>
                    <div className='card-body'>
                        <input type="text" placeholder="Buscar..." id="userSearch" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<IPerson> data={filteredUsers} columns={personColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                    </div>
                </div>
                
            </div>
            
        </div>
        <Footer/>
    </>
        
   )


   
}
export default ShowEmployee;
