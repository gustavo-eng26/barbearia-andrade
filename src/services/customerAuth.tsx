import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  whatsappReminders: boolean;
}

export interface CustomerAppointment {
  id: string;
  customerId: string;
  serviceId: string;
  barberId: string;
  date: string;
  time: string;
  status: "Pendente" | "Confirmado" | "Concluído" | "Cancelado";
}

interface StoredAccount {
  customer: Customer;
  salt: string;
  passwordHash: string;
}

interface CustomerAuthValue {
  customer: Customer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Omit<Customer, "id">, password: string) => Promise<void>;
  update: (data: Omit<Customer, "id">) => void;
  changePassword: (currentPassword: string, nextPassword: string) => Promise<void>;
  logout: () => void;
}

const SESSION_KEY = "andrade:customer-session";
const ACCOUNTS_KEY = "andrade:customer-accounts";
const APPOINTMENTS_KEY = "andrade:customer-appointments";

function readStoredCustomer(): Customer | null {
  const value = localStorage.getItem(SESSION_KEY);
  return value ? JSON.parse(value) as Customer : null;
}

function readAccounts(): StoredAccount[] {
  const value = localStorage.getItem(ACCOUNTS_KEY);
  return value ? JSON.parse(value) as StoredAccount[] : [];
}

function passwordHash(password: string, salt: string): Promise<string> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${password}`))
    .then(hash => Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join(""));
}

function persistCustomer(customer: Customer) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(customer));
}

const CustomerAuthContext = createContext<CustomerAuthValue | null>(null);

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(readStoredCustomer);
  const [loading, setLoading] = useState(false);

  const value = useMemo<CustomerAuthValue>(() => ({
    customer,
    loading,
    async login(email, password) {
      setLoading(true);
      try {
        if (email.trim().toLowerCase() === "admin" && password === "admin") {
          const accounts = readAccounts();
          let demoAccount = accounts.find(item => item.customer.id === "customer-demo-admin");
          if (!demoAccount) {
            const demoCustomer: Customer = {
              id: "customer-demo-admin",
              name: "Cliente Demonstração",
              phone: "(32) 99999-9999",
              email: "cliente-demo@barbeariaandrade.local",
              whatsappReminders: false,
            };
            const salt = crypto.randomUUID();
            demoAccount = { customer: demoCustomer, salt, passwordHash: await passwordHash("admin", salt) };
            accounts.push(demoAccount);
            localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
          }
          persistCustomer(demoAccount.customer);
          setCustomer(demoAccount.customer);
          return;
        }
        const account = readAccounts().find(item => item.customer.email.toLowerCase() === email.trim().toLowerCase());
        if (!account || await passwordHash(password, account.salt) !== account.passwordHash) {
          throw new Error("E-mail ou senha incorretos.");
        }
        persistCustomer(account.customer);
        setCustomer(account.customer);
      } finally {
        setLoading(false);
      }
    },
    async register(data, password) {
      setLoading(true);
      try {
        const accounts = readAccounts();
        if (accounts.some(item => item.customer.email.toLowerCase() === data.email.trim().toLowerCase())) {
          throw new Error("Já existe uma conta com este e-mail. Entre ou use outro e-mail.");
        }
        const customer = { ...data, id: crypto.randomUUID(), email: data.email.trim().toLowerCase() };
        const salt = crypto.randomUUID();
        accounts.push({ customer, salt, passwordHash: await passwordHash(password, salt) });
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
        persistCustomer(customer);
        setCustomer(customer);
      } finally {
        setLoading(false);
      }
    },
    update(data) {
      if (!customer) return;
      const updated = { ...customer, ...data, email: data.email.trim().toLowerCase() };
      const accounts = readAccounts();
      if (accounts.some(item => item.customer.email === updated.email && item.customer.id !== customer.id)) {
        throw new Error("Já existe uma conta com este e-mail.");
      }
      const account = accounts.find(item => item.customer.id === customer.id);
      if (account) {
        account.customer = updated;
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
      }
      persistCustomer(updated);
      setCustomer(updated);
    },
    async changePassword(currentPassword, nextPassword) {
      if (!customer) throw new Error("Entre na sua conta para alterar a senha.");
      const accounts = readAccounts();
      const account = accounts.find(item => item.customer.id === customer.id);
      if (!account || await passwordHash(currentPassword, account.salt) !== account.passwordHash) {
        throw new Error("A senha atual está incorreta.");
      }
      const salt = crypto.randomUUID();
      account.salt = salt;
      account.passwordHash = await passwordHash(nextPassword, salt);
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
      setCustomer(null);
    },
  }), [customer, loading]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const value = useContext(CustomerAuthContext);
  if (!value) throw new Error("useCustomerAuth deve ser usado dentro de CustomerAuthProvider.");
  return value;
}

export function getCustomerAppointments(customerId: string): CustomerAppointment[] {
  const value = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = value ? JSON.parse(value) as CustomerAppointment[] : [];
  return appointments.filter(appointment => appointment.customerId === customerId);
}

export function saveCustomerAppointment(appointment: CustomerAppointment) {
  const value = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = value ? JSON.parse(value) as CustomerAppointment[] : [];
  appointments.push(appointment);
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export function updateCustomerAppointment(id: string, status: CustomerAppointment["status"]) {
  const value = localStorage.getItem(APPOINTMENTS_KEY);
  const appointments = value ? JSON.parse(value) as CustomerAppointment[] : [];
  const appointment = appointments.find(item => item.id === id);
  if (!appointment) throw new Error("Agendamento não encontrado.");
  appointment.status = status;
  localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}
