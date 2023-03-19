import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import { Login } from './pages/login';
import Dashboard from './pages/adminDashboard';
import Missing from './components/missing';
import { ProtectedAuth, ProtectedRoute } from './utility/protected';
import Unauthorized from './components/unauthorized';
import RequireAuth from './utility/requiredAuth';
import Customer from './pages/userDashboard';

const ROLES = {
  user: 'ROLE_USER',
  admin: 'ROLE_ADMIN',
  superAdmin: 'ROLE_SUPER_ADMIN'
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          {/* login routes */}
          <Route path='/login' 
            element={
              // <ProtectedAuth>
                <Login/>
              // </ProtectedAuth>
            }
          />
          <Route element={<RequireAuth allowedRoles={[ROLES.admin, ROLES.superAdmin]} />}>
            <Route path='/admin/*' element={<Dashboard />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.user]} />}>
            <Route path='/customer' element={<Customer />} />
          </Route>
      
          {/* catch all */}
          <Route path="/*" element={<Missing />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
