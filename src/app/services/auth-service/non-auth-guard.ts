import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./auth-service.service";

@Injectable({
  providedIn: "root",
})
export class NonAuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const authenticated = await this.authService.isAuthenticated();
    console.log("NON AUTH", authenticated)
    if (authenticated) {
      this.router.navigate(["/pages/dashboard"]);
      return false;
    } else {
      return true;
    }
  }
}
