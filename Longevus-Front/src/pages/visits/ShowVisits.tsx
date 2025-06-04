import Table  from '../../components/TableBasic'
import type {columnDefinition} from '../../components/TableBasic';
import Footer from '../../components/Footer';
import Header from '../../components/HeaderAdmin';
import { getAllVisits } from '../../services/VisitService';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
interface IVisitData{
    id: number,
    name: string,
    visitDate: string, 
    visitHour: string,
    phoneNumer: string,
    email: string,
    relationship: string,
    resident:{
        id:number,
        name:string,
        numberRoom:number
    }
}

const showVisits = ()=>{
    const navigate = useNavigate();
    const [visitData, setVisitData] = useState<IVisitData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
            const fetchData = async () => {
                try {
                    const caregivers = await getAllVisits();
                    setVisitData(caregivers);
                } catch (error) {
                    console.error("Error al cargar los cuidadores:", error);
                } finally {
                    setLoading(false);
                }
            };
    
            fetchData();
        }, []);

        const filteredVisits = visitData.filter(visit => {
        const term = searchTerm.toLowerCase();
        return (
            visit.name.toLowerCase().includes(term) ||
            visit.visitDate.includes(term)||
            visit.email.toLowerCase().includes(term) ||
            visit.resident.name.toLowerCase().includes(term) ||
            visit.resident.numberRoom.toString().toLowerCase().includes(term)
        );

        const handleDeleteVisit = async () =>{

        }

        const visitColumns: columnDefinition<IVisitData>[]=[
            {header: '#', accessor: 'id', Cell:(visit, index)=>{return(index+1)}},
            {header: 'Nombre', accessor: 'name'},
            {header: 'Fecha Visita', accessor: 'visitDate'},
            {header: 'Hora visita', accessor: 'visitHour'},
            {header: 'Correo', accessor: 'email'},
            {header: 'Contacto', accessor: 'phoneNumer'},
             {header: 'Parentesco', accessor: 'relationship'},
            {header: 'Residente', accessor: (row: IVisitData) =>row.resident.name},
            {header: 'Habitacion', accessor: (row: IVisitData) =>row.resident.numberRoom},
            {header: 'Acciones', accessor: (visit) => visit,   
            Cell: (visit) =>(
            <>
            <a className='btn btn-warning me-2' onClick={()=>navigate(`/`)}>
                <i className='bi bi-pencil-square'/>
            </a>
            
            <a className='btn btn-danger me-2' onClick={() => handleDeleteVisit(/*visit.id*/)}>
                <i className="bi bi-trash"/>
            </a>
            
            </>
        )
        
    }


        ]
    });
    return(
        <>
        
        </>
    )

}

