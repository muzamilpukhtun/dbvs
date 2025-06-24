"use client";
import { AuthProvider } from "./context/AuthContext";
import { PollProvider } from "./context/PollContext";
export function Providers({ children }) {
  return (
    <AuthProvider>
      <PollProvider>{children}</PollProvider>
    </AuthProvider>
  );
}
