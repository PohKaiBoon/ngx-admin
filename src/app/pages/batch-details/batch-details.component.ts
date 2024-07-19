import { QRCodeOverlayComponent } from './../e-commerce/qr-code-overlay/qr-code-overlay.component';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BatchDetails,
  HarvestDetails,
  TraceabilityInfo,
} from "../../@core/data/batch-model";
import { NbDialogService, NbWindowService } from "@nebular/theme";
import { ViewTraceabilityInfoOverlayComponent } from "../e-commerce/view-traceability-info-overlay/view-traceability-info-overlay.component";
import { VcDidPromptComponent } from "../modal-overlays/dialog/vc-did-prompt/vc-did-prompt.component";
import { ShowcaseDialogComponent } from "../modal-overlays/dialog/showcase-dialog/showcase-dialog.component";
import { OrganicCertifiedDialogComponent } from "../modal-overlays/dialog/organic-certified-dialog/organic-certified-dialog.component";
import { ToastService } from "../../services/toast-service/toast-service.service";
import { ViewProcessingInfoOverlayComponent } from "../e-commerce/view-processing-info-overlay/view-processing-info-overlay.component";

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
  apiUrl: string = "http://localhost:3000";

  firstForm: UntypedFormGroup;
  secondForm: UntypedFormGroup;
  thirdForm: UntypedFormGroup;
  address: string;
  batchDetails: BatchDetails;
  position = { lat: 1.359872, lng: 103.9499264 };
  harverstDetailsKey: string[] = [];
  qrCode: string;
  imageUrl: string =
    "https://localfoodconnect.org.au/wp-content/uploads/2017/06/aco.jpg";

  constructor(
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private windowService: NbWindowService,
    private toastService: ToastService,
    private dialogService: NbDialogService,
    private router: Router
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

    this.qrCode = window.location.href;
  }

  getHarvestDetails(): void {
    const url = `http://localhost:3000/api/v1/details`;

    let queryParams = new HttpParams();
    queryParams = queryParams.append("address", this.address);

    this.http.get<BatchDetails>(url, { params: queryParams }).subscribe(
      (data: BatchDetails) => {
        this.batchDetails = data;
        if (this.batchDetails.harvestDetails) {
          this.harverstDetailsKey = Object.keys(
            this.batchDetails.harvestDetails
          );
        }
        console.log(this.harverstDetailsKey);
      },
      (error) => {
        console.error("Error fetching harvest details", error);
        this.router.navigate(["/pages/miscellaneous/500"]);
      }
    );
  }

  openWindow() {
    this.windowService.open(ViewTraceabilityInfoOverlayComponent, {
      title: `View Full Traceability Info`,
      context: this.batchDetails,
    });
  }

  showOrganicCertButton(): boolean {
    return this.batchDetails?.traceabilityInfo?.some(
      (info) => info.type === "OrganicCertification"
    );
  }

  openInfo(info: TraceabilityInfo): void {
    console.log(info);

    switch (info?.type) {
      case "OrganicCertification":
        this.openVcVerification(info);
        break;
      case "ReceivedDelivery":
        this.openDeliveryVerification(info);
        break;
      case "ProcessingInformation":
        this.openProcessingVerification(info);
        break;
      case "ReceivedRetailer":
        this.openDeliveryVerification(info);
        break;
      default:
        this.toastService.showToast(
          "danger",
          "Error",
          "An unexpected error has occured. Please try again later.",
          5000,
          false
        );
        break;
    }
  }

  openVcVerification(info: TraceabilityInfo) {
    this.dialogService.open(VcDidPromptComponent).onClose.subscribe((did) => {
      if (did) {
        const headers = { "Content-Type": "application/json" };
        this.http
          .post(
            this.apiUrl + "/api/v1/validateDid",
            JSON.stringify({
              did: did,
            }),
            { headers }
          )
          .subscribe({
            next: (response) => {
              const headers = { "Content-Type": "application/json" };
              this.http
                .post(
                  this.apiUrl + "/api/v1/verifyCredential",
                  JSON.stringify({
                    issuerDid: did,
                    credentialJwt: info.vcString,
                  }),
                  { headers }
                )
                .subscribe({
                  next: (response) => {
                    console.log(response);
                    this.dialogService.open(OrganicCertifiedDialogComponent, {
                      context: {
                        title: "Organic Certification Verified",
                        credential: response,
                      },
                    });
                  },
                  error: (err) => {
                    console.log(err);
                    this.toastService.showToast(
                      "danger",
                      "Error",
                      "Failed to verify credential."
                    );
                  },
                });
            },
            error: (err) => {
              console.log(err);
              this.toastService.showToast(
                "danger",
                "Error",
                "Invalid DID entered."
              );
            },
          });
      }
    });
  }

  openDeliveryVerification(info: TraceabilityInfo) {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/verifyCredential",
        JSON.stringify({
          issuerDid: `did:iota:snd:${info.issuer}`,
          credentialJwt: info.vcString,
        }),
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.windowService.open(ViewTraceabilityInfoOverlayComponent, {
            title: `View Received Delivery Information`,
            context: response,
          });
        },
        error: (err) => {
          console.log(err);
          this.toastService.showToast(
            "danger",
            "Error",
            "Failed to verify credential."
          );
        },
      });
  }

  openProcessingVerification(info: TraceabilityInfo) {
    const headers = { "Content-Type": "application/json" };
    this.http
      .post(
        this.apiUrl + "/api/v1/verifyCredential",
        JSON.stringify({
          issuerDid: `did:iota:snd:${info.issuer}`,
          credentialJwt: info.vcString,
        }),
        { headers }
      )
      .subscribe({
        next: (response: any) => {
          this.windowService.open(ViewProcessingInfoOverlayComponent, {
            title: `View Processing Information`,
            context: response,
          });
        },
        error: (err) => {
          console.log(err);
          this.toastService.showToast(
            "danger",
            "Error",
            "Failed to verify credential."
          );
        },
      });
  }

  navigateToProcessorInformationPage() {
    this.router.navigate(["/pages/processor-information"], {
      queryParams: { id: this.batchDetails?.batchId },
    });
  }

  navigateToRetailerInformationPage() {
    this.router.navigate(["/pages/retailer-information"], {
      queryParams: { id: this.batchDetails?.batchId },
    });
  }

  generateQRLabels() {
    console.log(`${window.location.origin}/trackntrace?address=${this.address}`);
    this.windowService.open(QRCodeOverlayComponent, {
      title: `Generated QR for Wine Labels`,
      context: `${window.location.origin}/trackntrace?address=${this.address}`,
    });
  }
}
