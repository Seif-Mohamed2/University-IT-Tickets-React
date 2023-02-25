import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import TicketsList from "./features/tickets/TicketsList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditTicket from "./features/tickets/EditTicket";
import NewTicket from "./features/tickets/NewTicket";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/ROLES";
import NewStudentForm from "./features/students/NewStudentForm";
import EditStudent from "./features/students/EditStudent";
import StudentsList from "./features/students/StudentsList"
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} isStudent={true}/>}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />
                <Route path="tickets">
                  <Route index element={<TicketsList />} />
                  <Route path="new" element={<NewTicket />} />
                  <Route path=":id" element={<EditTicket />} />
                </Route>
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path="new" element={<NewUserForm />} />
                    <Route path=":id" element={<EditUser />} />
                  </Route>
                  <Route path="students">
                    <Route index element={<StudentsList/>}/>
                    <Route path=":id" element={<EditStudent />}/>
                    <Route path="new" element={<NewStudentForm />} />
                  </Route>
                </Route>
              </Route>

            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
