import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  apiURL: any;

  constructor(
    private http: HttpClient,
    private _router: Router,
    private toastrService: ToastrService,
    private _route: ActivatedRoute,
  ) {
    this.apiURL = 'https://60d5a2c2943aa60017768b01.mockapi.io/';
  }

  apiCall(type, url, reqData?) {
    switch (type) {
      case 'GET' :
      case'get' :
        return this.http.get(this.apiURL + url)
          .pipe(map(data => data));

      case 'PUT':
      case 'put' :
        return this.http.put(this.apiURL + url, reqData)
          .pipe(map(data => data));

      case 'POST':
      case 'post' :
        return this.http.post(this.apiURL + url, reqData)
          .pipe(map(data => data));

      case 'PATCH':
      case 'patch' :
        return this.http.post(this.apiURL + url, reqData)
          .pipe(map(data => data));

      case 'DELETE':
      case 'delete' :
        return this.http.delete(this.apiURL + '/' + url)
          .pipe(map(data => data));
    }
  }

  flashMessage(type, title, message): void {
    switch (type) {
      case 'success':
      case 'Success':
        this.toastrService.success(message, title);
        break;
      case 'error':
      case 'Error':
        this.toastrService.error(message, title);
        break;
      case 'info':
      case 'Info':
        this.toastrService.info(message, title);
        break;
      case 'warning':
      case 'Warning':
        this.toastrService.warning(message, title);
        break;
    }
  }

  get router(): Router {
    return this._router;
  }


  /**
   * This method is used to redirect to specified url
   * @param url
   */
  navigateTo(url, reload?) {

    if (reload) {
      this.router.navigate([url])
        .then(() => {
          window.location.reload();
        });
    } else {
      this.router.navigate([url]);
    }

    //
  }

}


