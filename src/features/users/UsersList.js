import { useGetUsersQuery } from "./usersApiSlice"
import User from './User'

const UsersList = () => {

    const {
        data: users,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetUsersQuery("usersList", {
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

        const { ids } = users

        const tableContent = ids?.length
            ? ids.map(userId => <User key={userId} userId={userId} />)
            : null

        content = (
            <div className="table-container">
            <div className="table">
                <div className="table__thead">
                        <div className="header-item">Username</div>
                        <div className="header-item">Roles</div>
                        <div className="header-item">Tickets</div>
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
export default UsersList
