"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  clearConsentCookie,
  readConsentCookie,
  writeConsentCookie,
  type ConsentState,
} from "@/lib/consent";

interface ConsentContextValue {
  consent: ConsentState;
  acceptConsent: () => void;
  denyConsent: () => void;
  /** Resets to "pending" so the banner can be shown again. */
  resetConsent: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

const consentListeners = new Set<() => void>();

function subscribeToConsent(onStoreChange: () => void): () => void {
  consentListeners.add(onStoreChange);
  return () => consentListeners.delete(onStoreChange);
}

function notifyConsentChanged(): void {
  consentListeners.forEach((listener) => listener());
}

function getConsentSnapshot(): ConsentState {
  return readConsentCookie();
}

function getServerConsentSnapshot(): ConsentState {
  return "pending";
}

export function ConsentProvider({
  children,
  initialConsent,
}: {
  children: ReactNode;
  initialConsent?: ConsentState;
}) {
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => initialConsent ?? getServerConsentSnapshot()
  );

  const acceptConsent = useCallback(() => {
    writeConsentCookie("granted");
    notifyConsentChanged();
  }, []);

  const denyConsent = useCallback(() => {
    writeConsentCookie("denied");
    notifyConsentChanged();
  }, []);

  const resetConsent = useCallback(() => {
    clearConsentCookie();
    notifyConsentChanged();
  }, []);

  return (
    <ConsentContext.Provider
      value={{ consent, acceptConsent, denyConsent, resetConsent }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}