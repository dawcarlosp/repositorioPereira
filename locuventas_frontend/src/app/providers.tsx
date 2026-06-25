import type { ReactNode } from "react";
import { AuthProvider } from "@context/AuthContext";
import { HeaderProvider } from "@context/HeaderContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </AuthProvider>
  );
}
