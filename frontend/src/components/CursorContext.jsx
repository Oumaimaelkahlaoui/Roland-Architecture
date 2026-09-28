import { createContext, useContext, useMemo, useState } from 'react';

const CursorContext = createContext({ label: null, setLabel: () => {} });

export function CursorProvider({ children }) {
  const [label, setLabel] = useState(null);
  const value = useMemo(() => ({ label, setLabel }), [label]);
  return (
    <CursorContext.Provider value={value}>{children}</CursorContext.Provider>
  );
}

export function useCursor() {
  return useContext(CursorContext);
}