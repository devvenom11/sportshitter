import { Component } from "@angular/core";
import { NavController, NavParams, Events } from "ionic-angular";
import { JoinContestDetailPage } from "./../join-contest-detail/join-contest-detail";
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { Global } from "../../services/Global";
import { FundObservable } from "../../services/fundObservable";
import { ChallengeAmountPage } from "../challenge-amount/challenge-amount";

@Component({
  selector: "page-join-contest",
  templateUrl: "join-contest.html",
})
export class JoinContestPage {
  originsports = [];
  fund: number = 0;
  funds: number = 0;
  create = "";
  inviteFlag = false;
  sportsImageURL = {
    SX: "./assets/img/sx.png",
    NHL: "./assets/img/Group 151.svg",
    NFL: "./assets/img/Group 154.svg",
    NBA: "./assets/img/Path 638.svg",
    NCAAF: "./assets/img/Group 219.svg",
    GOLF: "./assets/img/Group 156.svg",
    NCAAB: "./assets/img/Group 218.svg",
    NASCAR: "./assets/img/Group 223.svg",
    MLB: "./assets/img/Path 639.svg",
    MMA: "./assets/img/Group 231.svg",
    SOCCER: "./assets/img/Group soccer-2.svg",
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public global: Global,
    public fundObservable: FundObservable
  ) {
    this.create = this.navParams.get("create");
    console.log(this.create);
    this.inviteFlag = this.navParams.get("inviteFlag");
    console.log(this.inviteFlag);
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.fund = res;
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
    this.getSports();
  }
  goFund() {
    this.navCtrl.push(FundfirstPage);
  }
  goDetail(item) {
    if (this.create == "cc") {
      this.navCtrl.push(JoinContestDetailPage, {
        sport: item,
        create: this.create,
      });
    } else {
      this.navCtrl.push(ChallengeAmountPage, {
        sport: item,
        directFlag: this.inviteFlag,
      });
      // this.navCtrl.push(ContestSelectPage,{sport:item,
      //   player:this.player,
      //   team:this.team,
      //   game:this.game,
      //   directFlag:this.inviteFlag
      // });
    }
  }

  getSports() {
    // this.originsports = [
    //   "SX",
    //   "MMA",
    //   "MLB",
    //   "NBA",
    //   "NHL",
    //   "GOLF",
    //   "NASCAR",
    //   "SOCCER",
    //   "NFL",
    //   "NCAAF",
    //   "NCAAB",
    // ];
    this.originsports = ["MLB", "NFL", "NBA", "MMA", "GOLF", "NHL", "NCAAB"];
  }
}
