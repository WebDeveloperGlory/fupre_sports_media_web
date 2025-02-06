import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    role?: string;
}

export const getAdminRole = (): string | null => {
    if ( typeof document === "undefined" ) return null; // Handle SSR environments

    const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

    if ( !token ) return null;

    try {
        const decoded: DecodedToken = jwtDecode<DecodedToken>( token );
        return decoded.role ?? null; // Ensure a safe return
    } catch {
        return null;
    }
};