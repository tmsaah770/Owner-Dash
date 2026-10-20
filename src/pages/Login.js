import { Link } from "react-router-dom";
import SocialButtons from "../components/SocialButtons";
import InputField from "../components/InputField";
import AuthHeader from "../components/AuthHeader";

function Login() {
  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Login submitted");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Blue Header */}
        <div className="auth-top">
          <AuthHeader title="Welcome Back!" />
        </div>

        {/* White Form */}
        <div className="auth-card">

          <SocialButtons />

          {/* Divider */}
          <div className="divider">
            <span></span>
            <p>or&nbsp; login with email</p>
            <span></span>
          </div>

          <form onSubmit={handleLogin}>

            <InputField
              label="Email Address"
              placeholder="Username or Email"
              type="text"
              icon="mail"
            />

            <InputField
              label="Password"
              placeholder="password"
              type="password"
              icon="lock"
            />

            <div className="forgot-password">
              <button type="button">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              Login
            </button>

          </form>

          <div className="account-link">
            <span>Don't have an account?</span>

            <Link to="/signup">
              Create new account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;