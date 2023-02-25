import { useNavigate } from 'react-router-dom'
import { useGetTicketsQuery } from './ticketsApiSlice'
import { memo } from 'react'

const Ticket = ({ ticketId }) => {

    const { ticket } = useGetTicketsQuery("ticketsList", {
        selectFromResult: ({ data }) => ({
            ticket: data?.entities[ticketId]
        }),
    })
    const navigate = useNavigate()

    if (ticket) {
        const created = new Date(ticket.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const updated = new Date(ticket.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/tickets/${ticketId}`)

        return (
            <div className="table__row">
                <div className="table-data note__status">
                    {ticket.completed
                        ? <span className="note__status--completed">Completed</span>
                        : <span className="">Open</span>
                    }
                </div>
                <div className="table-data">{created}</div>
                <div className="table-data">{updated}</div>
                <div className="table-data">{ticket.title}</div>
                <div className="table-data">{ticket.username}</div>
                <div className="table-data">{ticket.studentusername}</div>
                <button className="table__button table-data table-data log"
                        onClick={handleEdit} >
                        Edit
                </button>
            </div>
        )

    } else return null
}

const memoizedTicket = memo(Ticket)

export default memoizedTicket
