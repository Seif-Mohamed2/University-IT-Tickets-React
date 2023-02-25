import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faHouse} from "@fortawesome/free-solid-svg-icons"
import { useNavigate,  useLocation} from "react-router-dom"
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
    const navigate = useNavigate();
    const {pathName} = useLocation();
    const {username, status, isStudent} = useAuth();
    const onGoHomeClicked = () => navigate('/dash');
    let goHomeButton = null;
    if (pathName !== '/dash'){
        goHomeButton = (<button
            title = "Home"
            className = "dash-footer__button icon-button"
            onClick={onGoHomeClicked}
        >
            <FontAwesomeIcon icon = {faHouse}/>
        </button>)
    }
    let userContent;
    if (isStudent){
        userContent = (<>Current Student: {username}</>)
    } else {
        userContent = <>
            <p>Current User: {username}</p>
            <p>Status: {status}</p></>
    }
    const content = (
        <footer className ="dash-footer">
            {goHomeButton}
            {userContent}
        </footer>
    )
  return (
    content
  )
}

export default DashFooter
