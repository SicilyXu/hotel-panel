import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { mockAlerts, Alert } from "../mocks/alerts";

interface AlertsContextType {
  alerts: Alert[];
  unresolvedCount: number;
  isOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
  resolveAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextType | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isOpen, setIsOpen] = useState(false);

  const unresolvedCount = alerts.filter(a => !a.resolved).length;

  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  const resolveAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, unresolvedCount, isOpen, openPanel, closePanel, resolveAlert }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertsProvider");
  return ctx;
}
