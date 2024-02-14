import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import { ProductPage } from "./pages/products";
import { Login } from "./pages/login";
import Dashboard from "./pages/adminDashboard";
import Missing from "./components/missing";
import { ProtectedAuth, ProtectedRoute } from "./utility/protected";
import Unauthorized from "./components/unauthorized";
import RequireAuth from "./utility/requiredAuth";
import Customer from "./pages/userDashboard";
import PersistLogin from "./utility/persistLogin";
import Cart from "./components/addTocart/Cart";

const ROLES = {
  user: "ROLE_USER",
  admin: "ROLE_ADMIN",
  superAdmin: "ROLE_SUPER_ADMIN",
};

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* login routes */}
          <Route path="/products" element={<ProductPage />} />
          <Route
            path="/login"
            element={
              // <ProtectedAuth>
              <Login />
              // </ProtectedAuth>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/cart" element={<Cart />} />

          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.admin, ROLES.superAdmin]} />
              }
            >
              <Route path="/admin/*" element={<Dashboard />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.user]} />}>
              <Route path="/customer" element={<Customer />} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="/*" element={<Missing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
