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
  NbMenuModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepComponent,
  NbStepperModule,
  NbUserModule,
} from "@nebular/theme";

import { AuthPageComponent } from "./auth-page.component";
import { NbAuthModule } from "@nebular/auth";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ThemeModule } from "../../@theme/theme.module";
import { FormsRoutingModule } from "../../pages/forms/forms-routing.module";
import { FormsModule as ngFormsModule } from "@angular/forms";

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
  ],
  declarations: [AuthPageComponent],
})
export class AuthModule {}
