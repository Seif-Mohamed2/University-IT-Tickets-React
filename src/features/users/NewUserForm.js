import { useState, useEffect } from "react"
import { useAddNewUserMutation } from "./usersApiSlice"
import { useNavigate } from "react-router-dom"
import { ROLES } from "../../config/ROLES"

const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/


const NewUserForm = () => {
    const [addNewUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewUserMutation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [isValidUserName, setIsValidUserName] = useState(false);
    const [password, setPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [roles, setRoles] = useState(["Employee"]);

    useEffect(() => {
        setIsValidUserName(USER_REGEX.test(userName))
    }, [userName]);

    useEffect(() => {
        setIsValidPassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUserName('')
            setPassword('')
            setRoles([])
            navigate('/dash/users')
        }
    }, [isSuccess, navigate]);

    const onUserNameChanged = (e) => setUserName(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setRoles(values)
    }


    const canSave = [roles.length, isValidUserName, isValidPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave){
            await addNewUser({username: userName, password, roles, ticketsNo: 0});
        }
    }

    const options =  Object.values(ROLES).map(role => {
        return (
            <option
                key={role}
                value={role}

            > {role}</option >
        )
    });

    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !isValidUserName ? 'form__input--incomplete' : ''
    const validPwdClass = !isValidPassword ? 'form__input--incomplete' : ''

    const content = (
        <div class="form-container">
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form-title">
                    <h2>New User</h2>
                </div>
                <div className="form-group">
                <label className="form-label" htmlFor="username">
                    USERNAME</label>
                <input
                    className={`form-input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={userName}
                    onChange={onUserNameChanged}
                />
                </div>
                <div className="form-group">
                <label className="form-label" htmlFor="password">
                    PASSWORD</label>
                <input
                    className={`form-input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                </div>
                <div calssName="form-group">
                <label className="form-label" htmlFor="roles">
                    ASSIGNED ROLES</label>
                    </div>
                <div className="form-group">
                <select
                    id="roles"
                    name="roles"
                    className={`$ custom-select {validRolesClass}`}
                    multiple={true}
                    size="3"
                    value={roles}
                    onChange={onRolesChanged}
                >
                    {options}
                </select>
                </div>
                <div class="form-actions">
                <button class="form-button new-user-button" title="Save" disabled={!canSave}>
                    Save
                </button>
                </div>
            </form>
        </div>
    )

    return content
}

export default NewUserForm
