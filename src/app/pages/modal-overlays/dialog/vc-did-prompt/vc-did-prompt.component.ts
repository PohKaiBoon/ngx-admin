import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-vc-did-prompt',
  templateUrl: 'vc-did-prompt.component.html',
  styleUrls: ['vc-did-prompt.component.scss'],
})
export class VcDidPromptComponent {

  constructor(protected ref: NbDialogRef<VcDidPromptComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
