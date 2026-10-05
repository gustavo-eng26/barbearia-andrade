import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../../services/auth";
import { useCustomerAuth } from "../../services/customerAuth";
export default function RequireAuth() {
  const { customer } = useCustomerAuth();
  if (customer) return <Navigate to="/acesso-negado" replace />;
  return isLoggedIn() ? <Outlet /> : <Navigate to="/admin" replace />;
}
