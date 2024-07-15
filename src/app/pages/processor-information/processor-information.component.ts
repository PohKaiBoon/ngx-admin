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
import { ToastService } from "../../services/toast-service/toast-service.service";
import { DialogPasswordPromptComponent } from "../modal-overlays/dialog/dialog-password-prompt/dialog-password-prompt.component";
import { UserData } from "../../@core/data/users";
import { distinctUntilChanged } from "rxjs/operators";

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
      processorName: [""],
      processorAddress: ["", Validators.required],
      nameInCharge: [""],
      nameInChargeContact: [""],
      latitude: [{ value: "", disabled: true }],
      longitude: [{ value: "", disabled: true }],
      type: [""],
    });

    this.receivedDeliveryForm = this.fb.group({
      dateReceived: ["", Validators.required],
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
  }

  onSubmit(): void {
    const formData = {
      processorInfo: this.processorInfo.getRawValue(),
      receivedDeliveryForm: this.receivedDeliveryForm.value,
      remarks: this.remarks.value,
      dateTimeSubmitted: new Date().toISOString(),
    };

    const payload = {
      issuerDid: this.userService.getDid(),
      processorDetails: formData,
      batchAddress: this.newId,
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
}
