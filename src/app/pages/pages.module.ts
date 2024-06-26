import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbMenuModule, NbStepperModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NbAuthModule } from '@nebular/auth';
import { NewBatchComponent } from './new-batch/new-batch.component';
import { NewBatchModule } from './new-batch/new-batch.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    NbStepperModule,
    ReactiveFormsModule,
    NbCardModule,
    NbButtonModule,
    NbLayoutModule,
    NbIconModule,
    NbAuthModule,
    NewBatchModule
  ],
  declarations: [
    PagesComponent,
    CustomerOrderComponent,
  ],
})
export class PagesModule {
}
