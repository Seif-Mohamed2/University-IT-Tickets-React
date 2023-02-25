import { useState, useEffect } from "react"
import { useAddNewStudentMutation } from "./studentsApiSlice"
import { useNavigate } from "react-router-dom"

const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/


const NewStudentForm = () => {
    const [addNewStudent, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useAddNewStudentMutation();
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [password, setPassword] = useState("");
    const [isValidPassword, setIsValidPassword] = useState(false);

    useEffect(() => {
        setIsValidUsername(USER_REGEX.test(username))
    }, [username]);

    useEffect(() => {
        setIsValidPassword(PWD_REGEX.test(password))
    }, [password]);

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            navigate('/dash/students')
        }
    }, [isSuccess, navigate]);

    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);


    const canSave = [isValidUsername, isValidPassword].every(Boolean) && !isLoading

    const onSaveUserClicked = async (e) => {
        e.preventDefault()
        if (canSave){
            await addNewStudent({username: username, password});
        }
    }


    const errClass = isError ? "errmsg" : "offscreen"
    const validUserClass = !isValidUsername ? 'form__input--incomplete' : ''
    const validPwdClass = !isValidPassword ? 'form__input--incomplete' : ''

    const content = (
        <div className= "form-container">
            <p className={errClass}>{error?.data?.message}</p>

            <form className="form" onSubmit={onSaveUserClicked}>
                <div className="form-title">
                    <h2>New Student</h2>
                </div>
                <div className="form-group">
                <label className="form-label" htmlFor="username">
                    USERNAME </label>
                <input
                    className={`form-input ${validUserClass}`}
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="off"
                    value={username}
                    onChange={onUsernameChanged}
                />
                </div>
                <div className = "form-group">
                <label className="form-label" htmlFor="password">
                    PASSWORD </label>
                <input
                    className={`form-input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />
                </div>
                <div class="form-actions">
                <button class="form-button new-student-button" title="Save" disabled={!canSave}>
                    Save
                </button>
                </div>
            </form>
        </div>
    )

    return content
}

export default NewStudentForm
