import { useState, useEffect } from "react";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "./ticketsApiSlice";
import { useNavigate } from "react-router-dom";
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
      <div className="form-group">
      <div className="assign-form">
        <label
          className="form-label"
          htmlFor="username"
        >
          ASSIGNED TO
        </label>
        <br/>
        <select
          id="username"
          name="username"
          className="form-input assign-list"
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </select>
      </div>
      </div>
    );
  }

  const errClass = isError || isDelError || isErrorUser ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message || errorUser?.data?.message) ?? "";
  let deleteButton = null;
  if (isManager || isAdmin || isStudent) {
    deleteButton = (
      <button
                    className="form-button edit-user-button"
                    title="Delete"
                    onClick={onDeleteTicketClicked}
                >
                    Delete
                </button>
    );
  }
  const content = (
    <div className="form-container">
      <p className={errClass}>{errContent}</p>
      <form className="form form-tickets" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>EDIT TICKET #{ticket.ticket}</h2>
        </div>
        <div className="form-group">
        <label className="form-label" htmlFor="ticket-title">
          TITLE
        </label>
        <input
          className={`form-input ${validTitleClass}`}
          id="ticket-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />
      </div>
      <div className = "form-group">
        <label className="form-label" htmlFor="ticket-text">
          TEXT
        </label>
        <textarea
          className={`form-input form__input--text ${validTextClass}`}
          id="ticket-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        /></div>

        <div class=" user_student_form_container">
      {options_tab}
      {!isStudent && <div className="form-group">
      <label class="form-label" for="username">STUDENT</label>
      <input
        type="text"
        id="username"
        name="username"
        class="form-input"
        value={studentName}
        onChange={handleStudentNameChange}
        autoComplete="off"
      />
      {showSuggestions && studentName !== "" && (
        <ul class="form-suggestions">
          {filteredSuggestions.map((suggestion) => (
            <li
              class="form-suggestion"
              key={suggestion.id}
              onClick={() => handleOnStudentClicked(suggestion)}
            >
              {suggestion.username}
            </li>
          ))}
        </ul>
      )}
      </div>}
    </div>
          <div className="form_created_time">
            <p className="form-label">
              CREATED
              <br />
              {created}
            </p>
            <p className="form-label time-margin">
              UPDATED
              <br />
              {updated}
            </p>
            <label className="form-label" htmlFor="ticket-completed">
              WORK COMPLETE
              <input
                className="form-checkbox"
                id="ticket-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>
          </div>
        <div className="side-buttons tickets-buttons">
                <button class="form-button edit-user-button" title="Save" onClick={onSaveTicketClicked} disabled={!canSave}>
                    Save
                </button>
                {deleteButton}
                </div>
      </form>
    </div>
  );

  return content;
};

export default EditTicketForm;
