export interface Mnemonic {
  mnemonic: string[];
}

export interface Account {
  alias: string;
  coinType: string;
  index: number;
}

export interface NewAddress {
  address: string;
  waitingRequests: number;
}
