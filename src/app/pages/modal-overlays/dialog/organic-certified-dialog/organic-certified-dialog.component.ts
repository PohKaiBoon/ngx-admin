import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-organic-certified-dialog',
  templateUrl: 'organic-certified-dialog.component.html',
  styleUrls: ['organic-certified-dialog.component.scss'],
})
export class OrganicCertifiedDialogComponent {

  @Input() title: string;
  @Input() credential: any;

  constructor(protected ref: NbDialogRef<OrganicCertifiedDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
