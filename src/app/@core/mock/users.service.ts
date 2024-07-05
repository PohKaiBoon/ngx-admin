import { of as observableOf, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Contacts, RecentUsers, User, UserData } from "../data/users";

@Injectable()
export class UserService extends UserData {
  private time: Date = new Date();
  currentUser: User = { name: null, picture: null, did: null };

  getUsers(): Observable<User> {
    return observableOf(this.currentUser);
  }

  setUser(name: string, did: string): void {
    this.currentUser.name = name;
    this.currentUser.did = did;
  }

  getUserAlias(): string {
    return this.currentUser.name;
  }

  getDid(): string {
    return this.currentUser.did
  }
}
