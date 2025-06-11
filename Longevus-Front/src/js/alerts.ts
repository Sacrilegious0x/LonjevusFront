import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


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

export function confirmAlert(param: string){
    return Swal.fire({
      title: `¿Estas seguro que deseas agregar a ${param}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Agregar",
      cancelButtonText: "Cancelar"
  })
}

export function succesAlert(title: string, message: string){
  Swal.fire({
        title: title,
        text: message,
        icon: "success",
        timer: 3000
    });
}

export function errorAlert(message:string){
    Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        timer: 3000
    });
}
