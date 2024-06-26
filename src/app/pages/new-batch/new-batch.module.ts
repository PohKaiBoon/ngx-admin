import { NgModule } from "@angular/core";
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbUserModule,
} from "@nebular/theme";

import { AuthPageComponent } from "../../auth/auth-page/auth-page.component";
import { NbAuthModule } from "@nebular/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsRoutingModule } from "../forms/forms-routing.module";
import { FormsModule as ngFormsModule } from "@angular/forms";
import { NewBatchComponent } from "./new-batch.component";

@NgModule({
  imports: [
    NbLayoutModule,
    NbIconModule,
    NbAuthModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    ReactiveFormsModule,
    CommonModule,
    NbAlertModule,
    NbCheckboxModule,
    NbFormFieldModule,
    ThemeModule,
    NbInputModule,
    NbActionsModule,
    NbUserModule,
    FormsRoutingModule,
    NbSelectModule,
    ngFormsModule,
    NbSpinnerModule,
    NbRadioModule,
  ],
  declarations: [NewBatchComponent],
})
export class NewBatchModule {}
