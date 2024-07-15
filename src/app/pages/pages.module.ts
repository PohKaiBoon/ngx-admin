import { NgModule } from "@angular/core";
import {
  NbAccordionModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbStepperModule,
} from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { DashboardModule } from "./dashboard/dashboard.module";
import { ECommerceModule } from "./e-commerce/e-commerce.module";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NbAuthModule } from "@nebular/auth";
import { NewBatchModule } from "./new-batch/new-batch.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { IssueCertModule } from "./issue-cert/issue-cert.module";

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
    NewBatchModule,
    IssueCertModule,
    GoogleMapsModule,
    NbAccordionModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
