export type Country = {
  code: string;
  name: string;
};

export type State = {
  code: string;
  name: string;
  countryCode: string;
};

export type Lga = {
  name: string;
  stateCode: string;
  countryCode: string;
};

export type StatesQuery = {
  country: string;
};

export type LgasQuery = {
  country: string;
  state: string;
};
