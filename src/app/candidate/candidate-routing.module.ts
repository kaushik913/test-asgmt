import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CandidateComponent} from './candidate.component';
import {NewComponent} from "./new/new.component";
import {DetailsComponent} from "./details/details.component";
import {AuthGuardService} from '../services';
import {EditComponent} from './edit/edit.component';


const routes: Routes = [
  {
    path: '',
    component: CandidateComponent,
    children: [
      {
        path: 'candidate/new',
        component: NewComponent
      },
      {
        path: 'candidate',
        component: DetailsComponent
      },
      {
        path: 'candidate/:id',
        component: DetailsComponent
      },
      {
        path: 'candidate/edit/:id',
        component: EditComponent
      },
      {
        path: '',
        redirectTo: 'candidate'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule {
}
