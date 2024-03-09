/* eslint-disable */
import { AiFillDelete } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import useAxiosPrivate from '../../utility/useAxiosPrivate';

const DeleteAlert = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useDispatch();

  const deleteProduct = async (id) => {
    try {
      await axiosPrivate.delete(`${props.endpoint}${id}`);
      dispatch(props.reduxAction(id));
      // Return true to indicate success
      return true;
    } catch (error) {
      // Return the error object to handle it in the calling function
      Swal.fire({
        title: 'Error deleting product',
        text: error,
        icon: 'error',
        confirmButtonColor: 'red'
      });
      return false;
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmed = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: 'green',
        confirmButtonText: 'Yes, delete it!',
        preConfirm: async () => {
          Swal.showLoading();
          const result = await deleteProduct(id);
          if (result === true) {
            Swal.fire({
              title: 'Deleted Successfully',
              icon: 'success',
              confirmButtonColor: 'green'
            });
          } else {
            Swal.fire({
              title: 'Error deleting product',
              text: result.message,
              icon: 'error',
              confirmButtonColor: 'red'
            });
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      });

      if (!confirmed.isConfirmed) {
        Swal.close();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={() => handleDelete(props.id)} className="text-green-100 hover:text-red-900">
      <AiFillDelete />
    </button>
  );
};

export default DeleteAlert;
