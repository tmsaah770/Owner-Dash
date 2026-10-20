import { FiLock, FiMail, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { useState } from "react";

function InputField({
  label,
  placeholder,
  type = "text",
  icon = "user",
}) {
  const [showPassword, setShowPassword] = useState(false);

  const getIcon = () => {
    if (icon === "mail") {
      return <FiMail />;
    }

    if (icon === "lock") {
      return <FiLock />;
    }

    return <FiUser />;
  };

  const inputType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="input-group">
      <label>{label}</label>

      <div className="input-wrapper">
        <span className="input-icon">
          {getIcon()}
        </span>

        <input
          type={inputType}
          placeholder={placeholder}
        />

        {type === "password" && (
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );
}

export default InputField;