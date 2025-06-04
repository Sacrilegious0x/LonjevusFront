import { useState } from "react";
import { saveTask } from "../services/TaskService";

interface AddTaskModalProps {
  show: boolean;
  onClose: () => void;
  employeeName?: string;
  caregiverId?: string | number; // Añadido: ID del cuidador
  onTaskAdded?: (newTask: any) => void; // Callback cuando se agrega una tarea exitosamente
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  show,
  onClose,
  employeeName,
  caregiverId,
  onTaskAdded
}) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!show) {
    return null;
  }

  const handleNewTaskDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskDescription(event.target.value);
  };

  const handleAddTaskSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!newTaskDescription.trim()) {
      setError('La descripción de la tarea no puede estar vacía');
      return;
    }

    if (!caregiverId) {
      setError('No se ha especificado un cuidador para esta tarea');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Crear objeto de tarea para enviar al servidor
      const taskData = {
        caregiver: { id: Number(caregiverId) },
        description: newTaskDescription.trim()
      };

      // Llamar al servicio para guardar la tarea
      const response = await saveTask(taskData);
      
      // Notificar que se agregó la tarea y proporcionar los datos
      if (onTaskAdded) {
        onTaskAdded(response.data);
      }

      // Limpiar y cerrar
      setNewTaskDescription('');
      onClose();
    } catch (err) {
      console.error('Error al guardar la tarea:', err);
      setError('Error al guardar la tarea. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex={-1}>
      <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                    <h5 className="modal-title">Agregar Nueva Tarea para {employeeName || 'Empleado'}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
                <div className="modal-body">
                    <form onSubmit={handleAddTaskSubmit}>
                        <div className="mb-3">
                            <label htmlFor="taskDescription" className="form-label">Descripción de la Tarea</label>
                            <input
                            type="text"
                            className="form-control"
                            id="taskDescription"
                            value={newTaskDescription}
                            onChange={handleNewTaskDescriptionChange}
                            required 
                            />
                        </div>
                        
                    </form>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary"><i className="bi bi-clipboard-check-fill"/>Guardar </button>
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                </div>
          </div>
      </div>
    </div>
  );
};


export default AddTaskModal;