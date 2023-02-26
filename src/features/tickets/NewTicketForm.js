import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewTicketMutation } from "./ticketsApiSlice";
import useAuth from "../../hooks/useAuth";
import { useUpdateUserMutation } from "../users/usersApiSlice";
import { useUpdateStudentMutation } from "../students/studentsApiSlice";
const NewTicketForm = ({ users, students }) => {
  const [
    updateUser,
    {
      isLoading: isLoadingUser,
      isError: isErrorUser,
      isSuccess: isSuccessUser,
      error: errorUser,
    },
  ] = useUpdateUserMutation();

  const [
    updateStudent,
    {
      isLoading: isLoadingStudent,
      isError: isErrorStudent,
      isSuccess: isSuccessStudent,
      error: errorStudent,
    },
  ] = useUpdateStudentMutation();

  const [addNewTicket, { isLoading, isSuccess, isError, error }] =
    useAddNewTicketMutation();
  const navigate = useNavigate();
  const { username, isAdmin, isManager, isStudent } = useAuth();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");


  let studentName_2 = "";
  let studentId_2 = "";
  let user;
  if (!isStudent) {
    user = users.filter((foundUser) => foundUser.username === username)[0];
  } else {
    studentName_2 = username;
    studentId_2 = students.filter((st)=> st.username === username)[0].id;
    const FilteredEmployees = users.filter(
      (user) => !user.roles.includes("Manager") && !user.roles.includes("Admin")
    );
    user = FilteredEmployees[0];
    for (var i = 1; i < FilteredEmployees.length; i++) {
      if (user.ticketsNo > FilteredEmployees[i].ticketsNo) {
        user = FilteredEmployees[i];
      }
    }
  }
  const [userId, setUserId] = useState(user.id);
  const [studentName, setStudentName] = useState(studentName_2);
  const [studentId, setStudentId] = useState(studentId_2);
  useEffect(() => {
    if (isSuccess && isSuccessUser && isSuccessStudent) {
      setTitle("");
      setText("");
      setUserId("");
      navigate("/dash/tickets");
    }
  }, [isSuccess, isSuccessUser, navigate, isSuccessStudent]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onTextChanged = (e) => setText(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowsuggestions] = useState(false);
  const [accepted, setAccepted] = useState(false);

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

  const canSave =
    [title, text, userId].every(Boolean) &&
    !isLoading &&
    !isLoadingUser && !isLoadingStudent && (studentName || isStudent) && (accepted || isStudent);
  const onSaveTicketClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      const assignedUSer = users.filter(
        (foundUser) => foundUser.id === userId
      )[0];
      const ticketNoNew = assignedUSer.ticketsNo + 1;
      const studentToUpdate = students.filter((student0)=>student0.id === studentId)[0];
      const studentNewTicketsNo = studentToUpdate.ticketsNo + 1;
      await addNewTicket({ user: userId, title, text, student: studentId });
      await updateUser({ ...assignedUSer, ticketsNo: ticketNoNew });
      await updateStudent({...studentToUpdate, ticketsNo: studentNewTicketsNo})
    }
  };
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

  const errClass = isError || isErrorUser || isErrorStudent ? "errmsg" : "offscreen";

  const content = (
    <div className="form-container">
    <p className={errClass}>{error}</p>
  <form className="form" onSubmit={onSaveTicketClicked}>
    <h2 className="form-title">New Ticket</h2>

    <div className="form-group">
      <label className="form-label" htmlFor="title">TITLE</label>
      <input
        className="form-input"
        id="title"
        name="title"
        type="text"
        autoComplete="off"
        value={title}
        onChange={onTitleChanged}
      />
    </div>

    <div className="form-group">
      <label className="form-label" htmlFor="text">CONTENT</label>
      <textarea
        className="form-input form-textarea"
        id="text"
        name="text"
        value={text}
        onChange={onTextChanged}
      ></textarea>
    </div>

    <div className=" user_student_form_container">
      {options_tab}
      {!isStudent && <div className="form-group">
      <label className="form-label" htmlFor="username">STUDENT</label>
      <input
        type="text"
        id="username"
        name="username"
        className="form-input"
        value={studentName}
        onChange={handleStudentNameChange}
        autoComplete="off"
      />
      {showSuggestions && studentName !== "" && (
        <ul className="form-suggestions">
          {filteredSuggestions.map((suggestion) => (
            <li
              className="form-suggestion"
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

    <div className="form-actions">
      <button className="form-button" title="Save" disabled={!canSave}>
        Save
      </button>
    </div>

    <p className="form-error-message">
      {error?.data?.message} {errorUser?.data?.message} {errorStudent?.data?.message}
    </p>
  </form>
</div>

  );

  return content;
};

export default NewTicketForm;
