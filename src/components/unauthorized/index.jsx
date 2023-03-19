import { useNavigate } from "react-router-dom";
import lock from "../../images/icons8-lock.gif"
import logo from "../../images/logo.svg";

const Unauthorized = () => {
    const navigate = useNavigate();
    const goBack = () => navigate(-1);
    return(
        <div class="flex items-center justify-center h-screen">
            <div class="md:px-40 px-20 py-10 md:py-20 bg-white rounded-md shadow-xl">
                <div className="flex justify-center">
                    <img alt="logo" className="max-md:text-center" src={logo} width={70} height={70}  />
                </div>
                <div class="flex flex-col items-center">
                <h1 class="font-bold text-green-600 text-xl md:text-4xl">403 FORBIDDEN</h1>
                <img src={lock} className="mt-4 mb-4" alt="lock" width={50} height={50}/>
                <h6 class="mb-2 text-xl font-bold text-center text-gray-800 md:text-3xl">
                    <span class="text-red-500">Oops!</span> Access Denied
                </h6>
                <p class="mb-8 text-center text-base text-gray-500 md:text-lg">
                    You don't have permission to view this site.<br/>Contact Admin if this is a mistake
                </p>
                <button onClick={goBack} class="px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100">
                    Go home
                </button>
                </div>
            </div>
        </div>
    );
}

export default Unauthorized;