import Swal from 'sweetalert2'


export function confirmDeleteAlert(param: string){
    return Swal.fire({
      title: `¿Estas seguro que deseas elimiar a ${param}?`,
      text: "Esta accion es definitiva!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
  })
}

export function succesAlert(title: string, message: string){
  return Swal.fire({
        title: title,
        text: message,
        icon: "success",
        timer: 2500
    });
}

export function errorAlert(message:string){
    Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        timer: 2500
    });
}

export async function loadingAlert<T>(asyncOperation: () => Promise<T>): Promise<T> {
  
  Swal.fire({
    title: 'Cargando datos...',
    html: 'Por favor, espere.',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  try {
    const result = await asyncOperation();
    Swal.close();
    return result;

  } catch (error) {
    
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudieron cargar los datos.'
    });

    
    throw error;
  }
}
