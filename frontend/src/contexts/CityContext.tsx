import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  availableCities: string[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
};

interface CityProviderProps {
  children: ReactNode;
}

export const CityProvider: React.FC<CityProviderProps> = ({ children }) => {
  // List of available cities from the dataset
  const availableCities = [
    'All Cities',
    'Ahmedabad',
    'Aizawl',
    'Amaravati',
    'Amritsar',
    'Bengaluru',
    'Bhopal',
    'Brajrajnagar',
    'Chandigarh',
    'Chennai',
    'Coimbatore',
    'Delhi',
    'Ernakulam',
    'Gurugram',
    'Guwahati',
    'Hyderabad',
    'Jaipur',
    'Jorapokhar',
    'Kochi',
    'Kolkata',
    'Lucknow',
    'Mumbai',
    'Patna',
    'Pune',
    'Shillong',
    'Talcher',
    'Thiruvananthapuram',
    'Visakhapatnam',
  ];

  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  const value = {
    selectedCity,
    setSelectedCity,
    availableCities,
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};

