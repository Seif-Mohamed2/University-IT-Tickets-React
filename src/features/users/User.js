import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { memo } from 'react'

const User = ({ userId }) => {

    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        }),
    })

    const navigate = useNavigate()

    if (user) {
        const handleEdit = () => navigate(`/dash/users/${userId}`)

        const userRolesString = user.roles.toString().replaceAll(',', ', ')

        const cellStatus = user.active ? '' : 'table__cell--inactive'

        return (
            <div className="table__row">
                <div className={`table-data ${cellStatus}`}>{user.username}</div>
                <div className={`table-data ${cellStatus}`}>{userRolesString}</div>
                <div className={`table-data ${cellStatus}`}>{user.ticketsNo}</div>
                <button className="table__button table-data table-data log"
                        onClick={handleEdit} >
                        Edit
                </button>
            </div>
        )

    } else return null
}

const memoizedUser = memo(User)

export default memoizedUser
