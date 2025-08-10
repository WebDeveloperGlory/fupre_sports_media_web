"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/v2/authStore";
import { getProfile } from "@/lib/requests/v2/user/requests";

export function AuthCheckWrapper({ children }: { children: React.ReactNode }) {
    const { setUser, setLoading, setIsLoggedIn } = useAuthStore();

    useEffect(() => {
        let isMounted = true;

        async function checkAuth() {
            try {
                const res = await getProfile();

                if (!isMounted) return;

                if( res?.code === '99' ) {
                    if( res.message === 'Invalid or Expired Token' || res.message === 'Login Required' ) {
                        setIsLoggedIn(false);
                        setUser(null);
                    }
                } else {
                    setIsLoggedIn(true);
                    setUser(res?.data);
                }
            } catch {
                setUser(null);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        checkAuth();
        return () => {
            isMounted = false;
        };
    }, []);

    return <>{children}</>;
}