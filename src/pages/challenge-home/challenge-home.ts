import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Events,
  ToastController,
} from "ionic-angular";
import { Http, RequestOptions, Headers } from "@angular/http";

import { Global } from "../../services/Global";
import { JoinContestPage } from "./../join-contest/join-contest";
import { ContestMainPage } from "./../contest-main/contest-main";
import { ContestSinglePage } from "./../contest-single/contest-single";
import { FavouritesPage } from "./../favourites/favourites";
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { FundObservable } from "../../services/fundObservable";
import { PromoHomePage } from "../promo-home/promo-home";
import { ChallengePicksPage } from "../challenge-picks/challenge-picks";

@Component({
  selector: "page-challenge-home",
  templateUrl: "challenge-home.html",
})
export class ChallengeHomePage {
  funds: number = 0;
  headers = new Headers();
  optionHeader: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public http: Http,
    public toast: ToastController,
    public global: Global,
    public fundObservable: FundObservable
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    if (global.notifiData) {
      var data = JSON.parse(JSON.stringify(global.notifiData));
      global.notifiData = null;
      this.navCtrl.push(ContestSinglePage, {
        constestID: data._id,
      });
      return;
    }
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChallengeHomePage');
  }

  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }
  goToChallengeHistory() {
    this.navCtrl.push(ContestMainPage);
  }

  goToCreateContest() {
    this.navCtrl.push(JoinContestPage, { create: "cc" });
  }

  gotoChooseSport(directflag) {
    this.navCtrl.setRoot(ChallengePicksPage, {
      create: "jc",
      inviteFlag: directflag,
    });
  }

  goFavourite() {
    this.navCtrl.push(FavouritesPage, { menu: false });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goToSpecialPromo() {
    this.navCtrl.push(PromoHomePage);
  }
}
