import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CategorySelectionContextType {
  selectedCategoryId: string | null;
  selectedParentCategoryId: string | null;
  setSelectedCategoryId: (id: string | null) => void;
  setSelectedParentCategoryId: (id: string | null) => void;
  clearCategorySelection: () => void;
}

const CategorySelectionContext = createContext<CategorySelectionContextType | undefined>(undefined);

interface CategorySelectionProviderProps {
  children: ReactNode;
}

export const CategorySelectionProvider: React.FC<CategorySelectionProviderProps> = ({ children }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<string | null>(null);

  const clearCategorySelection = () => {
    setSelectedCategoryId(null);
    setSelectedParentCategoryId(null);
  };

  const value = {
    selectedCategoryId,
    selectedParentCategoryId,
    setSelectedCategoryId,
    setSelectedParentCategoryId,
    clearCategorySelection,
  };

  return (
    <CategorySelectionContext.Provider value={value}>
      {children}
    </CategorySelectionContext.Provider>
  );
};

export const useCategorySelection = (): CategorySelectionContextType => {
  const context = useContext(CategorySelectionContext);
  if (context === undefined) {
    throw new Error('useCategorySelection must be used within a CategorySelectionProvider');
  }
  return context;
};