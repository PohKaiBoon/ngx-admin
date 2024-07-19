import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { BatchDetails } from "../../../@core/data/batch-model";

@Component({
  selector: "ngx-qr-code-overlay",
  templateUrl: "./qr-code-overlay.component.html",
  styleUrls: ["./qr-code-overlay.component.scss"],
})
export class QRCodeOverlayComponent implements OnInit {
  constructor(protected windowRef: NbWindowRef) {}

  qrCode: any;
  batchDetailKeys: string[] = [];

  ngOnInit(): void {
    this.qrCode = this.windowRef.config.context; // Access the passed data here
    console.log(this.qrCode)
  }

  minimize() {
    this.windowRef.minimize();
  }

  close() {
    this.windowRef.close();
  }
}
