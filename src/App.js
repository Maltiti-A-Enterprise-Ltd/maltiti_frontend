import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import { Login } from './pages/login';
import Dashboard from './pages/adminDashboard';
import { ProtectedAuth, ProtectedRoute } from './utility/protected';



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          {/* login routes */}
          <Route path='/login' 
            element={
              <ProtectedAuth>
                <Login/>
              </ProtectedAuth>
            }
          />
          <Route path='/admin' 
            element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
