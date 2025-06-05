import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { initializeTokenRefresh } from "@/store/tokenManager";
import type { RootState } from "@/store/store";

export function TokenRefreshInitializer() {
  const accessToken = useSelector((state: RootState) => state.user.accessToken);
  const initialized = useRef(false);

  useEffect(() => {
    // Only initialize if we have a token and haven't initialized yet
    if (accessToken && !initialized.current) {
      initialized.current = true;
      initializeTokenRefresh();
    }
  }, [accessToken]);

  return null;
}
