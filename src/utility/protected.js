import { Navigate } from "react-router-dom";


///function to protect admin dashboard pages if user is not logged in or not an admin
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("maltiti-token");
    const user = JSON.parse(localStorage.getItem('maltiti-user'));

        if(!isAuthenticated){ 
            return <Navigate to="/" replace/>
        }
        else{
            const userRole = user['roles'][0];
            if(userRole === 'user') return <Navigate to="/" replace/> 
        }

        return children
}

//function to protect authentication pages if user is logged
export const ProtectedAuth = ({ children }) => {
    const isAuthenticated = localStorage.getItem("maltiti-token");
    const user = JSON.parse(localStorage.getItem('maltiti-user'));
    
    if(isAuthenticated){
        const userRole = user['roles'][0];
        if(userRole === "admin") return <Navigate to="/admin" replace/>

        else return <Navigate to="/" replace/>
    
    }
        return children
} 

//function to prevent patient dashboard if user not a logged in or not a patient
export const ProtectedPatient = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem('user'));

        if(!isAuthenticated){
            return <Navigate to="/" replace/>
        }
        else{
            const userRole = user['role__name'];
            if(userRole === 'Admin' || userRole === 'Super Admin') return <Navigate to="/patient" replace/>
        }

    return children

}

