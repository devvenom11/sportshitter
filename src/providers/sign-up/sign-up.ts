import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment as Details} from '../../environment';

/*
  Generated class for the SignUpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SignUpProvider {
    url = Details.URL;
    headers = new Headers({
        'Content-Type': 'application/json'
    });
    options = new RequestOptions({
        headers: this.headers
    });
    constructor(public http: Http) {

    }

    verifyEmail(signUpInfo, state) {
        let body = JSON.stringify({
            email: signUpInfo.email,
            password: signUpInfo.password,
            username: signUpInfo.username,
            phone: signUpInfo.phone,
            state: state,
            verified_user:signUpInfo.verified_user,
            location:signUpInfo.location,
            rcode:signUpInfo.rcode
        });
        return this.http.post(this.url + '/auth/signup', body, this.options)
            .map(res => res.json())
    }

    verifyActivationCode(activationCode){
        const body = { activationCode };
        return this.http.post(Details.URL+"/auth/verifyActivationCode", body)
        .map(res => res.json())
    }

    resendActivationLink(activationCode){
        const body = { activationCode };
        return this.http.post(Details.URL+"/auth/resendActivationCode", body)
        .map(res => res.json())
    }

    signupByEmail(body) {
        return this.http.post(this.url + '/auth/activesignup', body, this.options)
            .map(res => res.json())
    }
    getBlackList(){
        return this.http.get(this.url+'/admin/getblacklistlocation')
    }
}

