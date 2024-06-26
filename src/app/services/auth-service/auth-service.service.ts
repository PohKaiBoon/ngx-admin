import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account } from "../../@core/data/general-iota-model";
import { bootstrapApplication } from "@angular/platform-browser";
import { UserService } from "../../@core/mock/users.service";
import { UserData } from "../../@core/data/users";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  apiUrl: string = "http://localhost:3000";
  hasAlias: boolean = false;

  constructor(private http: HttpClient, private userService: UserData) {}

  private checkWallet(): Promise<Account> {
    return this.http
      .get<Account>(`${this.apiUrl}/api/v1/checkWallet`)
      .toPromise();
  }

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl + "/api/User/login", {
      username,
      password,
    });
  }
  // Use async/await to ensure the method waits for the HTTP call to complete
  public async isAuthenticated(): Promise<boolean> {
    try {
      const data = await this.checkWallet();
      this.hasAlias = !!data.alias;
      if (data.alias) {
        this.userService.setUser(data.alias);
      }
      return this.hasAlias;
    } catch (error) {
      console.error("Error checking wallet:", error);
      return false;
    }
  }
}
