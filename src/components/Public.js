
import { Link } from 'react-router-dom'
import { useNavigate  } from 'react-router-dom'
const Public = () => {
    const navigate = useNavigate();
    const handleLoginClicked = (e) => {
        e.preventDefault();
        navigate("/login");
    }
    const content = (
        <div className="public-container">
        <section className="public">
            <header>
                <h1>Welcome to <span className="nowrap">University Tickets Platform</span></h1>
            </header>
            <main className="public__main">
                <address className="public__addr">
                    University of Rochester IT Tickets<br />
                    Created by Seif Mohamed<br />
                </address>
                <br />
                <button className="log" onClick={handleLoginClicked}>Login</button>
            </main>
            <footer>
                <Link to="/login">LOGIN</Link>
            </footer>
        </section>
        </div>

    )
    return content
}
export default Public
