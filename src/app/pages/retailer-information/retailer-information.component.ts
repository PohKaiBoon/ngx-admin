import { Component, OnInit } from "@angular/core";
import { GeolocationService } from "../../services/geolocation-service/geolocation-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { NbDialogService } from "@nebular/theme";
import { DialogPasswordPromptComponent } from "../modal-overlays/dialog/dialog-password-prompt/dialog-password-prompt.component";
import { UserData } from "../../@core/data/users";
import { distinctUntilChanged } from "rxjs/operators";
import { ToastService } from "../../services/toast-service/toast-service.service";

@Component({
  selector: "ngx-retailer-information",
  templateUrl: "./retailer-information.component.html",
  styleUrls: ["./retailer-information.component.scss"],
})
export class RetailerInformationComponent implements OnInit {
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
  retailerDetailsForm: UntypedFormGroup;
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
  }


  getUserLocation(): void {
    this.geolocationService
      .getCurrentLocation()
      .then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);

        this.retailerDetailsForm
          .get("retailerInfo.latitude")
          .patchValue(this.latitude);
        this.retailerDetailsForm
          .get("retailerInfo.longitude")
          .patchValue(this.longitude);

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
    this.retailerDetailsForm = this.fb.group({
      retailerInfo: this.fb.group({
        retailerName: ["", Validators.required],
        retailerAddress: ["", Validators.required],
        nameInCharge: ["", Validators.required],
        nameInChargeContact: ["", Validators.required],
        latitude: [{ value: "", disabled: true }],
        longitude: [{ value: "", disabled: true }],
      }),
      receivedBatchInfo: this.fb.group({
        dateReceived: ["", Validators.required],
        quantityReceived: ["", Validators.required],
      }),
      storageConditions: this.fb.group({
        temperature: ["", Validators.required],
        humidity: ["", Validators.required],
        location: ["", Validators.required],
        storageType: ["", Validators.required],
      }),
      remarks: this.fb.group({
        remarks: ["", Validators.required],
      }),
    });
  }

  onSubmit(): void {
    const payload = {
      issuerDid: this.userService.getDid(),
      retailerDetails: this.retailerDetailsForm.getRawValue(),
      batchAddress: this.newId,
      password: "",
      type: "ReceivedRetailer"
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
              this.apiUrl + "/api/v1/processorTraceabilityInfo",
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

  clearForm(): void {
    this.retailerDetailsForm.reset();
  }
}
