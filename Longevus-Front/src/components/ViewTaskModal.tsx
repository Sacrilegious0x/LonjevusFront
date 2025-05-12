export interface Task {
  id?: string;
  idEmployee?:string;
  description: string;
}

interface ViewTasksModalProps {
  show: boolean;
  onClose: () => void;
  employeeName?: string; // Nombre del empleado para el título
  tasks: Task[];
  editingTask: Task | null;
  editingTaskDescription: string;
  onEditClick: (task: Task) => void;
  onCancelEdit: () => void;
  onSaveEdit: (taskId: string) => void;
  onEditInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteTask: (taskId: string) => void;
}

const ViewTasksModal: React.FC<ViewTasksModalProps> = ({
  show,
  onClose,
  employeeName,
  tasks,
  editingTask,
  editingTaskDescription,
  onEditClick,
  onCancelEdit,
  onSaveEdit,
  onEditInputChange,
  onDeleteTask,
}) => {
  if (!show) {
    return null; // No renderizar nada si el modal no debe mostrarse
  }
return (
    <div className="modal show" style={{ display: 'block' }} tabIndex={-1}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tareas Pendientes de {employeeName || 'Empleado'}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {tasks.length > 0 ? (
              <ul className="list-group">
                {tasks.map(task => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {editingTask?.id === task.id ? (
                      <input
                        type="text"
                        className="form-control me-2"
                        value={editingTaskDescription}
                        onChange={onEditInputChange}
                      />
                    ) : (
                      <span>{task.description}</span>
                    )}
         
                    <div className="d-flex gap-2">
                      {editingTask?.id === task.id ? (
                        <>
                         <button className="btn btn-sm btn-secondary" onClick={onCancelEdit}><i className="bi bi-clipboard-minus-fill"/></button>
                          <button className="btn btn-sm btn-success " onClick={() => task.id && onSaveEdit(task.id)}><i className="bi bi-clipboard2-check-fill"/></button>
                         
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-warning " onClick={() => onEditClick(task)}><i className='bi bi-pencil-square'/></button>
                          <button className="btn btn-sm btn-danger" onClick={() => task.id && onDeleteTask(task.id)}><i className="bi bi-trash"/></button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay tareas pendientes.</p>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTasksModal;