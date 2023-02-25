import { useParams } from 'react-router-dom'
import EditStudentForm from './EditStudentForm'
import { useGetStudentsQuery } from './studentsApiSlice'
import PulseLoader from 'react-spinners/PulseLoader'
import useTitle from '../../hooks/useTitle'

const EditStudent = () => {
    useTitle('techTickets: Edit Student')

    const { id } = useParams()

    const { student } = useGetStudentsQuery("studentsList", {
        selectFromResult: ({ data }) => ({
            student: data?.entities[id]
        }),
    })

    if (!student) return <PulseLoader color={"#FFF"} />

    const content = <EditStudentForm student={student} />

    return content
}
export default EditStudent