import { Navigate, Route, Routes } from "react-router-dom";
import IntroAnimation from "./components/IntroAnimation";
import RequireAuth from "./components/admin/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Booking from "./pages/Booking";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Agenda from "./pages/admin/Agenda";
import Appointments from "./pages/admin/Appointments";
import AdminServices from "./pages/admin/AdminServices";
import AdminBarbers from "./pages/admin/AdminBarbers";
import Settings from "./pages/admin/Settings";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";
import AccessDenied from "./pages/AccessDenied";
import { CustomerAuthProvider } from "./services/customerAuth";

export default function App() {
  return (
    <>
      <IntroAnimation />
      <CustomerAuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="sobre" element={<About />} />
            <Route path="servicos" element={<Services />} />
            <Route path="contato" element={<Contact />} />
            <Route path="agendar" element={<Booking />} />
            <Route path="meus-agendamentos" element={<CustomerAccount />} />
            <Route path="acesso-negado" element={<AccessDenied />} />
          </Route>
          <Route path="entrar" element={<CustomerLogin />} />
          <Route path="admin" element={<Login />} />
          <Route path="admin" element={<RequireAuth />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="agenda" element={<Agenda />} />
              <Route path="agendamentos" element={<Appointments />} />
              <Route path="servicos" element={<AdminServices />} />
              <Route path="barbeiros" element={<AdminBarbers />} />
              <Route path="configuracoes" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CustomerAuthProvider>
    </>
  );
}
