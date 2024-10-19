import { useCallback } from "react";
import classes from "./Register.module.css";
import {
  Form,
  Link,
  redirect,
  useNavigation,
  useActionData,
} from "react-router-dom";
const Register = () => {
  const navigation = useNavigation();
  const resStatus = useActionData();
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
          {resStatus && resStatus !== 200 && (
            <p className="error">Server Error</p>
          )}
          <Form className={classes.loginForm} method="POST">
            <input type="text" placeholder="Username" name="userName" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />

            <input
              type="password"
              placeholder="Confirm Password"
              name="ConfirmPassword"
            />
            <button
              className={classes.loginBtn}
              type="submit"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting" ? "submitting" : "Sign Up"}
            </button>
            <Link to="/login" className={classes.createAcc}>
              Log In To Account
            </Link>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
export const signupAction = async ({ request }) => {
  const formData = await request.formData();
  const response = await fetch(
    "http://localhost:8080/api/auth/signup/newUser",
    {
      method: "POST",
      body: JSON.stringify({
        userName: formData.get("userName"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  if (response.status === 200) {
    return redirect("/login");
  } else {
    return response.status;
  }
};
