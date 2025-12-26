import React, { createContext, ReactNode, useContext, useState } from 'react';

interface LocationSelectionContextType {
  selectedCityId: string | null;
  selectedStateId: string | null;
  setSelectedCityId: (id: string | null) => void;
  setSelectedStateId: (id: string | null) => void;
  clearLocationSelection: () => void;
}

const LocationSelectionContext = createContext<LocationSelectionContextType | undefined>(undefined);

interface LocationSelectionProviderProps {
  children: ReactNode;
}

export const LocationSelectionProvider: React.FC<LocationSelectionProviderProps> = ({ children }) => {
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);

  const clearLocationSelection = () => {
    setSelectedCityId(null);
    setSelectedStateId(null);
  };

  const value = {
    selectedCityId,
    selectedStateId,
    setSelectedCityId,
    setSelectedStateId,
    clearLocationSelection,
  };

  return (
    <LocationSelectionContext.Provider value={value}>
      {children}
    </LocationSelectionContext.Provider>
  );
};

export const useLocationSelection = (): LocationSelectionContextType => {
  const context = useContext(LocationSelectionContext);
  if (context === undefined) {
    throw new Error('useLocationSelection must be used within a LocationSelectionProvider');
  }
  return context;
};