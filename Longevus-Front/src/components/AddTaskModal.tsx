interface AddTaskModalProps {
  show: boolean;
  onClose: () => void;
  employeeName?: string; // Nombre del empleado para el título
  newTaskDescription: string;
  onNewTaskDescriptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTaskSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  show,
  onClose,
  employeeName,
  newTaskDescription,
  onNewTaskDescriptionChange,
  onAddTaskSubmit,
}) => {
  if (!show) {
    return null; // No renderizar nada si el modal no debe mostrarse
  }

  return (
    <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
                    <h5 className="modal-title">Agregar Nueva Tarea para {employeeName || 'Empleado'}</h5>
                    <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
              </div>
                <div className="modal-body">
                    <form onSubmit={onAddTaskSubmit}>
                        <div className="mb-3">
                            <label htmlFor="taskDescription" className="form-label">Descripción de la Tarea</label>
                            <input
                            type="text"
                            className="form-control"
                            id="taskDescription"
                            value={newTaskDescription}
                            onChange={onNewTaskDescriptionChange}
                            required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Guardar <i className="bi bi-clipboard-check-fill"/></button>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
                </div>
          </div>
      </div>
    </div>
  );
};


export default AddTaskModal;