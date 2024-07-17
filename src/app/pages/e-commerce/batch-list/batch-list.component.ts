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
import {
  Activities,
  BatchMenu,
  Certificates,
} from "../../../@core/data/batch-model";
import { BatchListButtonComponent } from "../batch-list-button/batch-list-button.component";
import { DialogPasswordPromptComponent } from "../../modal-overlays/dialog/dialog-password-prompt/dialog-password-prompt.component";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { NewAddress } from "../../../@core/data/general-iota-model";
import { UserData } from "../../../@core/data/users";
import { ToastService } from "../../../services/toast-service/toast-service.service";
import { DateConverter } from "../../../@core/utils/date-converter";
import { DatePipe } from "@angular/common";

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
  activitySource: LocalDataSource = new LocalDataSource();
  certSource: LocalDataSource = new LocalDataSource();
  apiUrl: string = "http://localhost:3000";

  constructor(
    private themeService: NbThemeService,
    private dialogService: NbDialogService,
    private http: HttpClient,
    private router: Router,
    private userService: UserData,
    private toastService: ToastService,
    private datePipe: DatePipe
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
    this.fetchAllActivities();
    this.fetchAllCertificates();
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
            window.open(
              `http://localhost:4200/pages/details?address=${row?.address}`,
              "_blank"
            );
          });
        },
      },
    },
  };

  activitySettings = {
    actions: {
      delete: false,
      add: false,
      edit: false,
    },
    columns: {
      batchAddress: {
        title: "Batch ID",
        type: "string",
        sort: false,
      },
      message: {
        title: "Activity",
        type: "string",
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return row.activity[0].message;
        },
      },
      dateTime: {
        title: "Date Created",
        type: "string",
        sort: false,
        valuePrepareFunction: (cell, row) => {
          return row.activity[0].dateTime;
        },
      },
      type: {
        title: "Activity Type",
        type: "string",
        sort: false,
      },
    },
  };

  certSettings = {
    actions: {
      delete: false,
      add: false,
      edit: false,
    },
    columns: {
      issuedTo: {
        title: "Issued to",
        type: "string",
        sort: false,
      },
      type: {
        title: "Type",
        type: "string",
        sort: false,
      },
      dateTimeCreated: {
        title: "Date Created",
        type: "string",
        sort: false,
      },
      dateTimeExpire: {
        title: "Date Expired",
        type: "string",
        sort: false,
      },
      button: {
        title: "View Certificate",
        sort: false,
        filter: false,
        type: "custom",
        renderComponent: BatchListButtonComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe((row) => {
            window.open(
              `http://localhost:4200/pages/issue-cert?output=${row?.id}&readonly=true`,
              "_blank"
            );
          });
        },
      },
    },
  };

  openPromptPasswordDialog() {
    this.router.navigate(["/pages/new-batch"]);
  }

  openIssueCertComponent() {
    this.router.navigate(["/pages/issue-cert"]);
  }

  fetchAllBatches() {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/getAllBatches",
        JSON.stringify({
          did: this.userService.getDid(),
        }),
        {
          headers,
        }
      )
      .subscribe({
        next: (response: BatchMenu[]) => {
          if (response) {
            response.forEach((batch) => {
              batch.dateTimeCreated = this.datePipe.transform(
                batch.dateTimeCreated,
                "dd MMM yyyy, hh:mm a"
              );
              batch.dateTimeUpdated = this.datePipe.transform(
                batch.dateTimeUpdated,
                "dd MMM yyyy, hh:mm a"
              );
            });
            this.source.load(response);
          }
        },
        error: (err) => {},
      });
  }

  fetchAllActivities() {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/getAllActivities",
        JSON.stringify({
          did: this.userService.getDid(),
        }),
        {
          headers,
        }
      )
      .subscribe({
        next: (response: Activities[]) => {
          if (response) {
            response.forEach((activity) => {
              activity.activity.forEach((batch) => {
                batch.dateTime = this.datePipe.transform(
                  batch.dateTime,
                  "dd MMM yyyy, hh:mm a"
                );
              });
            });
            console.log(response);
            this.activitySource.load(response);
          }
        },
        error: (err) => {},
      });
  }

  fetchAllCertificates() {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/getAllCertificates",
        JSON.stringify({
          did: this.userService.getDid(),
        }),
        {
          headers,
        }
      )
      .subscribe({
        next: (response: Certificates[]) => {
          if (response) {
            response.forEach((certs) => {
              certs.dateTimeCreated = this.datePipe.transform(
                certs.dateTimeCreated,
                "dd MMM yyyy, hh:mm a"
              );

              certs.dateTimeUpdated = this.datePipe.transform(
                certs.dateTimeUpdated,
                "dd MMM yyyy, hh:mm a"
              );
            });
            console.log(response);
            this.certSource.load(response);
          }
        },
        error: (err) => {},
      });
  }
}
