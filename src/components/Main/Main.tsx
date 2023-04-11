import { type ReactNode } from "react";

export const Main: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-700 to-slate-900">
      {children}
    </main>
  );
};
