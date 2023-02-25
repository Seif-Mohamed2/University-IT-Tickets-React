import { useState, useEffect } from "react";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "./ticketsApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import { useUpdateUserMutation } from "../users/usersApiSlice";

const EditTicketForm = ({ ticket, users, students }) => {

  const {isAdmin, isManager, isStudent } = useAuth();
  const [updateTicket, { isLoading, isSuccess, isError, error }] =
    useUpdateTicketMutation();

  const [
    deleteTicket,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteTicketMutation();

  const [updateUser, { isSuccessUser, isErrorUser, errorUser, isLoadingUser }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  const originalUser = ticket.user;
  const [title, setTitle] = useState(ticket.title);
  const [text, setText] = useState(ticket.text);
  const [completed, setCompleted] = useState(ticket.completed);
  const [userId, setUserId] = useState(ticket.user);

  const [studentName, setStudentName] = useState(ticket.studentusername);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowsuggestions] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [studentId, setStudentId] = useState(ticket.student);

  const handleStudentNameChange = (e) => {
    setFilteredSuggestions(
      students.filter((suggestion) =>
        suggestion.username
          .toLowerCase()
          .startsWith(e.target.value.toLowerCase())
      )
    );
    setAccepted(false);
    setStudentName(e.target.value);
    setShowsuggestions(true);
  };
  const handleOnStudentClicked = (student) => {
    setStudentName(student.username);
    setStudentId(student.id);
    setAccepted(true);
    setShowsuggestions(false);
  };

  useEffect(() => {
    if ((isSuccess || isDelSuccess) && isSuccess) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/tickets");
    }
  }, [isSuccess, isDelSuccess, isSuccessUser, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, text, userId, studentId, accepted].every(Boolean) && !isLoading && !isLoadingUser;

  const onSaveTicketClicked = async (e) => {
    if (canSave) {
      if (!(originalUser === userId)){
        const userToDecrease = users.filter((foundUser)=> foundUser.id === originalUser)[0]
        const userToIncrease = users.filter((foundUser)=> foundUser.id === userId)[0]
        const newTicketDecrease = userToDecrease.ticketsNo - 1
        const newTicketIncrease = userToIncrease.ticketsNo + 1
        await updateUser({...userToIncrease, ticketsNo: newTicketIncrease})
        await updateUser({...userToDecrease, ticketsNo: newTicketDecrease})
      }
      await updateTicket({
        id: ticket.id,
        user: userId,
        title,
        text,
        completed,
        student: studentId,
      });
    }
  };

  const onDeleteTicketClicked = async () => {
    const userToDecrease = users.filter((foundUser)=> foundUser.id === originalUser)[0]
    const newTicketDecrease = userToDecrease.ticketsNo - 1
    await updateUser({...userToDecrease, ticketsNo: newTicketDecrease})
    await deleteTicket({ id: ticket.id });
  };

  const created = new Date(ticket.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(ticket.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  let options_tab = null;
  if (isAdmin || isManager) {
    const options = users.map((user0) => {
      return (
        <option key={user0.id} value={user0.id}>
          {" "}
          {user0.username}
        </option>
      );
    });
    options_tab = (
      <div>
        <label
          className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <select
          id="username"
          name="username"
          className="form__select"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </div>
    );
  }

  const errClass = isError || isDelError || isErrorUser ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message || errorUser?.data?.message) ?? "";
  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteTicketClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }
  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Ticket #{ticket.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveTicketClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
          </div>
        </div>
        <label className="form__label" htmlFor="ticket-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="ticket-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="ticket-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="ticket-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />
        <div className="">
          <div className="form__divider">
            <div className="user_student_form_container">
              <div className="ticket_edit_form_user">
                {options_tab}
              </div>
              {!isStudent && <div className="student_input">
                <label className="form__input student_input" htmlFor="Student">
                  STUDENT:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form__select"
                  value={studentName}
                  onChange={handleStudentNameChange}
                  autoComplete="off"
                ></input>
                {showSuggestions && studentName !== "" && (
                  <ul className="students_ul">
                    {filteredSuggestions.map((suggestion) => (
                      <li
                        className="student_li"
                        key={suggestion.id}
                        onClick={() => {
                          handleOnStudentClicked(suggestion);
                        }}
                      >
                        {suggestion.username}
                      </li>
                    ))}
                  </ul>
                )}
              </div>}
            </div>
          </div>
          <div className="form_created_time">
            <p className="ticket_edit_last_row">
              Created:
              <br />
              {created}
            </p>
            <p className="ticket_edit_last_row">
              Updated:
              <br />
              {updated}
            </p>
            <label className="ticket_edit_last_row" htmlFor="ticket-completed">
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="ticket-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditTicketForm;
