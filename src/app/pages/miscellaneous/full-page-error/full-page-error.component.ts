import { Component } from '@angular/core';
import { NbMenuService } from '@nebular/theme';

@Component({
  selector: 'ngx-full-page-error',
  templateUrl: './full-page-error.component.html',
  styleUrls: ['./full-page-error.component.scss']
})
export class FullPageErrorComponent {

  constructor(private menuService: NbMenuService) {
  }

  goToHome() {
    this.menuService.navigateHome();
  }
}
