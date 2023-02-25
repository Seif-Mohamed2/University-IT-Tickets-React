import { Link } from 'react-router-dom'
import useAuth
 from '../../hooks/useAuth'
const Welcome = () => {

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)
    // eslint-disable-next-line
    const {username, isAdmin, isManager, isStudent} = useAuth();

    const content = (
        <section className="welcome">
            <div className="welcome-page-div">
            <p>{today}</p>
            <br/>
            <h1>Welcome!<br/> {username}</h1>
            </div>
            <div className="welcome-page-div">
            <p className="welcome-page-p"><Link to="/dash/tickets">View Tickets</Link></p>
            <p className="welcome-page-p"><Link to="/dash/tickets/new">Add New Ticket</Link></p>

            {(isManager || isAdmin) && <>
                <p className="welcome-page-p"><Link to="/dash/students">View Students</Link></p>
                <p className="welcome-page-p" ><Link to="/dash/students/new">Add Student</Link></p>
                <p className="welcome-page-p"><Link to="/dash/users">View User Settings</Link></p>
                <p className="welcome-page-p"><Link to="/dash/users/new">Add New User</Link></p>
            </>}
            </div>


        </section>
    )

    return content
}
export default Welcome
