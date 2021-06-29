import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import {CommonService} from '../services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router,
              private _commonService:CommonService,
              private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    console.log('this.socialAuthService.authState', )
    if(this.socialAuthService.authState)
      this._commonService.navigateTo('')
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => this.router.navigate(['']));
  }

}
