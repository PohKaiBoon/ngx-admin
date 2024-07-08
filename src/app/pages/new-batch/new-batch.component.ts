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
      farmName: [""],
      farmAddress: ["", Validators.required],
      farmerName: [""],
      farmerContact: [""],
      latitude: [{ value: "", disabled: true }],
      longitude: [{ value: "", disabled: true }],
    });

    this.vineyardDetails = this.fb.group({
      vineyardId: [""],
      grapeVariety: [""],
      plantingDate: [""],
      soilType: [""],
    });

    this.cultivationPractices = this.fb.group({
      irrigation: [""],
      fertilizationType: [""],
      fertilizationQuantity: [""],
      fertilizationDate: [""],
      pesticide: [""],
      pesticideApplicationDate: [""],
      compliance: [""],
      pruning: [""],
    });

    this.environmentalConditions = this.fb.group({
      weatherDate: [""],
      temperature: [""],
      rainfall: [""],
      humidity: [""],
    });

    this.harvestInfo = this.fb.group({
      harvestDate: [""],
      harvestMethod: [""],
      laborDetails: [""],
      yield: [""],
    });

    this.postHarvestHandling = this.fb.group({
      remarks: [""],
    });

    this.remarks = this.fb.group({
      remarks: [""],
    });
  }

  onSubmit(): void {
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
      address: this.newId,
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
}
