import { FiChevronLeft } from "react-icons/fi";

function AuthHeader({ title, showBackButton = false }) {
  return (
    <>
      {showBackButton && (
        <button className="back-button" type="button">
          <FiChevronLeft />
        </button>
      )}

      <h1 className="auth-title">{title}</h1>
    </>
  );
}

export default AuthHeader;