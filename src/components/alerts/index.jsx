import Swal from "sweetalert2";

export const alertClose = (icon, message) => {
  Swal.fire({
    position: "center",
    icon,
    title: message,
    showConfirmButton: true,
    timer: 3000,
  });
};
