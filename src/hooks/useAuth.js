import {useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isManager = false;
  let isAdmin = false;
  let status = "Employee";
  let isStudent = false;

  if (token){
    const decode = jwtDecode(token);
    const {username, roles, isStudent} = decode.UserInfo;
    
    isAdmin = roles.includes("Admin");
    isManager = roles.includes("Manager");
    if (isManager){
        status = "Manager"
    }
    if (isAdmin){
        status = "Admin"
    }
    return {username, roles, isAdmin, isManager, status, isStudent};
  }
  return {username: "", isAdmin, isManager, status, roles: [], isStudent};
}

export default useAuth
