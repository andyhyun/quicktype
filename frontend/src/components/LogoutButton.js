import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <button
        className="button"
        style={{ width: 100, fontSize: 10, maxHeight: 20 }}
        onClick={() => logout()}
      >
        Sign Out
      </button>
    )
  )
}

export default LogoutButton;
