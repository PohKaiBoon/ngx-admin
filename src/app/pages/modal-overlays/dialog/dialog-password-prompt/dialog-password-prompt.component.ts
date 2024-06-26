import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-password-prompt',
  templateUrl: 'dialog-password-prompt.component.html',
  styleUrls: ['dialog-password-prompt.component.scss'],
})
export class DialogPasswordPromptComponent {

  constructor(protected ref: NbDialogRef<DialogPasswordPromptComponent>) {}

  cancel() {
    this.ref.close();
  }

  submit(name) {
    this.ref.close(name);
  }
}
