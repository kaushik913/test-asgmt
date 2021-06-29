import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CandidateRoutingModule} from './candidate-routing.module';
import {CandidateComponent} from './candidate.component';
import {NewComponent} from './new/new.component';
import {DetailsComponent} from './details/details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxContentLoadingModule} from 'ngx-content-loading';
import {ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {EditComponent} from './edit/edit.component';
import {DpDatePickerModule} from 'ng2-date-picker';


@NgModule({
  declarations: [CandidateComponent, NewComponent, DetailsComponent, EditComponent],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    NgbModule,
    NgxContentLoadingModule,
    ReactiveFormsModule,
    NgSelectModule,
    DpDatePickerModule
  ]
})
export class CandidateModule {
}
