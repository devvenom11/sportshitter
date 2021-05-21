import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment as Details} from '../../environment';

/*
  Generated class for the LoginProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoginProvider {
    url = Details.URL;
    headers = new Headers({
        'Content-Type': 'application/json'
    });
    options = new RequestOptions({
        headers: this.headers
    });
    constructor(public http: Http) {

    }

    loginByEmail(loginInfo) {
        let body = JSON.stringify({
            password: loginInfo.password,
            username: loginInfo.username,
            playerid: loginInfo.playerid
        });
        return this.http.post(this.url + '/auth/login', body, this.options)
            .map(res => res.json())
    }
    updateFirstLogin(email,username){
        let body = JSON.stringify({
            email: email
        });
        return this.http.post(this.url + '/auth/firstLoginDone', body, this.options)
            .map(res => res.json())
    }

    loginBySocialAccount(data) {
        let body = JSON.stringify(data);
        return this.http.post(this.url + '/auth/login', body, this.options)
            .map(res => {return res.json()})
    }

    forgotPassword(email, pwd, username){
        let body = JSON.stringify({
            email: email,
            pwd: pwd,
            username: username
        });
        return this.http.post(this.url + '/auth/change-password', body, this.options)
            .map(res => res.json())
    }

    logger(message){
      let body = {message};
      return this.http.post(this.url + '/logger', body, this.options)
        .map(res => res.json())
    }
}
