import { useState, useEffect } from "react"
import { useUpdateStudentMutation, useDeleteStudentMutation } from "./studentsApiSlice"
import { useNavigate } from "react-router-dom"
const USER_REGEX = /^[A-z0-9]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/

const EditStudentForm = ({ student }) => {

    const [updateStudent, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useUpdateStudentMutation()

    const [deleteStudent, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteStudentMutation()

    const navigate = useNavigate()

    const [username, setUsername] = useState(student.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [active, setActive] = useState(student.active)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        console.log(isSuccess)
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            navigate('/dash/students')
        }

    }, [isSuccess, isDelSuccess, navigate])

    const onUsernameChanged = e => setUsername(e.target.value)
    const onPasswordChanged = e => setPassword(e.target.value)

    const onActiveChanged = () => setActive(prev => !prev)

    const onSaveStudentClicked = async (e) => {
        if (password) {
            await updateStudent({ id: student.id, username, password, active })
        } else {
            await updateStudent({ id: student.id, username, active })
        }
    }

    const onDeleteStudentClicked = async () => {
        await deleteStudent({ id: student.id })
    }

    let canSave
    if (password) {
        canSave = [validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [validUsername].every(Boolean) && !isLoading
    }

    const errClass = (isError || isDelError) ? "errmsg" : "offscreen"
    const validUserClass = !validUsername ? 'form__input--incomplete' : ''
    const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''

    const errContent = (error?.data?.message || delerror?.data?.message) ?? ''


    const content = (
        <div className="form-container">
            <p className={errClass}>{errContent}</p>
            <form className="form" onSubmit={e => e.preventDefault()}>
                <div className="form-title">
                    <h2>Edit Student</h2>
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
                    value={username}
                    onChange={onUsernameChanged}
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
                <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form-checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>
                <div className="side-buttons">
                <button class="form-button edit-user-button" title="Save" onClick={onSaveStudentClicked} disabled={!canSave}>
                    Save
                </button>
                <button
                    className="form-button edit-user-button"
                    title="Delete"
                    onClick={onDeleteStudentClicked}
                >
                    Delete
                </button>
                </div>

            </form>
        </div>
    )

    return content
}
export default EditStudentForm
