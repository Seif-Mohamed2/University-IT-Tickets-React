import { useGetStudentsQuery } from "./studentsApiSlice"
import Student from './Student'

const StudentsList = () => {

    const {
        data: students,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetStudentsQuery("studentsList", {
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnMountOrArgChange: true
  })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = students

        const tableContent = ids?.length
            ? ids.map(studentId => <Student key={studentId} studentId={studentId} />)
            : null

        content = (
        <div className="table-container">
            <div className="table">
                <div className="table__thead">
                        <div className="header-item">Username</div>
                        <div className="header-item">Tickets</div>
                        <div className="header-item">Edit</div>
                </div>
                <div  className="table-contents">
                    {tableContent}
                </div>
            </div>
            </div>
        )
    }

    return content
}
export default StudentsList
