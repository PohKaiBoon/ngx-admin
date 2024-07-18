import { ThemeModule } from '../../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackTraceComponent } from './track-trace.component';
import {
  NbAccordionModule,
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


@NgModule({
  declarations: [
    TrackTraceComponent
  ],
  imports: [
    NbLayoutModule,
    NbIconModule,
    NbCardModule,
    NbStepperModule,
    NbButtonModule,
    CommonModule,
    NbAlertModule,
    NbCheckboxModule,
    NbFormFieldModule,
    ThemeModule,
    NbInputModule,
    NbActionsModule,
    NbUserModule,
    NbSelectModule,
    NbSpinnerModule,
    NbAccordionModule
  ]
})
export class TrackTraceModule { }
