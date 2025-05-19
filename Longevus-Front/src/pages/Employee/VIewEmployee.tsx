import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ViewTasksModal from '../../components/ViewTaskModal';
import AddTaskModal from '../../components/AddTaskModal';
import type { Task } from '../../components/ViewTaskModal';
import { getCaregiverById } from '../../services/CaregiverService';
import type { IShift } from '../../components/HourSelector';
import Header from '../../components/HeaderAdmin';
import Footer from '../../components/Footer';
const BACKEND_URL = 'http://localhost:8080/';

const ViewEmployee = () => {
    
    const [employeeData, setEmployeeData] = useState<any>(null);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    
    useEffect(() => {
        if (id) {
            getCaregiverById(id)
                .then(data => {
                     console.log("Employee Data:", data);
                    setEmployeeData(data)})
                .catch(error => {
                    console.error("Error al obtener cuidador:", error);
                    navigate("/error"); // O redirige donde quieras
                });
        }
    }, [id, navigate]);

    
   
    
    // Procesar los datos del schedule si existen
    const workScheduleData = useMemo(() => {
        if (!employeeData?.schedule) return [];
        
        // Comprobar si schedule tiene la estructura que vemos en la consola
        const scheduleInfo: IShift[] = [];
        
        // Si hay entryTime1, entryTime2, exitTime1, exitTime2, etc.
        if (employeeData.schedule.entryTime1) {
            scheduleInfo.push({
                id: '1',
                entryTime: employeeData.schedule.entryTime1,
                exitTime: employeeData.schedule.exitTime1
            });
        }
        
        if (employeeData.schedule.entryTime2) {
            scheduleInfo.push({
                id: '2',
                entryTime: employeeData.schedule.entryTime2,
                exitTime: employeeData.schedule.exitTime2
            });
        }
        
        return scheduleInfo.length > 0 ? scheduleInfo : [];
    }, [employeeData?.schedule]);
    
    // Procesar los días seleccionados
    const selectedDaysData = useMemo(() => {
        if (!employeeData?.schedule?.days) return [];
        return employeeData?.schedule.days.split(',').map((day: string) => day.trim());
    }, [employeeData?.schedule?.days]);
    
    // Procesar los turnos seleccionados
    const selectedShiftsData = useMemo(() => {
        if (!employeeData?.shift) return [];
        return employeeData.shift.split(',').map((shift: string) => shift.trim());
    }, [employeeData?.shift]);

    // Construir la URL completa de la imagen
    const imageUrl = useMemo(() => {
        if (employeeData?.photoUrl && typeof employeeData.photoUrl === 'string') {
            return `${BACKEND_URL}${employeeData.photoUrl}`;
        }
        return 'placeholder-image-url.jpg'; // Imagen por defecto
    }, [employeeData?.photoUrl]);


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

    // Helper function to check if array exists and has items
    const hasItems = (arr?: any[]) => Array.isArray(arr) && arr.length > 0;

    return(
        <>
            <Header/>
            <div className="container mt-5">
                <div className="card m-5">
                    <div className="row g-0">
                        {/* Columna para la imagen y datos básicos */}
                        <div className="col-md-4 text-center p-3">
                            <img
                                src={imageUrl}
                                className="img-fluid rounded"
                                alt={`Foto de ${employeeData?.name || 'Empleado'}`}
                                style={{ maxWidth: '150px' }}
                            />
                            <h5 className="card-title mt-3"><strong>Nombre: </strong>{employeeData?.name}</h5>
                            <p className="card-text"><strong>Identificación:</strong> {employeeData?.identification}</p>
                            <p className="card-text"><strong>Email:</strong> {employeeData?.email}</p>
                            <p className="card-text"><strong>Salario:</strong> ${Number(employeeData?.salary).toFixed(2)}</p>
                        </div>

                        {/* Columna para otros datos y las secciones de tareas */}
                        <div className="col-md-8">
                            <div className="card-body">
                                {/* Días de trabajo */}
                                <div className="card-text">
                                    <strong>Días de trabajo:</strong>
                                    {hasItems(selectedDaysData) ? (
                                        <ul>
                                            {selectedDaysData.map((day:string, index: number) => (
                                                <li key={index}>{day}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay días seleccionados</span>
                                    )}
                                </div>

                                {/* Horario de trabajo */}
                                <div className="card-text">
                                    <strong>Horario de trabajo:</strong>
                                    {hasItems(workScheduleData) ? (
                                        <ul>
                                            {workScheduleData.map((shift) => (
                                                <li key={shift.id}>{`De ${shift.entryTime} a ${shift.exitTime}`}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay horarios configurados</span>
                                    )}
                                </div>

                                {/* Turnos seleccionados */}
                                <div className="card-text">
                                    <strong>Turnos seleccionados:</strong>
                                    {hasItems(selectedShiftsData) ? (
                                        <ul>
                                            {selectedShiftsData.map((shift:string, index:number) => (
                                                <li key={index}>{shift}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span className="text-muted"> No hay turnos seleccionados</span>
                                    )}
                                </div>

                                <hr/> 
                                <h6>Gestión de Tareas Pendientes</h6>
                                <div className="d-flex gap-2"> 
                                    <button className="btn btn-primary" onClick={handleShowViewTasks}>
                                        Mostrar ({tasks.length}) <i className="bi bi-eye-fill"/>
                                    </button>
                                    <button className="btn btn-success" onClick={handleShowAddTask}>
                                        Agregar <i className="bi bi-clipboard-plus-fill"/>
                                    </button>
                                </div>
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
            <Footer/>
        </>
    );
}

export default ViewEmployee;