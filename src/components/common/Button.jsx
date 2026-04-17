import { Link } from "react-router-dom";

/**
 * @param {{
 *  to?: string
 *  onClick?: () => void
 *  children: import("react").ReactNode
 *  variant?: "primary" | "secondary" | "ghost" | "outline"
 *  type?: "button" | "submit"
 *  disabled?: boolean
 *  className?: string
 * }} props
 */
function Button({ to, onClick, children, variant = "primary", type = "button", disabled = false, className = "" }) {
  const classByVariant = {
    primary: "bg-navy text-white hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-brand-orange text-white hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed",
    ghost: "border border-gray-200 bg-white text-navy hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  const baseClasses = `inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors duration-150 ${classByVariant[variant]} ${className}`;

  // If it's a link
  if (to) {
    return (
      <Link
        to={to}
        className={baseClasses}
      >
        {children}
      </Link>
    );
  }

  // If it's a button
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}

export default Button;
