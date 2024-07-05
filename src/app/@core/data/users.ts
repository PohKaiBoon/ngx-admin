import { Observable } from 'rxjs';

export interface User {
  name: string;
  picture: string;
  did: string;
}

export interface Contacts {
  user: User;
  type: string;
}

export interface RecentUsers extends Contacts {
  time: number;
}

export abstract class UserData {
  abstract getUsers(): Observable<User>;
  abstract setUser(name: string, did: string): void;
  abstract getUserAlias(): string;
  abstract getDid(): string;
}
