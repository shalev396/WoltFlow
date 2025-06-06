import { useState } from "react";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    // Remove any 'g_state' cookie that has invalid JSON value
    document.cookie = `g_state=; Path=/; Max-Age=0; domain=localhost`;

    // Now redirect the browser to your OAuth start
    setIsLoading(true);
    window.location.href = "http://localhost:3000/api/oauth2/start";
  };

  return (
    <button onClick={handleLogin} disabled={isLoading}>
      {isLoading ? "Redirecting..." : "Sign in with Google"}
    </button>
  );
}
