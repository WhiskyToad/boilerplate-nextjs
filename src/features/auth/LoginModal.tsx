import { LoginForm } from "./LoginForm";

export function LoginModal({
  open,
  onClose,
  title,
  description,
  onLoginComplete,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onLoginComplete?: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <input
        type="checkbox"
        id="login-modal"
        className="modal-toggle"
        checked={open}
        readOnly
      />
      <div className="modal">
        <div
          className="modal-box relative bg-white"
          style={{ backgroundColor: "white", opacity: 1 }}
        >
          <label
            htmlFor="login-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </label>
          <LoginForm
            title={title}
            description={description}
            onLoginComplete={onLoginComplete}
          />
        </div>
      </div>
    </>
  );
}

export default LoginModal;
