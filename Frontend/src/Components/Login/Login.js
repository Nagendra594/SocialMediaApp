import { useNavigate, Link } from "react-router-dom";
import classes from "./Login.module.css";
import { useRef, useState } from "react";
import { userActions } from "../../Store/UserStore/User";
import { useDispatch } from "react-redux";
const initialState = { state: false, message: null };
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const emailRef = useRef();
  const passRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialState);
  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(initialState);
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passRef.current.value;
    const userData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    const fetchedUser = await fetch(
      "http://localhost:8080/api/auth/login/user",
      {
        method: "POST",
        body: JSON.stringify(userData),
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (fetchedUser.status === 422) {
      setError({ state: true, message: "User Credentials does not Match" });
      setLoading(false);
      return;
    }
    if (fetchedUser.status === 500) {
      setError({ state: true, message: "Server Error" });
      setLoading(false);
      return;
    }
    const user = await fetchedUser.json();
    setLoading(false);

    localStorage.setItem("isLogged", true);
    localStorage.setItem("userId", user.userDetails._id);
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    localStorage.setItem("date", futureDate.toLocaleString());
    dispatch(userActions.setUser(user.userDetails));
    navigate("/");
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h1>CHITCHAT</h1>
          <p>
            Connect with friends and the world around you on{" "}
            <strong>CHITCHAT</strong>
          </p>
        </div>
        <div className={classes.right}>
          <form className={classes.loginForm} onSubmit={loginHandler}>
            {error.state && <p className="error">{error.message}</p>}
            <input
              ref={emailRef}
              type="email"
              placeholder="Email"
              name="email"
            />
            <input
              ref={passRef}
              type="password"
              placeholder="Password"
              name="pass"
            />
            <button type="submitt" className={classes.loginBtn}>
              {loading ? "submitting..." : "Log In"}
            </button>
            <span className={classes.forgotPass}>Forgot Password?</span>
            <Link to="/signup" className={classes.createAcc}>
              Create a New Account
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
