import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../services';
import {ActivatedRoute} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  candidate: any;
  isLoading: boolean;
  selected: boolean = true;

  constructor(private _commonService: CommonService,
              private modalService: NgbModal,
              private _route: ActivatedRoute,) {
  }


  ngOnInit() {

    this._route.params.subscribe((params = {}) => {
      let id = this._route.snapshot.paramMap.get('id');

      if (id != null) {
        this.getCandidateDetails(id);
      } else {
        this.selected = false;
      }
    });


  }

  getCandidateDetails(id) {
    this.isLoading = true;
    this._commonService.apiCall('get', 'candidate/' + id).subscribe(response => {
      this.candidate = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  openConfirmDelete(content) {

    this.modalService.open(content, {
      windowClass: 'myCustomModalClass',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static',
      keyboard: false,
      centered: true
    }).result.then((result) => {
      if (result == 'YES') {
        this.deleteCandidate();
        return;
      }
      if (result == 'CANCEL') {
        return;
      }
    }, (reason) => {
    });
  }

  deleteCandidate() {
    let id = this._route.snapshot.paramMap.get('id');
    this.isLoading = true;
    this._commonService.apiCall('delete', 'candidate/' + id).subscribe(response => {
      this._commonService.flashMessage('success', '', 'User successfully deleted');
      this._commonService.navigateTo('', true);
      this.isLoading = true;
    });
  }

  goToURL(url) {
    this._commonService.navigateTo(url);
  }

}
