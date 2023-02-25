import { useNavigate } from 'react-router-dom'
import { useGetStudentsQuery } from './studentsApiSlice'
import { memo } from 'react'

const Student = ({ studentId }) => {

    const { student } = useGetStudentsQuery("studentsList", {
        selectFromResult: ({ data }) => ({
            student: data?.entities[studentId]
        }),
    })

    const navigate = useNavigate()

    if (student) {
        const handleEdit = () => navigate(`/dash/students/${studentId}`)

        const cellStatus = student.active ? '' : 'table__cell--inactive'

        return (
            <div className="table__row">
                <div className={`table-data ${cellStatus}`}>{student.username}</div>
                <div className={`table-data ${cellStatus}`}>{student.ticketsNo}</div>
                <button className="table__button table-data table-data log"
                        onClick={handleEdit} >
                        Edit
                </button>
            </div>
        )

    } else return null
}

const memoizedStudent = memo(Student)

export default memoizedStudent
