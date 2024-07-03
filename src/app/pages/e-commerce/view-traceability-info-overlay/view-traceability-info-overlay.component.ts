import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { HarvestDetails } from "../../../@core/data/batch-model";

@Component({
  selector: "ngx-view-traceability-info-overlay",
  templateUrl: "./view-traceability-info-overlay.component.html",
  styleUrls: ["./view-traceability-info-overlay.component.scss"],
})
export class ViewTraceabilityInfoOverlayComponent implements OnInit {
  constructor(protected windowRef: NbWindowRef) {}

  harvestDetails: HarvestDetails;
  position = { lat: 1.359872, lng: 103.9499264 };
  batchDetailKeys: string[] = [];

  ngOnInit(): void {
    this.harvestDetails = this.windowRef.config.context; // Access the passed data here
    if (this.harvestDetails) {
      this.batchDetailKeys = Object.keys(this.harvestDetails.batchDetails);
    }
  }

  minimize() {
    this.windowRef.minimize();
  }

  close() {
    this.windowRef.close();
  }
}
