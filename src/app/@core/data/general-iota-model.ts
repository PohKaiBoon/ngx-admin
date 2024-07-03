export interface Mnemonic {
  mnemonic: string[];
}

export interface Account {
  alias: string;
  coinType: string;
  index: number;
}

export interface Wallet {
  account: Account;
  did: string;
}

export interface NewAddress {
  address: string;
  waitingRequests: number;
}
