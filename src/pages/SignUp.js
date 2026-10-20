import { Link, useNavigate } from "react-router-dom";
import SocialButtons from "../components/SocialButtons";
import InputField from "../components/InputField";
import AuthHeader from "../components/AuthHeader";

function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    console.log("Sign Up submitted");
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Blue Header */}
        <div className="auth-top signup-top">

          <button
            className="back-button"
            type="button"
            onClick={() => navigate("/login")}
          >
            <span>‹</span>
          </button>

          <AuthHeader title="Create account" />

        </div>

        {/* White Form */}
        <div className="auth-card">

          <SocialButtons />

          {/* Divider */}
          <div className="divider">
            <span></span>
            <p>or&nbsp; Sign in with email</p>
            <span></span>
          </div>

          <form onSubmit={handleSignUp}>

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

            <InputField
              label="Confirm Password"
              placeholder="confirm password"
              type="password"
              icon="lock"
            />

            <button
              type="submit"
              className="primary-btn signup-btn"
            >
              Sign in
            </button>

          </form>

          <div className="account-link signup-link">
            <span>Already have an account?</span>

            <Link to="/login">
              Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SignUp;