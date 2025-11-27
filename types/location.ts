// Core Location Types
export interface Country {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  states?: State[];
}

export interface State {
  id: string;
  name: string;
  code?: string;
  countryId: string;
  createdAt: string;
  country?: Country;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  stateId: string;
  createdAt: string;
  state?: State;
}
