import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

const BASE_URL = 'http://localhost:8000';

const CitiesContext = createContext();

const initialData = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };

    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payload };

    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };

    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error('Unknow action type');
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialData
  );
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });

      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();

        dispatch({ type: 'cities/loaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error during loading cities...',
        });
      }
    }

    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return;

      try {
        dispatch({ type: 'loading' });

        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();

        dispatch({ type: 'city/loaded', payload: data });
      } catch (err) {
        dispatch({
          type: 'rejected',
          payload: 'There was an error during loading city...',
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    try {
      dispatch({ type: 'loading' });

      const res = await fetch(`${BASE_URL}/cities/`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      dispatch({ type: 'city/created', payload: data });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error during loading creating the new city...',
      });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: 'loading' });

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch (err) {
      dispatch({
        type: 'rejected',
        payload: 'There was an error during deleting the city...',
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (!context)
    throw new Error('CitiesContext was used outside of the CitiesProvider🔥');

  return context;
}

export { CitiesProvider, useCities };
