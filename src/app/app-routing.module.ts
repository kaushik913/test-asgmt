import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {
    path: '',

    loadChildren: () => import('./candidate/candidate.module').then(m => m.CandidateModule),
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
