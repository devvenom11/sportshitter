import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import {environment as Details} from '../../environment';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { LoginProvider } from '../../providers/login/login';

@Component({
  selector: 'page-bonus-fund',
  templateUrl: 'bonus-fund.html',
})
export class BonusFundPage {
  userInfo;
  headers = new Headers();
  optionHeader: any;
  loader
  bonus;
  showBonus: boolean = false;
  fund=0;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private fundObservable: FundObservable, public global: Global, public alert: AlertController, private loginProvider: LoginProvider, private loadingCtrl: LoadingController,
  ) {
    this.userInfo = JSON.parse(localStorage.getItem('loggedUser'))
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.getBonus();
    this.fundObservable.funds.subscribe(res => {
      this.fund = res;
    }
      , e => {
        console.log(e)
      })
  }
  getBonus() {
    this.http.post(Details.URL + "/auth/getbonus", { 'userid': this.userInfo._id }, this.optionHeader).subscribe(
      res => {
        this.bonus = JSON.parse(res['_body']);
        this.bonus.forEach(element => {
          if (element.redeemed) {
            this.showBonus = true;
          }
        });
        console.log(this.bonus)
      },
      e => {
        console.log(e)
      }
    )
  }
  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    this.loader.present();
  }

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }
}
