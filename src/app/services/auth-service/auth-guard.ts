import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    if (authenticated) {
      return true;
    } else {
      this.router.navigate(["/auth/register"]);
      return false;
    }
  }
}
