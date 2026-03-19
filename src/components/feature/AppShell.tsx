import { ReactNode, useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { UrgentAlertsPanel } from "./UrgentAlertsPanel";

interface AppShellProps {
  children: ReactNode;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export function AppShell({ children, searchValue = "", onSearchChange }: AppShellProps) {
  const [internalSearch, setInternalSearch] = useState("");
  const search = onSearchChange ? searchValue : internalSearch;
  const handleSearchChange = onSearchChange ?? setInternalSearch;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-60 min-w-0">
        <TopBar searchValue={search} onSearchChange={handleSearchChange} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <UrgentAlertsPanel />
    </div>
  );
}
