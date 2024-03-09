import Swal from 'sweetalert2';

// eslint-disable-next-line import/prefer-default-export
export const alertClose = (icon, message) => {
  Swal.fire({
    position: 'center',
    icon,
    title: message,
    showConfirmButton: true,
    timer: 3000
  });
};
