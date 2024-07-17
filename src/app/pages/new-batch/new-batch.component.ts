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
import { ToastService } from "../../services/toast-service/toast-service.service";

@Component({
  selector: "ngx-new-batch",
  templateUrl: "./new-batch.component.html",
  styleUrls: ["./new-batch.component.scss"],
})
export class NewBatchComponent implements OnInit {
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
  farmInfo: UntypedFormGroup;
  cultivationPractices: UntypedFormGroup;
  vineyardDetails: UntypedFormGroup;
  postHarvestHandling: UntypedFormGroup;
  environmentalConditions: UntypedFormGroup;
  harvestInfo: UntypedFormGroup;
  remarks: UntypedFormGroup;
  initial: boolean = false;

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

        this.farmInfo.controls.latitude.patchValue(this.latitude);
        this.farmInfo.controls.longitude.patchValue(this.longitude);

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
    this.farmInfo = this.fb.group({
      farmName: ["", Validators.required],
      farmAddress: ["", Validators.required],
      farmerName: ["", Validators.required],
      farmerContact: ["", Validators.required],
      latitude: [{ value: "", disabled: true }],
      longitude: [{ value: "", disabled: true }],
    });

    this.vineyardDetails = this.fb.group({
      vineyardId: ["", Validators.required],
      grapeVariety: ["", Validators.required],
      plantingDate: ["", Validators.required],
      soilType: ["", Validators.required],
    });

    this.cultivationPractices = this.fb.group({
      irrigation: ["", Validators.required],
      fertilizationType: ["", Validators.required],
      fertilizationQuantity: ["", Validators.required],
      fertilizationDate: ["", Validators.required],
      pesticide: ["", Validators.required],
      pesticideApplicationDate: ["", Validators.required],
      compliance: ["", Validators.required],
      pruning: ["", Validators.required],
    });

    this.environmentalConditions = this.fb.group({
      weatherDate: ["", Validators.required],
      temperature: ["", Validators.required],
      rainfall: ["", Validators.required],
      humidity: ["", Validators.required],
    });

    this.harvestInfo = this.fb.group({
      harvestDate: ["", Validators.required],
      harvestMethod: ["", Validators.required],
      laborDetails: ["", Validators.required],
      yield: ["", Validators.required],
    });

    this.postHarvestHandling = this.fb.group({
      remarks: ["", Validators.required],
    });

    this.remarks = this.fb.group({
      remarks: ["", Validators.required],
    });
  }

  onSubmit(): void {
    if (
      this.farmInfo.invalid ||
      this.vineyardDetails.invalid ||
      this.cultivationPractices.invalid ||
      this.environmentalConditions.invalid ||
      this.harvestInfo.invalid ||
      this.postHarvestHandling.invalid ||
      this.remarks.invalid
    ) {
      this.farmInfo.markAllAsTouched();
      this.vineyardDetails.markAllAsTouched();
      this.cultivationPractices.markAllAsTouched();
      this.environmentalConditions.markAllAsTouched();
      this.harvestInfo.markAllAsTouched();
      this.postHarvestHandling.markAllAsTouched();
      this.remarks.markAllAsTouched();
      return;
    }

    const formData = {
      farmInfo: this.farmInfo.getRawValue(),
      vineyardDetails: this.vineyardDetails.value,
      cultivationPractices: this.cultivationPractices.value,
      environmentalConditions: this.environmentalConditions.value,
      harvestInfo: this.harvestInfo.value,
      postHarvestHandling: this.postHarvestHandling.value,
      remarks: this.remarks.value,
      dateTimeSubmitted: new Date().toISOString(),
    };

    const payload = {
      did: this.userService.getDid(),
      harvestDetails: formData,
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

  clearForm(): void {
    this.farmInfo.reset();
    this.vineyardDetails.reset();
    this.cultivationPractices.reset();
    this.environmentalConditions.reset();
    this.harvestInfo.reset();
    this.postHarvestHandling.reset();
    this.remarks.reset();
  }
}
