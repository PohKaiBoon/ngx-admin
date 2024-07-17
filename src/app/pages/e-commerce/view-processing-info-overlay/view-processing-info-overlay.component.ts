import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { BatchDetails } from "../../../@core/data/batch-model";

@Component({
  selector: "ngx-view-processing-info-overlay",
  templateUrl: "./view-processing-info-overlay.component.html",
  styleUrls: ["./view-processing-info-overlay.component.scss"],
})
export class ViewProcessingInfoOverlayComponent implements OnInit {
  constructor(protected windowRef: NbWindowRef) {}

  batchDetails: any;
  batchDetailKeys: string[] = [];

  ngOnInit(): void {
    this.batchDetails = this.windowRef.config.context; // Access the passed data here
    this.batchDetails = this.batchDetails.credentialSubject;
    if (this.batchDetails.credentialSubject) {
      this.batchDetailKeys = Object.keys(
        this.batchDetails.credentialSubject
      ).filter((key) => key !== "dateTimeSubmitted");
    }

    console.log(this.batchDetailKeys);
  }

  minimize() {
    this.windowRef.minimize();
  }

  close() {
    this.windowRef.close();
  }
}
