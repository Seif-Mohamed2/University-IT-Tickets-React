import NewTicketForm from './NewTicketForm'
import { useGetUsersQuery } from '../users/usersApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'
import { useGetStudentsQuery } from "../students/studentsApiSlice"


const NewTicket = () => {
    useTitle('techTickets: New Ticket')

    const {
        data: usersData,
        isLoading: isLoadingUser,
        isSuccess: isSuccessUser,
        isError: isErrorUser,
        error: errorUser,
      } = useGetUsersQuery("usersList", {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      });

    const {
        data: studentsData,
        isLoading,
        isSuccess,
        isError,
        error,
      } = useGetStudentsQuery("studentsList", {
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
      });

      let content;
      if (isLoading || isLoadingUser) content = <p>Loading...</p>;

      if (isError || isErrorUser) {
        content = <p className="errmsg">{error?.data?.message} {errorUser?.data?.message}</p>;
      }
      let users = [];
      let students = [];
      if (isSuccess){
        const {ids, entities} = studentsData;
        for (var i = 0; i < ids?.length; i++){
            students.push(entities[ids[i]]);
        }
      }
      if (isSuccessUser){
        const {ids, entities} = usersData;
        for (i = 0; i < ids?.length; i++){
            users.push(entities[ids[i]]);
        }
      }

    if (!users?.length || !students?.length) return <PulseLoader color={"#FFF"} />

    content = <NewTicketForm users={users} students= {students}/>

    return content
}
export default NewTicket
