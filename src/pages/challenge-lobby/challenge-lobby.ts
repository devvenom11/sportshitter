import sportConfig from "../../app/sport-config";
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

import { environment } from '../../environment';
import { FundfirstPage } from "../fundfirst/fundfirst";
import { ContestSelectPage } from "../contest-select/contest-select";
import { Global } from "../../services/Global";
import { Socket } from "ng-socket-io";
import { FundObservable } from "../../services/fundObservable";
import { ChallengeSportListPage } from "../challenge-sport-list/challenge-sport-list";
import { JoinTournamentPage } from "../join-tournament/join-tournament";
import moment from "moment-timezone";
import { UpperCasePipe } from "@angular/common";
import { analyzeAndValidateNgModules } from "@angular/compiler";

@Component({
  selector: "page-challenge-lobby",
  templateUrl: "challenge-lobby.html",
})
export class ChallengeLobbyPage {
  @ViewChild(Navbar) navBar: Navbar;
  funds: number = 0;
  loading: any;
  gameType = "freePlay";
  challenges = [];
  selectedSportKey: String;
  selectedSport: any;
  headers = new Headers();
  optionHeader: any;
  showpopup: boolean = false;
  msg: string;
  header: string;
  needGoBack: boolean = false;
  lightSelectedSport: any;

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
    this.selectedSportKey = this.navParams.get("sport");
    this.selectedSport = sportConfig[this.selectedSportKey];
    this.lightSelectedSport = sportConfig['light_'+this.selectedSportKey];
    this.getChallengesBySport();
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  getChallengesBySport() {
    this.http
      .get(
        `${environment.baseUrl}/v2/challenge/${this.selectedSportKey}/options?freeplay=${(this.gameType == 'freePlay')}`,
        this.optionHeader
      )
      .subscribe(
        (res: any) => {
          this.challenges = [...res._body].map((c) => {
            c.title = this.getChallengeName(c);
            c.created_at = moment.tz(c.created_at,'America/New_York').format('MM/DD hh:mm A');
            return c;
          });
          if(!this.challenges.length){
            this.header = 'NO AVAILABLE GAMES';
            this.msg = `Sorry there are no more ${this.selectedSportKey.toUpperCase()} games left today. Please Check back tomorrow.`;
            this.showpopup = true
          }
        },
        (err) => {
          console.error(err);
        }
      );
  }

  getChallengeName(item) {
    let name =
      item && item.contestname
        ? item.contestname
        : "";
    if (item && item.game_id) {
      if (name !== "") {
        name += "-";
      }
      name += item.game_id;
    }
    return name;
  }
  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goToChallengeSportList() {
    this.navCtrl.push(ChallengeSportListPage);
  }

  join(challenge) {
    // const user = JSON.parse(localStorage.getItem('loggedUser'));
    // const body = {
    //   game: challenge.game,
    //   totalscore: challenge.totalscore,
    //   freeservice: user.freeservice,
    //   id: challenge._id,
    //   joinuser: challenge.userid,
    //   contestname: challenge.contestname,
    //   checkedgroup: JSON.stringify(challenge.checkedgroup)
    // }
    // this.http.post(environment.URL + "/contest/joinbysport_game2", body, this.optionHeader)
      // .subscribe(data => {
        // this.loading = false;
        // if (!data.ok) return alert(data.statusText);
        // if (data.ok) {
          // this.loading = true;
          this.navCtrl.push(ContestSelectPage, {
            sport: this.selectedSportKey,
            player: challenge.challengers,
            game: challenge.entry_fee,
            team: challenge.picks,
          });
        // }
      // }, error => {
        // this.loading = false;
        // alert('error');
        // console.log(error);
      // });
  }
  closePopup() {
    this.showpopup = false;
    this.navCtrl.push(ChallengeSportListPage);  
  }

  joinOpenTournament(){
    console.log("THis is join page")
    this.navCtrl.push(JoinTournamentPage ,{ sport: this.selectedSportKey })
  }
}
