import {Component, OnInit} from '@angular/core';
import {CommonService} from '../services';
import {ActivatedRoute} from '@angular/router';
import {SocialAuthService, SocialUser} from 'angularx-social-login';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.css']
})
export class CandidateComponent implements OnInit {

  candidates: any = [];

  user: SocialUser;
  loggedIn: boolean;
  isLoading: boolean;

  constructor(private _commonService: CommonService,
              private _route: ActivatedRoute,
              public socialAuthServive: SocialAuthService) {
  }


  ngOnInit() {
    // let id = this._route.snapshot.paramMap.get("id");
    // console.log(id)
    this._route.params.subscribe((params = {}) => {
      this.getCandidates();

      this.socialAuthServive.authState.subscribe((user) => {
        this.user = user;
        this.loggedIn = (user != null);
      });
    });


  }

  getCandidates() {
    this.isLoading = true;
    this._commonService.apiCall('get', 'candidate').subscribe(response => {
      this.candidates = response;
      this.isLoading = false;
    }, error => {
      this.isLoading = false;
    });
  }

  goToURL(url) {
    this._commonService.navigateTo(url);
  }

  logout(): void {
    this.socialAuthServive.signOut().then(() => this._commonService.navigateTo('login'));
  }

}
