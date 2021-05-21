import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  Events,
  Navbar,
} from "ionic-angular";
import { FavouritesPage } from "./../favourites/favourites";
import { CreateContestPage } from "./../create-contest/create-contest";
import { JoinContestPage } from "./../join-contest/join-contest";
import { ContestSinglePage } from "./../contest-single/contest-single";
import { Http, Headers, RequestOptions } from "@angular/http";
import {environment as Details} from '../../environment';
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { Network } from "@ionic-native/network";
import { Global } from "../../services/Global";
import { Socket } from "ng-socket-io";

import { ChallengeHomePage } from "./../challenge-home/challenge-home";
import { FundObservable } from "../../services/fundObservable";
import { DomSanitizer } from "@angular/platform-browser";
import { HomePage } from "../home/home";

@Component({
  selector: "page-contest-main",
  templateUrl: "contest-main.html",
})
export class ContestMainPage {
  @ViewChild(Navbar) navBar: Navbar;
  fund: number = 0;
  funds: number = 0;
  loading: any;
  loadFlag = false;
  contestPrizeFraction = Details.contestPrizeFraction;
  headers = new Headers();
  optionHeader: any;
  sportsImageURL;
  newSportsImageURL;
  userID: string;
  pendingChalleges: any;
  historyChallenges;
  historyChallengesPromo;
  pendingChallegesPromo;
  sportsImageURLOtherColor: any;
  urlFlag = {
    sp: "/assets/img/flags/Group 194.svg",
    jc: "/assets/img/flags/Group 226.svg",
    cc: "/assets/img/flags/Group 228.svg",
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
    public event: Events,
    public socket: Socket,
    private network: Network,
    public global: Global,
    public fundObservable: FundObservable,
    private sanitization: DomSanitizer
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.loadFlag = this.navParams.get("load");
    this.sportsImageURL = global.sportsImageURL;
    this.newSportsImageURL = global.newSportsImageURL;
    this.sportsImageURLOtherColor = global.newSportsImageURLOtherColor;
    this.userID = JSON.parse(localStorage.getItem("loggedUser"))._id;
    if (!this.loadFlag) {
      this.loading = this.loadingCtrl.create({
        content: "Please Wait1...",
      });
      this.loading.present();
    }
    this.getHistoryChallenges(this.userID);
    this.getPendingChallenges(this.userID);

    this.newSportsImageURL["ncaab"] = "./assets/img/icons-sports/group214.svg";
    this.newSportsImageURL["sx"] = "./assets/img/icons-sports/path522.svg";
    this.newSportsImageURL["mma"] = "./assets/img/Group 231.svg";
    // this.getHistoryChallengesPromo(this.userID)
    // this.getPendingChallengesPromo(this.userID)
    // this.fund = localStorage.getItem("fund");
    // // this.fund = this.fund==null?"0":this.fund;
    // var a = parseFloat(this.fund);
    // a = Math.floor(a);
    // this.fund = this.fund == null ? "0" : a.toString();
  }

  getName(item) {
    let name =
      item.challengedetails && item.challengedetails.contestname
        ? item.challengedetails.contestname
        : "";
    if (item.challengedetails && item.challengedetails.game_id) {
      if (name !== "") {
        name += "-";
      }
      name += item.challengedetails.game_id;
    }
    return name;
  }

  ionViewDidLoad() {
    let me = this;
    this.navBar.backButtonClick = (e: UIEvent) => {
      me.navCtrl.setRoot(ChallengeHomePage);
    };
  }
  ngOnInit() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }
  ionViewWillEnter() {}

  goFavourite() {
    this.navCtrl.push(FavouritesPage, { menu: false });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goToJoinContest() {
    this.navCtrl.push(JoinContestPage);
  }

  back() {
    this.navCtrl.setRoot(ChallengeHomePage);
  }

  gosingle(item) {
    this.navCtrl.push(ContestSinglePage, {
      data: item,
      constestID: item.challenge_id,
    });
  }
  getPendingChallenges(id) {
    this.http
      .get(`${Details.URL}/contest/userpending_games/${id}`, this.optionHeader)
      .subscribe(
        (res) => {
          console.log(res);
          let data = JSON.parse(res["_body"]);
          data.forEach((element) => {
            if (element.icon) {
              element.icon = this.sanitization.bypassSecurityTrustUrl(
                element.icon
              );
            }
          });
          this.pendingChalleges = data;
          console.log(this.pendingChalleges);
        },
        (e) => {
          this.loading.dismiss();
          console.log(e);
        }
      );
  }
  public toBack() {
    this.navCtrl.setRoot(HomePage);
  }
  getHistoryChallenges(id) {
    this.http
      .get(`${Details.URL}/contest/usergame_result/${id}`, this.optionHeader)
      .subscribe(
        (res) => {
          let data = JSON.parse(res["_body"]);
          data.forEach((element) => {
            if (element.icon) {
              element.icon = this.sanitization.bypassSecurityTrustUrl(
                element.icon
              );
            }
          });
          this.historyChallenges = data;
          // commented bu Sunil it was sorting again the sorted data
          //this.historyChallenges.reverse()
          console.log(this.historyChallenges);
          console.log(this.historyChallenges.length);
          this.loading.dismiss();
        },
        (e) => {
          this.loading.dismiss();
          console.log(e);
        }
      );
  }
  getPendingChallengesPromo(id) {
    this.http
      .get(`${Details.URL}/contest/promopending_games/${id}`, this.optionHeader)
      .subscribe(
        (res) => {
          this.pendingChallegesPromo = JSON.parse(res["_body"]);
          // this.icon= this.sanitization.bypassSecurityTrustUrl('https://app.sporthitter.test123.dev/assets/img/logo.png')
          this.pendingChallegesPromo.forEach((element) => {
            if (element.icon) {
              element.icon = this.sanitization.bypassSecurityTrustUrl(
                element.icon
              );
            } else {
              element.icon = this.sportsImageURL[
                element.challengedetails.sport
              ].toUpperCase();
            }
          });
          // this.pendingChallegesPromo.icon=this.sanitization.bypassSecurityTrustUrl(this.pendingChallegesPromo.icon)
          console.log(this.pendingChallegesPromo);
        },
        (e) => {
          this.loading.dismiss();
          console.log(e);
        }
      );
  }
  getHistoryChallengesPromo(id) {
    this.http
      .get(`${Details.URL}/contest/promogame_result/${id}`, this.optionHeader)
      .subscribe(
        (res) => {
          this.historyChallengesPromo = JSON.parse(res["_body"]);
          this.historyChallengesPromo.reverse();
          console.log(this.historyChallengesPromo);
          this.historyChallengesPromo.forEach((element) => {
            if (element.icon) {
              element.icon = this.sanitization.bypassSecurityTrustUrl(
                element.icon
              );
            } else {
              element.icon = this.sportsImageURL[
                element.challengedetails.sport
              ].toUpperCase();
            }
          });
        },
        (e) => {
          console.log(e);
        }
      );
  }
  checkForPendingPicks(challengedetails) {
    let userlist = challengedetails.userlist;
    let userPosition = userlist.indexOf(this.userID);
    if (challengedetails.checkedgroup[userPosition] == "[]") {
      return true;
    } else {
      return false;
    }
  }
}
