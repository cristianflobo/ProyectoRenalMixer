import Swal from 'sweetalert2'

const mensajeOkCancel = (title:string, confirmado: () => void, _cancelado):void => {
  Swal.fire({
    title: title,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ok'
  }).then((result) => {
    if (result.isConfirmed) {
        confirmado()
    }
  })
}

export {
    mensajeOkCancel
}