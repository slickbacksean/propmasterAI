// contexts/PropContext.tsx
import React, { createContext, useState, useContext, useReducer } from 'react';
import { PropBet, PlayerProp } from '../types/props';
import { 
  saveProp, 
  fetchUserProps, 
  deleteProp 
} from '../services/api/propService';

type PropState = {
  savedProps: PropBet[];
  activeProp: PropBet | null;
};

type PropAction = 
  | { type: 'ADD_PROP', payload: PropBet }
  | { type: 'REMOVE_PROP', payload: string }
  | { type: 'SET_ACTIVE_PROP', payload: PropBet | null }
  | { type: 'LOAD_SAVED_PROPS', payload: PropBet[] };

interface PropContextType extends PropState {
  dispatch: React.Dispatch<PropAction>;
  savePropToAccount: (prop: PropBet) => Promise<void>;
  removePropFromAccount: (propId: string) => Promise<void>;
  loadSavedProps: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const PropContext = createContext<PropContextType | undefined>(undefined);

const propReducer = (state: PropState, action: PropAction): PropState => {
  switch (action.type) {
    case 'ADD_PROP':
      return {
        ...state,
        savedProps: [...state.savedProps, action.payload]
      };
    case 'REMOVE_PROP':
      return {
        ...state,
        savedProps: state.savedProps.filter(prop => prop.id !== action.payload)
      };
    case 'SET_ACTIVE_PROP':
      return {
        ...state,
        activeProp: action.payload
      };
    case 'LOAD_SAVED_PROPS':
      return {
        ...state,
        savedProps: action.payload
      };
    default:
      return state;
  }
};

export const PropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(propReducer, {
    savedProps: [],
    activeProp: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savePropToAccount = async (prop: PropBet) => {
    setIsLoading(true);
    try {
      const savedProp = await saveProp(prop);
      dispatch({ type: 'ADD_PROP', payload: savedProp });
    } catch (err) {
      setError('Failed to save prop');
    } finally {
      setIsLoading(false);
    }
  };

  const removePropFromAccount = async (propId: string) => {
    setIsLoading(true);
    try {
      await deleteProp(propId);
      dispatch({ type: 'REMOVE_PROP', payload: propId });
    } catch (err) {
      setError('Failed to remove prop');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedProps = async () => {
    setIsLoading(true);
    try {
      const props = await fetchUserProps();
      dispatch({ type: 'LOAD_SAVED_PROPS', payload: props });
    } catch (err) {
      setError('Failed to load saved props');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PropContext.Provider value={{
      ...state,
      dispatch,
      savePropToAccount,
      removePropFromAccount,
      loadSavedProps,
      isLoading,
      error
    }}>
      {children}
    </PropContext.Provider>
  );
};

export const usePropContext = () => {
  const context = useContext(PropContext);
  if (context === undefined) {
    throw new Error('usePropContext must be used within a PropProvider');
  }
  return context;
};
