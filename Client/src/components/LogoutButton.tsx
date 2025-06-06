import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/googleUserSlice";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    // Optionally call a logout endpoint to revoke tokens server-side
    dispatch(clearUser());
    window.location.href = "/login";
  };

  return <button onClick={handleLogout}>Logout</button>;
}
