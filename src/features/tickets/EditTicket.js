import { useParams } from "react-router-dom";
import EditTicketForm from "./EditTicketForm";
import { useGetTicketsQuery } from "./ticketsApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";
import { useGetStudentsQuery } from "../students/studentsApiSlice";

const EditTicket = () => {
  useTitle("techTickets: Edit Ticket");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { ticket } = useGetTicketsQuery("ticketsList", {
    selectFromResult: ({ data }) => ({
      ticket: data?.entities[id],
    }),
  });

  const {
    data: usersData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;
  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }
  let users = [];
  if (isSuccess){
    const {ids, entities} = usersData;
    for (var i = 0; i < ids?.length; i++){
        users.push(entities[ids[i]]);
    }
  }

  const { students } = useGetStudentsQuery("studentsList", {
    selectFromResult: ({ data }) => ({
      students: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!ticket || !users?.length || !students?.length)
    return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (ticket.username !== username && ticket.studentusername !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  content = (
    <EditTicketForm ticket={ticket} users={users} students={students} />
  );

  return content;
};
export default EditTicket;
