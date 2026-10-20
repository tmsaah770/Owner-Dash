import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

function SocialButtons() {
  return (
    <div className="social-buttons">
      <button type="button" className="social-btn">
        <FcGoogle />
        <span>Google</span>
      </button>

      <button type="button" className="social-btn">
        <FaApple />
        <span>Apple</span>
      </button>
    </div>
  );
}

export default SocialButtons;