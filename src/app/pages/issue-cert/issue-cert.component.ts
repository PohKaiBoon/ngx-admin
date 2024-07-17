import { Component, OnInit } from "@angular/core";
import { GeolocationService } from "../../services/geolocation-service/geolocation-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";
import { NbDialogService } from "@nebular/theme";
import { DialogPasswordPromptComponent } from "../modal-overlays/dialog/dialog-password-prompt/dialog-password-prompt.component";
import { UserData } from "../../@core/data/users";
import { OrganicCertificationCredential } from "../../@core/data/batch-model";
import { ToastService } from "../../services/toast-service/toast-service.service";

@Component({
  selector: "ngx-issue-cert",
  templateUrl: "./issue-cert.component.html",
  styleUrls: ["./issue-cert.component.scss"],
})
export class IssueCertComponent implements OnInit {
  constructor(
    private geolocationService: GeolocationService,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private dialogService: NbDialogService,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastService,
    private userService: UserData
  ) {}
  latitude: number;
  longitude: number;
  prevLatitude: number;
  prevLongitude: number;
  isLatLongSameAsPrevious: boolean = false;
  outputID: string = "";
  isReadMode: boolean = false;
  certificateForm: UntypedFormGroup;
  fetchedData: OrganicCertificationCredential;

  apiUrl: string = "http://localhost:3000";

  ngOnInit(): void {
    this.createFormControls();

    this.route.queryParams.subscribe((params) => {
      this.outputID = params["output"];
      this.isReadMode = params["readonly"] === "true";
    });

    if (this.outputID) {
      this.fetchCredential();
    }
  }

  fetchCredential() {
    const url = `http://localhost:3000/api/v1/credentialOutput`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("output", this.outputID);
    queryParams = queryParams.append("issuerDid", this.userService.getDid());

    this.http.get<any>(url, { params: queryParams }).subscribe(
      (data: OrganicCertificationCredential) => {
        this.fetchedData = data;
        this.certificateForm.patchValue({
          entityCertified: {
            name: this.fetchedData.credentialSubject.certificateDetails
              .entityCertified.name,
            address:
              this.fetchedData.credentialSubject.certificateDetails
                .entityCertified.address,
            entityDid:
              this.fetchedData.credentialSubject.certificateDetails
                .entityCertified.entityDid,
          },
          certificationStandard:
            this.fetchedData.credentialSubject.certificateDetails
              .certificationStandard,
          certificateType:
            this.fetchedData.credentialSubject.certificateDetails
              .certificateType,
          lastInspectionDate:
            this.fetchedData.credentialSubject.certificateDetails
              .lastInspectionDate,
          anniversaryDate:
            this.fetchedData.credentialSubject.certificateDetails
              .anniversaryDate,
          scope: this.fetchedData.credentialSubject.certificateDetails.scope,
          authorizedBy: {
            name: this.fetchedData.credentialSubject.certificateDetails
              .authorizedBy.name,
            title:
              this.fetchedData.credentialSubject.certificateDetails.authorizedBy
                .title,
          },
        });

        this.certificateForm.disable();
      },
      (error) => {
        this.router.navigate(["/pages/miscellaneous/500"]);
      }
    );
  }

  onBlur() {
    const entityDidValue = this.certificateForm.get(
      "entityCertified.entityDid"
    ).value;

    if (this.certificateForm.get("entityCertified.entityDid").valid) {
      const headers = { "Content-Type": "application/json" };
      this.http
        .post(
          this.apiUrl + "/api/v1/validateDid",
          JSON.stringify({
            did: entityDidValue,
          }),
          { headers }
        )
        .subscribe({
          next: (response) => {
            console.log(response);
          },
          error: (err) => {
            console.log(err);
            this.certificateForm
              .get("entityCertified.entityDid")
              .setErrors({ invalidCertifier: true });
            this.toastService.showToast(
              "danger",
              "Error",
              "Invalid DID entered."
            );
          },
        });
    }
  }

  createFormControls(): void {
    this.certificateForm = this.fb.group({
      entityCertified: this.fb.group({
        name: ["", Validators.required],
        address: ["", Validators.required],
        entityDid: [
          "",
          [
            Validators.required,
            Validators.pattern(/^did:iota:(?:[a-z0-9]{1,6}:)?0x[a-f0-9]{64}$/),
          ],
        ],
      }),
      certificationStandard: ["", Validators.required],
      certificateType: ["", Validators.required],
      lastInspectionDate: ["", Validators.required],
      anniversaryDate: ["", Validators.required],
      scope: ["", Validators.required],
      authorizedBy: this.fb.group({
        name: ["", Validators.required],
        title: ["", Validators.required],
      }),
    });
  }

  onSubmit(): void {
    const payload = {
      did: this.userService.getDid(),
      certificateDetails: this.certificateForm.value,
      password: "",
    };

    console.log(payload);
    return;

    this.dialogService
      .open(DialogPasswordPromptComponent)
      .onClose.subscribe((password) => {
        if (password) {
          payload.password = password;
          const headers = { "Content-Type": "application/json" };
          this.http
            .post(
              this.apiUrl + "/api/v1/submitBatch",
              JSON.stringify(payload),
              { headers }
            )
            .subscribe({
              next: (response) => {
                console.log(response);
                this.router.navigate(["/"]);
                this.toastService.showToast(
                  "success",
                  "Success",
                  "New Batch Added Successfully!",
                  5000
                );
              },
              error: (err) => {
                console.log(err);
                // const errorMsg: string = err?.error?.payload?.error;
                // this.toastService.showToast(
                //   "danger",
                //   "Error",
                //   errorMsg.toUpperCase()
                // );
              },
            });
        }
      });
  }
}
