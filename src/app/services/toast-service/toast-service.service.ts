import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Account } from "../../@core/data/general-iota-model";
import { UserData } from "../../@core/data/users";
import {
  NbToastrService,
  NbToastrConfig,
  NbGlobalPosition,
  NbGlobalPhysicalPosition,
  NbComponentStatus,
  NbGlobalLogicalPosition,
} from "@nebular/theme";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private toastrService: NbToastrService) {}

  config: NbToastrConfig;

  destroyByClick = true;
  duration = 3000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = "primary";

  title = "HI there!";
  content = `I'm cool toaster!`;

  types: NbComponentStatus[] = [
    "primary",
    "success",
    "info",
    "warning",
    "danger",
  ];
  positions: string[] = [
    NbGlobalPhysicalPosition.TOP_RIGHT,
    NbGlobalPhysicalPosition.TOP_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_LEFT,
    NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    NbGlobalLogicalPosition.TOP_END,
    NbGlobalLogicalPosition.TOP_START,
    NbGlobalLogicalPosition.BOTTOM_END,
    NbGlobalLogicalPosition.BOTTOM_START,
  ];

  quotes = [
    { title: null, body: "We rock at Angular" },
    { title: null, body: "Titles are not always needed" },
    { title: null, body: "Toastr rock!" },
  ];

  makeToast() {
    this.showToast(this.status, this.title, this.content);
  }

  showToast(type: NbComponentStatus, title: string, body: string, duration? : number) {
    const config = {
      status: type,
      destroyByClick: this.destroyByClick,
      duration: duration ?? this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };

    this.toastrService.show(body, title, config);
  }
}
