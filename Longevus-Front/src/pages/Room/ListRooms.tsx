import {useEffect,useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import { Link } from "react-router-dom";
import type { columnDefinition } from "../../components/TableBasic";
import Header from "../../components/HeaderAdmin";
import Footer from "../../components/Footer";
import Table from '../../components/TableBasic';
import { deleteRoom, getRooms } from "../../services/RoomService";


interface IRoom{
    id:number,
    statusRoom:string,
    roomType:string,
    bedCount:number,
    isActive:boolean,
    roomNumber:number
}

const RoomList=() => {

    const [roomData,setRoomData] = useState<IRoom[]>([])
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredRooms = roomData.filter(room =>{
        const term = searchTerm.toLowerCase();
        return(
            room.roomNumber.toString().toLocaleLowerCase().includes(term)
        )


    });

    const roomColumns: columnDefinition<IRoom>[]=[

        {header:'#', accessor:'id',Cell:(_room,index)=>{return(index+1)}},
        {header:'Estado De Habitacion',accessor:'statusRoom'},
        {header:'Tipo de Habitacion',accessor:'roomType'},
        {header:'Cantidad de camas',accessor:'bedCount'},
        {header:'Numero de habitacion',accessor:'roomNumber'},
        {header: 'Acciones', accessor: (room) => room,   
                Cell: (room) =>(
                    <>
                    <Link className="btn btn-warning me-2" to={`/habitaciones/editar/${room.id}`}><i className='bi bi-pencil-square' /></Link>
                    <a className='btn btn-danger me-2' onClick={()=>handleDelete(room.id)}>
                        <i className="bi bi-trash"/>
                    </a>  
                    </>
                ) 
            }


    ];

    useEffect(()=>{
        loadRooms();
    },[]);

    const loadRooms = async () =>{
        try{
            const rooms = await getRooms();

            setRoomData(rooms);
            setLoading(false);
        }catch(err){
            setError(err instanceof Error ? err.message : "Error al cargar habitaciones");
            setLoading(false);
        }
    };

    if(loading){
        return(
            <>
            <Header/>
            <div className="container mt-5">Cargando Habitaciones...</div>
            <Footer/>
            </>
        );
    }

    if(error){
        return(
             <>
            <Header/>
            <div className="container mt-5 text-danger" >{error}</div>
            <Footer/>
            </>
        );

    }

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar esta habitacion?");
        if (!confirmDelete) return;
      
         try {
            await deleteRoom(id);
            setRoomData((prev) => prev.filter((p) => p.id !== id));
            alert("Habitacion eliminada correctamente");
          } catch (err) {
            alert(err instanceof Error ? err.message : "Error desconocido al eliminar habitacion");
          }
        };

        return(
             <>  
    <Header/>
      <div className="container ">
        <div className='row'>
            <div className='card mt-5 mb-5'>
                <div className='card-title d-flex justify-content-between align-items-center mt-3'>
                        <h4 className="m-2">Lista de productos</h4>
                        <Link className='btn btn-success' to='/habitaciones/agregar'>Agregar</Link>
                </div>  
                <div className='card-body'>
                        <input className="mb-3" type="text" placeholder="Buscar..." id="RoomSearch" value={searchTerm} onChange={(e)=> setSearchTerm(e.target.value)}/>
                        <button className="btn btn-secondary" id="btnSearch"><i className='bi bi-search'/></button>
                        <Table<IRoom> data={filteredRooms} columns={roomColumns} selectedRows={new Set()} onToggleRow={()=>{}} onSelectAll={()=>{}}/>
                </div>
            </div>
        </div>
      </div>
    <Footer/>
  </>  
        );
};

export default RoomList;

