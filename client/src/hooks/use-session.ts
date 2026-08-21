import { useCallback, useEffect, useState } from "react";
import { api, type SessionUser } from "@/lib/api";

export const AUTH_CHANGED_EVENT = "dku-auth-changed";

export function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setUser(await api.checkSession());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    window.addEventListener(AUTH_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, refresh);
  }, [refresh]);

  return { user, loading, refresh };
}
