import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { Clipboard } from "@angular/cdk/clipboard";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BatchDetails } from "../../../@core/data/batch-model";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  did: string;
  status: string = "primary";

  currentTheme = "default";

  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private cb: Clipboard,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.themeService.changeTheme("corporate");
    this.userService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => (this.user = users));
    this.did = this.userService.getDid();
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
      );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {}

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  copyToClipboard(): void {
    this.cb.copy(this.did);
  }

  callDetails(input: HTMLInputElement) {
    const url = `http://localhost:3000/api/v1/details`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("address", input.value);

    this.http.get<BatchDetails>(url, { params: queryParams }).subscribe(
      () => {
        this.router.navigate(["/pages/details"], {
          queryParams: { address: input.value },
        });
        this.status = "primary";
        input.value = "";
      },
      () => {
        this.status = "danger";
        input.value = "";
      }
    );
  }
}
