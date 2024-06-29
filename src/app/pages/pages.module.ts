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
import { BatchDetailsComponent } from "./batch-details/batch-details.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NbAuthModule } from "@nebular/auth";
import { NewBatchComponent } from "./new-batch/new-batch.component";
import { NewBatchModule } from "./new-batch/new-batch.module";
import { GoogleMapsModule } from "@angular/google-maps";
import { CapitalisePipe } from "../@core/pipe/capitalise.pipe";

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
    GoogleMapsModule,
    NbAccordionModule,
  ],
  declarations: [PagesComponent],
})
export class PagesModule {}
