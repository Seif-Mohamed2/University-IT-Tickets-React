import { useEffect } from 'react'

import { useNavigate, Link, useLocation } from 'react-router-dom'

import { useSendLogoutMutation } from '../features/auth/authApiSlice'

import useAuth from '../hooks/useAuth'

const TICKETS_REGEX = /^\/dash\/tickets(\/)?$/
const USERS_REGEX = /^\/dash\/users(\/)?$/
const STUDENTS_REGEX = /^\/dash\/students(\/)?$/

const DashHeader = () => {
    const { isManager, isAdmin } = useAuth()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [sendLogout, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/')
    }, [isSuccess, navigate])

    const onNewTicketClicked = () => navigate('/dash/tickets/new')
    const onNewUserClicked = () => navigate('/dash/users/new')
    const onNewStudentClicked = () => navigate('/dash/students/new')
    const onTicketsClicked = () => navigate('/dash/tickets')
    const onUsersClicked = () => navigate('/dash/users')
    const onStudentsClicked = () => navigate('/dash/students')
    const onHomePageClicked = () => navigate('/dash')




    let newTicketButton = null
    if (TICKETS_REGEX.test(pathname)) {
        newTicketButton = (
            <p onClick={onNewTicketClicked} className="navbar-item">New Ticket</p>
        )
    }

    let newUserButton = null
    if (USERS_REGEX.test(pathname)) {
        newUserButton = (
            <p onClick={onNewUserClicked} className="navbar-item">New User</p>
        )
    }

    let newStudentButton = null;
    if (STUDENTS_REGEX.test(pathname)) {
        newStudentButton = (
            <p onClick={onNewStudentClicked} className="navbar-item">New Student</p>
        )
    }

    let userButton = null
    if (isManager || isAdmin) {
        if (!USERS_REGEX.test(pathname) && pathname.includes('/dash')) {
            userButton = (
                <p onClick={onUsersClicked} className="navbar-item">Users</p>
            )
        }
    }

    let StudentButton = null
    if (isManager || isAdmin) {
        if (!STUDENTS_REGEX.test(pathname) && pathname.includes('/dash')) {
            StudentButton = (
                <p onClick={onStudentsClicked} className="navbar-item">Students</p>
            )
        }
    }

    let ticketsButton = null
    if (!TICKETS_REGEX.test(pathname) && pathname.includes('/dash')) {
        ticketsButton = (
            <p onClick={onTicketsClicked} className="navbar-item">Tickets</p>
        )
    }

    const logoutButton = (
        <p onClick={sendLogout} className="navbar-item">Log out</p>
    )
    const homeButton = (
        <p onClick={onHomePageClicked} className="navbar-item">Home</p>
    )

    const errClass = isError ? "errmsg" : "offscreen"

    let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
        buttonContent = (
            <>
                {homeButton}
                {newTicketButton}
                {newUserButton}
                {newStudentButton}
                {ticketsButton}
                {userButton}
                {StudentButton}
                {logoutButton}
            </>
        )
    }

    const content = (
        <>
            <p className={errClass}>{error?.data?.message}</p>

            <header className="dash-header">
                <div className={`dash-header__container `}>
                    <Link to="/dash">
                        <h1 className="dash-header__title">University IT Tickets</h1>
                    </Link>
                    <nav className="dash-header__nav">
                        {buttonContent}
                    </nav>
                </div>
            </header>
        </>
    )

    return content
}
export default DashHeader
