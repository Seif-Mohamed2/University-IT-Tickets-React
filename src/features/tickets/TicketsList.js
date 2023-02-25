import { useGetTicketsQuery } from "./ticketsApiSlice";
import Ticket from "./Ticket";
import useAuth from "../../hooks/useAuth";

const TicketsList = () => {
    const {
        data: tickets,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTicketsQuery("ticketsList", {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
    const {username, isAdmin, isManager, isStudent} = useAuth();

    if (isSuccess) {
        const { ids, entities } = tickets;
        let filteredids;
        if (isAdmin || isManager){
            filteredids = [...ids];
        } else if (isStudent){
            filteredids = ids.filter(ticketId => entities[ticketId].studentusername === username)
        }
        else {
            filteredids = ids.filter(ticketId => entities[ticketId].username === username)
        }
        const tableContent = filteredids?.length
            ? filteredids.map(ticketId => <Ticket key={ticketId} ticketId={ticketId} />)
            : null

        content = (
            <div className="table-container">
            <div className="table">
                <div className="table__thead">
                        <div className="header-item">Username</div>
                        <div className="header-item">Created</div>
                        <div className="header-item">Updated</div>
                        <div className="header-item">Title</div>
                        <div className="header-item">IT member</div>
                        <div className="header-item">Student</div>
                        <div className="header-item">Edit</div>
                </div>
                <div className="table-contents">
                    {tableContent}
                </div>
            </div>
            </div>
        )
    }

    return content
}
export default TicketsList

