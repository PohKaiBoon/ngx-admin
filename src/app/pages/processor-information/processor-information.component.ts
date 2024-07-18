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
import { distinctUntilChanged } from "rxjs/operators";
import { ToastService } from "../../services/toast-service/toast-service.service";
import { BatchDetails } from "../../@core/data/batch-model";

@Component({
  selector: "ngx-processor-information",
  templateUrl: "./processor-information.component.html",
  styleUrls: ["./processor-information.component.scss"],
})
export class ProcessorInformationComponent implements OnInit {
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
  newId: string = "";
  processorInfo: UntypedFormGroup;
  wineProductionForm: UntypedFormGroup;
  receivedDeliveryForm: UntypedFormGroup;
  remarks: UntypedFormGroup;

  initial: boolean = false;
  shouldShowNextSection: boolean = false;
  shouldShowReceivedDeliveryForm: boolean = false;

  typeObjects: { type: string; text: string }[] = [
    { type: "ReceivedDelivery", text: "Received Delivery" },
    { type: "ProcessingInformation", text: "Processing Information" },
  ];

  apiUrl: string = "http://localhost:3000";

  ngOnInit(): void {
    this.getUserLocation();
    this.route.queryParams.subscribe((params) => {
      this.newId = params["id"];
    });

    this.createFormControls();
    this.createSubscriptions();
    this.getDetails();
  }

  createSubscriptions(): void {
    this.processorInfo.controls.type.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((value) => {
        if (value && !this.shouldShowNextSection) {
          this.shouldShowNextSection = true;
        }
        if (value === "ReceivedDelivery") {
          this.shouldShowReceivedDeliveryForm = true;
        } else {
          this.shouldShowReceivedDeliveryForm = false;
        }
      });
  }

  getUserLocation(): void {
    this.geolocationService
      .getCurrentLocation()
      .then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);

        this.processorInfo.controls.latitude.patchValue(this.latitude);
        this.processorInfo.controls.longitude.patchValue(this.longitude);

        this.prevLatitude = this.latitude;
        this.prevLongitude = this.longitude;

        if (
          this.prevLatitude === this.latitude &&
          this.prevLongitude === this.longitude &&
          this.initial
        ) {
          this.isLatLongSameAsPrevious = true;
        } else {
          this.isLatLongSameAsPrevious = false;
        }
        this.initial = true;
      })
      .catch((error) => {
        console.error("Error getting location:", error);
      });
  }

  createFormControls(): void {
    this.processorInfo = this.fb.group({
      processorName: ["", Validators.required],
      processorAddress: ["", Validators.required],
      nameInCharge: ["", Validators.required],
      nameInChargeContact: ["", Validators.required],
      latitude: [{ value: "", disabled: true }],
      longitude: [{ value: "", disabled: true }],
      type: ["", Validators.required],
    });

    this.receivedDeliveryForm = this.fb.group({
      quantityReceived: ["", Validators.required],
      condition: ["", Validators.required],
      temperatureUponArrival: ["", Validators.required],
      truckId: ["", Validators.required],
      driverName: ["", Validators.required],
      licensePlate: ["", Validators.required],
    });

    this.wineProductionForm = this.fb.group({
      crushGrapes: this.fb.group({
        dateCrushed: ["", Validators.required],
        method: ["", Validators.required],
        remarks: ["", Validators.required],
      }),
      fermentation: this.fb.group({
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        temperatureRange: ["", Validators.required],
        sugarLevel: ["", Validators.required],
        yeastType: ["", Validators.required],
        carbonDioxideManagement: ["", Validators.required],
        remarks: ["", Validators.required],
      }),
      aging: this.fb.group({
        startDate: ["", Validators.required],
        endDate: ["", Validators.required],
        containerType: ["", Validators.required],
        temperatureRange: ["", Validators.required],
        humidityLevel: ["", Validators.required],
        remarks: ["", Validators.required],
      }),
    });

    this.remarks = this.fb.group({
      remarks: ["", Validators.required],
    });
  }

  onSubmit(): void {
    let formData: any = {
      processorInfo: this.processorInfo.getRawValue(),
      remarks: this.remarks.value,
    };

    if (this.processorInfo.get("type").value === "ProcessingInformation") {
      formData = {
        ...formData,
        wineProductionForm: this.wineProductionForm.value,
      };
    } else {
      formData = {
        ...formData,
        receivedDeliveryForm: this.receivedDeliveryForm.value,
      };
    }

    const payload = {
      issuerDid: this.userService.getDid(),
      processorDetails: formData,
      batchAddress: this.newId,
      password: "",
    };

    this.dialogService
      .open(DialogPasswordPromptComponent)
      .onClose.subscribe((password) => {
        if (password) {
          payload.password = password;
          const headers = { "Content-Type": "application/json" };
          this.http
            .post(
              this.apiUrl + "/api/v1/processorTraceabilityInfo",
              JSON.stringify(payload),
              { headers }
            )
            .subscribe({
              next: (response) => {
                console.log(response);
                this.router.navigate(["/pages/details"], {
                  queryParams: { address: this.newId },
                });
                this.toastService.showToast(
                  "success",
                  "Success",
                  `Batch ${this.newId}  Updated Successfully!`,
                  5000
                );
              },
              error: (err) => {
                console.log(err);
                const errorMsg: string = err?.error?.payload?.error;
                this.toastService.showToast(
                  "danger",
                  "Error",
                  "Unexpected error has occured. Please try again later"
                );
              },
            });
        }
      });
  }

  clearForm(): void {
    this.processorInfo.reset();
    this.receivedDeliveryForm.reset();
    this.wineProductionForm.reset();
    this.remarks.reset();
  }

  getDetails(): void {
    const url = `http://localhost:3000/api/v1/details`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("address", this.newId);

    this.http.get<BatchDetails>(url, { params: queryParams }).subscribe(
      (data: BatchDetails) => {
        if (data.traceabilityInfo.length > 0) {
          let vc = data.traceabilityInfo[0].vcString;
          let issuer = data.traceabilityInfo[0].issuer;
          const headers = { "Content-Type": "application/json" };
          this.http
            .post(
              this.apiUrl + "/api/v1/verifyCredential",
              JSON.stringify({
                issuerDid: `did:iota:snd:${issuer}`,
                credentialJwt: vc,
              }),
              { headers }
            )
            .subscribe({
              next: (response: any) => {
                console.log(response);
                if (response?.credentialSubject?.processorInfo) {
                  this.processorInfo.patchValue(
                    response.credentialSubject.processorInfo
                  );
                  this.processorInfo
                    .get("type")
                    .patchValue("ProcessingInformation");
                }
              },
              error: (err) => {
                console.log(err);
              },
            });
        }
      },
      (error) => {
        console.error("Error fetching harvest details", error);
        this.router.navigate(["/pages/miscellaneous/500"]);
      }
    );
  }
}
