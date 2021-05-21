import sportConfig from '../../app/sport-config';
import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  NavParams,
  LoadingController,
  Events,
  Navbar,
} from "ionic-angular";

import {
  Http,
  Headers,
  RequestOptions,
  ResponseContentType,
} from "@angular/http";

import {environment} from '../../environment';
import { FundfirstPage } from "../fundfirst/fundfirst";
import { Global } from "../../services/Global";
import { Socket } from "ng-socket-io";
import { FundObservable } from "../../services/fundObservable";
import { TabsPage } from "../tabs/tabs";
import { ChallengeLobbyPage } from "../challenge-lobby/challenge-lobby";

@Component({
  selector: "page-challenge-sport-list",
  templateUrl: "challenge-sport-list.html",
})
export class ChallengeSportListPage {
  @ViewChild(Navbar) navBar: Navbar;
  funds: number = 0;
  loading: any;
  sports = [];

  contestPrizeFraction = environment.contestPrizeFraction;
  headers = new Headers();
  optionHeader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loadingCtrl: LoadingController,
    public event: Events,
    public socket: Socket,
    public global: Global,
    public fundObservable: FundObservable
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    // this.headers.append("x-auth", localStorage.getItem("token"));
    this.headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    this.optionHeader = new RequestOptions({
      headers: this.headers,
      responseType: ResponseContentType.Json,
    });
  }

  ionViewWillEnter() {
    this.getSports();
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  getSports() {
    this.http
      .get(`${environment.baseUrl}/api/admin/getmenu`, this.optionHeader)
      .subscribe(
        (res: any) => {

          this.sports = [...res._body]
            .filter((sport) => sport.status == 1)
            .map((sport) => {
              sport.game = sport.game.toLowerCase();
              Object.assign(sport, this.sportLookup(sport.game));
              return sport;
            })
            .sort((a, b) => a.priority - b.priority);
        },
        (err) => {
          console.error(err);
        }
      );
  }

  // todo move this to static config somewhere ...
  sportLookup(sport) {
    return sportConfig[sport];
  }

  goToLobby(sport) {
    this.navCtrl.push(ChallengeLobbyPage, { sport: sport.game });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goHome() {
    this.navCtrl.push(TabsPage);
  }
}
