import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HarvestDetails } from "../../@core/data/batch-model";
import { NbWindowService } from "@nebular/theme";
import { ViewTraceabilityInfoOverlayComponent } from "../e-commerce/view-traceability-info-overlay/view-traceability-info-overlay.component";

@Component({
  selector: "ngx-batch-details",
  templateUrl: "./batch-details.component.html",
  styleUrls: ["./batch-details.component.scss"],
})
export class BatchDetailsComponent implements OnInit {
  @ViewChild("contentTemplate", { static: true })
  contentTemplate: TemplateRef<any>;
  @ViewChild("disabledEsc", { read: TemplateRef, static: true })
  disabledEscTemplate: TemplateRef<HTMLElement>;

  firstForm: UntypedFormGroup;
  secondForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  address: string;
  harvestDetails: HarvestDetails;
  position = { lat: 1.359872, lng: 103.9499264 };
  batchDetailKeys: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private windowService: NbWindowService
  ) {}

  ngOnInit() {
    this.firstForm = this.fb.group({
      firstCtrl: ["", Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ["", Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ["", Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      this.address = params?.address;
    });

    this.getHarvestDetails();
  }

  getHarvestDetails(): void {
    const url = `http://localhost:3000/api/v1/details`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("address", this.address);

    this.http.get<HarvestDetails>(url, { params: queryParams }).subscribe(
      (data: HarvestDetails) => {
        this.harvestDetails = data;
        console.log(this.harvestDetails);
        if (this.harvestDetails.batchDetails) {
          this.batchDetailKeys = Object.keys(this.harvestDetails.batchDetails);
        }
        console.log(this.batchDetailKeys);
      },
      (error) => {
        console.error("Error fetching harvest details", error);
      }
    );
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  openWindow() {
    this.windowService.open(ViewTraceabilityInfoOverlayComponent, {
      title: `View Full Traceability Info`,
      context: this.harvestDetails,
    });
  }
}
