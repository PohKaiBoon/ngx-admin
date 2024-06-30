import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { MiscellaneousComponent } from "./miscellaneous.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { FullPageErrorComponent } from "./full-page-error/full-page-error.component";

const routes: Routes = [
  {
    path: "",
    component: MiscellaneousComponent,
    children: [
      {
        path: "404",
        component: NotFoundComponent,
      },
      {
        path: "500",
        component: FullPageErrorComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MiscellaneousRoutingModule {}
