import { store } from '../../app/store'
import { ticketsApiSlice } from '../tickets/ticketsApiSlice'
import { usersApiSlice } from '../users/usersApiSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(ticketsApiSlice.util.prefetch('getTickets', 'ticketsList', { force: true }))
        store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch