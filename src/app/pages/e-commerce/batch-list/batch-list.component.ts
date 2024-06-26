import { error } from "console";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { NbDialogService, NbThemeService } from "@nebular/theme";
import { takeWhile } from "rxjs/operators";

import {
  UserActivityData,
  UserActive,
} from "../../../@core/data/user-activity";
import { SmartTableData } from "../../../@core/data/smart-table";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { BatchMenu } from "../../../@core/data/batch-model";
import { BatchListButtonComponent } from "../batch-list-button/batch-list-button.component";
import { DialogPasswordPromptComponent } from "../../modal-overlays/dialog/dialog-password-prompt/dialog-password-prompt.component";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { NewAddress } from "../../../@core/data/general-iota-model";
import { UserData } from "../../../@core/data/users";
import { ToastService } from "../../../services/toast-service/toast-service.service";
import { DateConverter } from "../../../@core/utils/date-converter";

@Component({
  selector: "ngx-batch-list",
  styleUrls: ["./batch-list.component.scss"],
  templateUrl: "./batch-list.component.html",
})
export class BatchListComponent implements OnDestroy, OnInit {
  private alive = true;

  userActivity: UserActive[] = [];
  type = "month";
  types = ["week", "month", "year"];
  currentTheme: string;
  source: LocalDataSource = new LocalDataSource();
  apiUrl: string = "http://localhost:3000";

  constructor(
    private themeService: NbThemeService,
    private dialogService: NbDialogService,
    private http: HttpClient,
    private router: Router,
    private userService: UserData,
    private toastService: ToastService
  ) {
    this.themeService
      .getJsTheme()
      .pipe(takeWhile(() => this.alive))
      .subscribe((theme) => {
        this.currentTheme = theme.name;
      });
  }

  ngOnInit(): void {
    this.fetchAllBatches();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  settings = {
    actions: {
      delete: false,
      add: false,
      edit: false,
    },
    columns: {
      address: {
        title: "Batch ID",
        type: "string",
        sort: false,
      },
      produceType: {
        title: "Produce Type",
        type: "string",
        sort: false,
      },
      dateTimeCreated: {
        title: "Batch Created",
        type: "string",
        sort: false,
      },
      dateTimeUpdated: {
        title: "Last Updated",
        type: "string",
        sort: false,
      },
      button: {
        title: "View Full Traceability",
        sort: false,
        filter: false,
        type: "custom",
        renderComponent: BatchListButtonComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe((row) => {
            console.log(row);
            window.open(
              `http://localhost:4200/pages/dashboard/${row?.address}`,
              "_blank"
            );
          });
        },
      },
    },
  };

  openPromptPasswordDialog() {
    this.dialogService
      .open(DialogPasswordPromptComponent)
      .onClose.subscribe((password) => {
        if (password) {
          const headers = { "Content-Type": "application/json" };
          this.http
            .post(
              this.apiUrl + "/api/v1/generateAddress",
              JSON.stringify({
                alias: this.userService.getUserAlias(),
                password: password,
              }),
              { headers }
            )
            .subscribe({
              next: (response: NewAddress) => {
                console.log(response);
                this.router.navigate(["/pages/new-batch"], {
                  queryParams: { id: response.address },
                });
                this.toastService.showToast(
                  "success",
                  "Success",
                  "New Batch ID generated: " + response.address
                );
              },
              error: (err) => {
                console.log(err);
                const errorMsg: string = err?.error?.payload?.error;
                this.toastService.showToast(
                  "danger",
                  "Error",
                  errorMsg.toUpperCase()
                );
              },
            });
        }
      });
  }

  fetchAllBatches() {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/getAllBatches",
        JSON.stringify({
          alias: this.userService.getUserAlias(),
        }),
        {
          headers,
        }
      )
      .subscribe({
        next: (response: BatchMenu[]) => {
          if (response) {
            this.source.load(response);
          }
        },
        error: (err) => {},
      });
  }
}
