import { AuthProvider } from "@context/AuthContext";
import { HeaderProvider } from "@context/HeaderContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </AuthProvider>
  );
}
