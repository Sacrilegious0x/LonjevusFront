import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { EmployeeInitialData } from "../../components/EmployeeForm";
import ViewTasksModal from '../../components/ViewTaskModal';
import AddTaskModal from '../../components/AddTaskModal';
import type { Task } from '../../components/ViewTaskModal';

const dataTest = {
        name: "Juan Perez",
        identification: "123456789",
        email: "juan.perez@example.com",
        photoURL: "https://i.blogs.es/7c85c3/las-primeras-dos-temporadas-de-jojo-s-bizarre-adventure-llegaron-a-max-con-doblaje-latino-compressed/1200_800.jpeg", 
        salary: 50000,
        selectedDays: ["L","K", "M", "J","V"],
        workSchedule: [
            { id: 'shift-1', entryTime: "08:00", exitTime: "12:00" },
            { id: 'shift-2', entryTime: "13:00", exitTime: "17:00" },
        ],
        selectedShifts: ["M", "T"]
    };


const ViewEmployee = ()=>{
    
    const [employeeData, setEmployeeData] = useState<EmployeeInitialData | null>(null);
    const navigate = useNavigate();
   const { id } = useParams<{ id: string }>();
    
      useEffect(() => {
        setEmployeeData(dataTest); // <-- ¡Ahora dentro de useEffect!
        // Si necesitaras hacer algo con el 'id' de la URL aquí con dataTest, podrías
        // console.log("ID de la URL:", id);
        
    }, []);

    // === Estados para la gestión de Tareas y Modales ===
    const [tasks, setTasks] = useState<Task[]>([]); // Estado para la lista de tareas
    const [showViewTasksModal, setShowViewTasksModal] = useState(false); // Controla visibilidad del modal de ver tareas
    const [showAddTaskModal, setShowAddTaskModal] = useState(false); // Controla visibilidad del modal de agregar tarea
    const [newTaskDescription, setNewTaskDescription] = useState(''); // Estado para el input de nueva tarea
    const [editingTask, setEditingTask] = useState<Task | null>(null); // Estado para saber qué tarea se está editando
    const [editingTaskDescription, setEditingTaskDescription] = useState(''); // Estado para el input de edición de tarea
     // === Fin Estados Tareas/Modales ===



    // === Handlers para Modales ===
    const handleShowViewTasks = () => setShowViewTasksModal(true);
    const handleCloseViewTasks = () => setShowViewTasksModal(false);

    const handleShowAddTask = () => setShowAddTaskModal(true);
    const handleCloseAddTask = () => {
        setShowAddTaskModal(false);
        setNewTaskDescription(''); // Limpiar input al cerrar
    };
    // === Fin Handlers Modales ===


    // === Handlers para Agregar Tarea ===
    const handleNewTaskDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTaskDescription(event.target.value);
    };

    const handleAddTaskSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!newTaskDescription.trim()) return; // No agregar tareas vacías

        const newTask: Task = {
            id: Date.now().toString(), // Generar un ID simple basado en timestamp
            description: newTaskDescription.trim(),
        };

        setTasks([...tasks, newTask]); // Agregar nueva tarea al estado
        setNewTaskDescription(''); // Limpiar input
        handleCloseAddTask(); // Cerrar modal
    };
    // === Fin Handlers Agregar Tarea ===


    // === Handlers para Editar Tarea ===
    const handleEditClick = (task: Task) => {
        setEditingTask(task);
        setEditingTaskDescription(task.description);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditingTaskDescription('');
    };

    const handleSaveEdit = (taskId: string) => {
        if (!editingTaskDescription.trim()) return; // No guardar con descripción vacía

        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, description: editingTaskDescription.trim() } : task
        );
        setTasks(updatedTasks); // Actualizar la tarea en el estado
        handleCancelEdit(); // Salir del modo edición
    };

    const handleEditInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditingTaskDescription(event.target.value);
    };
    // === Fin Handlers Editar Tarea ===


    // === Handlers para Eliminar Tarea ===
    const handleDeleteTask = (taskId: string) => {
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        setTasks(filteredTasks); // Eliminar tarea del estado
         // Si la tarea eliminada era la que se estaba editando, cancelar edición
         if (editingTask?.id === taskId) {
             handleCancelEdit();
         }
    };
    // === Fin Handlers Eliminar Tarea ===

    return(

        <>
             <div className="container mt-5">
                <div className="card m-5">
                    <div className="row g-0">
                        {/* Columna para la imagen y datos básicos */}
                        <div className="col-md-4 text-center p-3"> {/* Añadido text-center y padding */}
                            <img
                                src={employeeData?.photoURL || 'placeholder-image-url.jpg'}
                                className="img-fluid rounded" // rounded es para esquinas redondeadas
                                alt={`Foto de ${employeeData?.name || 'Empleado'}`}
                                style={{ maxWidth: '150px' }} // Estilo para controlar el tamaño de la imagen
                            />
                            <h5 className="card-title mt-3"><strong>Nombre: </strong>{employeeData?.name}</h5> {/* mt-3 para margen */}
                            <p className="card-text"><strong>Identificación:</strong> {employeeData?.identification}</p>
                            <p className="card-text"><strong>Email:</strong> {employeeData?.email}</p>
                            <p className="card-text"><strong>Salario:</strong> ${Number(employeeData?.salary).toFixed(2)}</p>
                        </div>

                        {/* Columna para otros datos y las secciones de tareas */}
                        <div className="col-md-8">
                            <div className="card-body">
                                {/* Otros datos del empleado */}
                                <p className="card-text">
                                    <strong>Días de trabajo:</strong>
                                    {employeeData?.selectedDays && employeeData.selectedDays.length > 0 &&  (
                                        <ul>
                                            {employeeData?.selectedDays.map((day, index) => (
                                                <li key={index}>{day}</li>
                                            ))}
                                        </ul>
                                    ) }
                                </p>

                                <p className="card-text">
                                    <strong>Horario de trabajo:</strong>
                                    {employeeData?.workSchedule && employeeData.workSchedule.length > 0 && (
                                        <ul>
                                            {employeeData?.workSchedule.map((shift) => (
                                                <li key={shift.id}>{`De ${shift.entryTime} a ${shift.exitTime}`}</li>
                                            ))}
                                        </ul>
                                    )
                                }
                                </p>

                                 <p className="card-text">
                                     <strong>Turnos seleccionados:</strong>
                                     {employeeData?.workSchedule && employeeData.workSchedule.length > 0 && (
                                         <ul>
                                             {employeeData?.selectedShifts.map((shift, index) => (
                                                 <li key={index}>{shift}</li>
                                             ))}
                                         </ul>
                                     ) 
                                         
                                     }
                                </p>


                                <hr/> 
                                <h6>Gestión de Tareas Pendientes</h6>
                                <div className="d-flex gap-2"> 
                                    <button className="btn btn-primary" onClick={handleShowViewTasks}>
                                        Mostrar  ({tasks.length}) <i className="bi bi-eye-fill"/>
                                    </button>
                                    <button className="btn btn-success" onClick={handleShowAddTask}>
                                        Agregar <i className="bi bi-clipboard-plus-fill"/>
                                    </button>
                                </div>
                                {/* === Fin Sección de Tareas === */}

                                {/* Puedes mantener o eliminar este párrafo si no lo necesitas */}
                                {/* <p className="card-text mt-3"><small className="text-body-secondary">Última actualización: ...</small></p> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
{/* === Modales Separados === */}

            {/* Modal para Mostrar Tareas Pendientes */}
            <ViewTasksModal
                show={showViewTasksModal}
                onClose={handleCloseViewTasks}
                employeeName={employeeData?.name}
                tasks={tasks}
                editingTask={editingTask}
                editingTaskDescription={editingTaskDescription}
                onEditClick={handleEditClick}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onEditInputChange={handleEditInputChange}
                onDeleteTask={handleDeleteTask}
            />

            {/* Modal para Agregar Tarea */}
            <AddTaskModal
                show={showAddTaskModal}
                onClose={handleCloseAddTask}
                employeeName={employeeData?.name}
                newTaskDescription={newTaskDescription}
                onNewTaskDescriptionChange={handleNewTaskDescriptionChange}
                onAddTaskSubmit={handleAddTaskSubmit}
            />

        </>
        
       
    );

}
export default ViewEmployee;