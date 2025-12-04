import api from './api';
import { Country, State, City } from '@/types';

export const locationService = {
  // Get all countries
  getCountries: async (): Promise<Country[]> => {
    const response = await api.get<Country[]>('/api/v1/location/countries');
    return response.data;
  },

  // Get states by country ID
  getStatesByCountry: async (countryId: string): Promise<State[]> => {
    const response = await api.get<State[]>(`/api/v1/location/countries/${countryId}/states`);
    return response.data;
  },

  // Get cities by state ID
  getCitiesByState: async (stateId: string): Promise<City[]> => {
    const response = await api.get<City[]>(`/api/v1/location/states/${stateId}/cities`);
    return response.data;
  },
};
