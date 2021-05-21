import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  Events,
  LoadingController,
  ToastController,
} from "ionic-angular";
import { Http, RequestOptions, Headers } from "@angular/http";

import { Global } from "../../services/Global";
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { FundObservable } from "../../services/fundObservable";
import { ContestSelectPage } from "../contest-select/contest-select";
import {environment as Details} from '../../environment';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import moment from "moment-timezone";


// via chooseGameVal ... gameChoose.game is the index of the sport
// via chooseChallenge ... item.challenge  is th eindex of the challenge (??)

// {
//     "entryFees": [25,75,100],
//     "requiredPicks": [1,3,7],
//     "sportType": ["nba","ncaab"],
//     "minChallengerCount": 3,
//     "maxChallengerCount": 10,

// 	"audienceType": ["public", "private"],
// 	"payoutTiers": [
// 		{"place": 1, "totalPayoutPercent": 0.5, "maxPayoutCount": 1},
// 		{"place": 2, "totalPayoutPercent": 0.3, "maxPayoutCount": 2},
// 		{"place": 3, "totalPayoutPercent": 0.1, "maxPayoutCount": 3}
// 	]
// }


@Component({
  selector: "page-challenge-picks",
  templateUrl: "challenge-picks.html",
})
export class ChallengePicksPage {
  picks;
  challenges;
  fund: number = 0;
  loading: any;
  headers = new Headers();
  optionHeader: any;
  sports = [];
  directFlag;
  amount;
  create;
  picksarray = [
    {
      game: 25,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "public", pick: 3, challenge: 2 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
    {
      game: 50,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "public", pick: 3, challenge: 2 },
        { flag: "public", pick: 6, challenge: 1 },
        { flag: "public", pick: 6, challenge: 2 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
    {
      game: 100,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "public", pick: 3, challenge: 2 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
    {
      game: 250,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
    {
      game: 500,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
    {
      game: 1000,
      val: [
        { flag: "public", pick: 3, challenge: 1 },
        { flag: "private", pick: 3, challenge: 1 },
      ],
    },
  ];
  gameChoose;
  currentGameIndex;
  challengeIndexSelected;
  currentSportIndex;
  menuObj;
  enablebtn;
  currentChallenger;
  currentPicks;
  currentGame;
  CurrentSport;
  sportinfo;
  header;
  msg;
  showpopup: boolean = false;
  hasgame: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public http: Http,
    public toast: ToastController,
    public loadingCtrl: LoadingController,
    public global: Global,
    public fundObservable: FundObservable
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.directFlag = this.navParams.get("inviteFlag");
    this.amount = this.navParams.get("amount");
    this.create = this.navParams.get("create");
    this.http.get(`${Details.URL}/admin/getmenu`).subscribe(
      res => {
        this.menuObj = JSON.parse(res["_body"]);
        this.menuObj.push({ game: "SX", priority: -1, status: 1 });
        this.menuObj.sort((a, b) => (a.priority > b.priority ? 1 : -1));

        this.menuObj = this.menuObj.filter(obj => {
          if (obj.status > 0) return obj;
        });

        this.menuObj.forEach(element => {
          element.game = element.game.toLowerCase();
          if (element.game === "ncaab" || element.game === 'ncaam') {
            this.sports.push({
              image: "./assets/img/Group 159.svg",
              name: "NCAAB",
              imagewhite: "./assets/img/Group 123.svg",
              inactive: "./assets/img/Group 945.svg",
              active: element.status,
            });
          } else if (element.game === "nfl") {
            this.sports.push({
              image: "./assets/img/Group 154.svg",
              name: "NFL",
              imagewhite: "./assets/img/Group 1200.png",
              inactive: "./assets/img/nflinactive.svg",
              active: element.status,
            });
          } else if (element.game === "ncaaf") {
            this.sports.push({
              image: "./assets/img/Group 158.svg",
              name: "NCAAF",
              imagewhite: "./assets/img/Group 121.svg",
              inactive: "./assets/img/ncaafinactive.svg",
              active: element.status,
            });
          } else if (element.game === "mlb") {
            this.sports.push({
              image: "./assets/img/Path 639.svg",
              name: "MLB",
              imagewhite: "./assets/img/Path 535.svg",
              inactive: "./assets/img/mlbinactive.svg",
              active: element.status,
            });
          } else if (element.game.toLowerCase() === "nba") {
            this.sports.push({
              image: "./assets/img/Path 638.svg",
              name: "NBA",
              imagewhite: "./assets/img/Path 316.svg",
              inactive: "./assets/img/nbainactive.svg",
              active: element.status,
            });
          } else if (element.game === "nhl") {
            this.sports.push({
              image: "./assets/img/Group 151.svg",
              name: "NHL",
              imagewhite: "./assets/img/Group 100.svg",
              inactive: "./assets/img/nhlinactive.svg",
              active: element.status,
            });
          } else if (element.game === "nascar") {
            this.sports.push({
              image: "./assets/img/Group 223.svg",
              name: "NASCAR",
              imagewhite: "./assets/img/Group 138.svg",
              inactive: "./assets/img/nascarinactive.svg",
              active: element.status,
            });
          } else if (element.game === "golf") {
            this.sports.push({
              image: "./assets/img/Group 156.svg",
              name: "GOLF",
              imagewhite: "./assets/img/Group 135.svg",
              inactive: "./assets/img/golfinactive.svg",
              active: element.status,
            });
          } else if (element.game === "mma") {
            this.sports.push({
              image: "./assets/img/Group 231.svg",
              name: "MMA",
              imagewhite: "./assets/img/Group 230.svg",
              inactive: "./assets/img/Group 228.svg",
              active: element.status,
            });
          } else if (element.game === "SX") {
            this.sports.push({
              name: "SX",
              active: element.status
            });
          }
        });
      },
      e => {
        console.log(e);
      }
    );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChallengeHomePage');
  }

  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.fund = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  goPick() {
    console.log(this.currentChallenger);
    console.log(this.currentPicks);
    console.log(this.directFlag);
    console.log(this.currentGame);
    console.log(this.sports[this.currentSportIndex].name);
    this.navCtrl.setRoot(ContestSelectPage, {
      team: this.currentPicks,
      directFlag: this.directFlag,
      player: this.currentChallenger,
      create: "jc",
      game: this.currentGame,
      sport: this.sports[this.currentSportIndex].name,
    });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }
  chooseGameVal(index) {
    if (this.hasgame) {
      this.gameChoose = this.picksarray[index];
      this.currentGameIndex = index;
      this.checkbuttonstatus();
    }
  }
  currentSport(i, status) {
    if (status) {
      this.currentSportIndex = i;
      this.getGames();
    }
    if (this.hasgame) {
      this.checkbuttonstatus();
    }
  }
  chooseChallenge(challenger, picks, game, index) {
    this.challengeIndexSelected = index;
    this.currentPicks = picks;
    this.currentChallenger = challenger;
    this.currentGame = game;
    this.checkbuttonstatus();
  }
  checkbuttonstatus() {
    let enablebtn = new FormGroup({
      game: new FormControl(this.currentGame, Validators.required),
      pick: new FormControl(this.currentPicks, Validators.required),
      challenge: new FormControl(this.currentChallenger, Validators.required),
    });
    this.enablebtn =
      enablebtn.status != "INVALID" && this.hasgame ? true : false;
  }
  getGames() {
    this.loading = this.loadingCtrl.create({
      content: "Please Wait1...",
    });
    this.loading.present();
    let games = [],
      counter = 0,
      newGameArry = [];
    if (this.sports[this.currentSportIndex].name == "SX") {
      //let sports = ["NHL", "NBA", "NCAAB", "NFL", "NCAAF"]; // by sunil
      let sports = ["NFL", "NCAAF"];
      sports.forEach((arry) => {
        let newurl = `${Details.URL}/contest/todaygame/${arry.toLowerCase()}`;
        console.log("NEW URL: " + newurl);
        this.http
          .get(
            `${Details.URL}/contest/todaygame/${arry.toLowerCase()}`,
            this.optionHeader
          )
          .subscribe(
            (res) => {
              let response = JSON.parse(res["_body"]);
              games.push(response);
              counter++;
              if (counter == sports.length) {
                games.forEach((res2) => {
                  if (res2.length > 0) {
                    res2.forEach((res3) => {
                      newGameArry.push(res3);
                    });
                  }
                });
                this.sportinfo = newGameArry;
                this.checkGameRules();
              }
            },
            (e) => {
              console.log(e);
            }
          );
      });
    } else {
      this.http
        .get(
          `${Details.URL}/contest/todaygame/${this.sports[
            this.currentSportIndex
          ].name.toLowerCase()}`,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            let response = JSON.parse(res["_body"]);
            this.sportinfo = response;
            console.log("[getGames] this.sportinfo ");
            console.log(this.sportinfo);
            this.checkGameRules();
          },
          (e) => {
            console.log(e);
          }
        );
    }
  }
  checkGameRules() {
    let name = this.sports[this.currentSportIndex].name;
    var tempsportinfo = [];
    let date = new Date().toISOString();
    let estDate = moment.tz(date, "America/New_York");
    let ESTTime = moment(estDate).format("HH:mm");
    let startDateM = moment(estDate).format("YYYY-MM-DD");
    let startTime = moment("05:01", "HH:mm");
    let endDateM = moment(estDate, "YYYY-MM-DD").add(8, "days");
    let convertDate,
      month,
      todayDay = moment().day();
    if (todayDay == 0) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(2, "days");
    }
    // monday
    if (todayDay == 1) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(1, "days");
    }
    if (todayDay == 8 /*1*/) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(1, "days");
    }
    if (todayDay == 2) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(8, "days");
    }
    if (todayDay == 3) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(6, "days");
    }
    if (todayDay == 4) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(5, "days");
    }
    if (todayDay == 5) {
      endDateM = moment(startDateM, "YYYY-MM-DD").add(4, "days");
    }
    if (todayDay == 6) {
      endDateM = moment(startDateM).add(3, "days");
    }
    console.log("[checkGameRules] sportinfo before: name " + name);
    console.log(this.sportinfo);
    this.sportinfo.forEach((element) => {
      let finalTime = new Date(element.MatchTime).toUTCString();
      element.parsedTime = moment
        .tz(finalTime, "America/New_York")
        .format("MMM DD YYYY hh:mm A");
      if (element.Odds) {
        element.Odds = JSON.parse(element.Odds[0]);
        // nfl and ncaaf rules
        if (name == "NFL" || name == "NCAAF" || name == "SX") {
          month = new Date(element.parsedTime).getMonth() + 1;
          // convertDate=new Date(element.MatchTime).getFullYear()+'/'+month+'/'+new Date(element.MatchTime).getDate()
          convertDate =
            new Date(element.parsedTime).getFullYear() +
            "/" +
            month +
            "/" +
            new Date(element.parsedTime).getDate();
          // check for one week games
          if (
            moment(moment(convertDate, "YYYY-MM-DD")).isBetween(
              startDateM,
              endDateM
            )
          ) {
            tempsportinfo.push(element);
          } else if (
            moment(startDateM, "YYYY-MM-DD").isSame(
              moment(convertDate, "YYYY-MM-DD")
            )
          ) {
            // check if it monday add rule to only show games after 05:01
            if (todayDay == 1) {
              // check if time game is after time start setting by admin
              if (
                moment(ESTTime, "HH:mm").isAfter(moment(startTime, "HH:mm"))
              ) {
                if (this.checkTime(element.parsedTime)) {
                  tempsportinfo.push(element);
                }
              }
            } else {
              if (this.checkTime(element.parsedTime)) {
                tempsportinfo.push(element);
              }
            }
          }
        }
        // MLB rules
        if (
          name == "MLB" ||
          name == "NCAAB" ||
          name == "NHL" ||
          name == "NBA"
          // ||
          // name == "SX"
        ) {
          month = new Date(element.parsedTime).getMonth() + 1;
          convertDate =
            new Date(element.parsedTime).getFullYear() +
            "/" +
            month +
            "/" +
            new Date(element.parsedTime).getDate();
          if (
            moment(startDateM, "YYYY-MM-DD").isSame(
              moment(convertDate, "YYYY-MM-DD")
            )
          ) {
            if (this.checkTime(element.parsedTime)) {
              tempsportinfo.push(element);
            }
          }
        }
        // show games 3 days before the day game
        if (name == "MMA" || name == "NASCAR" || name == "GOLF") {
          month = new Date(element.parsedTime).getMonth() + 1;
          convertDate =
            new Date(element.parsedTime).getFullYear() +
            "/" +
            month +
            "/" +
            new Date(element.parsedTime).getDate();
          endDateM = moment().add(3, "days");
          if (
            moment(moment(convertDate, "YYYY-MM-DD")).isBetween(
              startDateM,
              endDateM
            )
          ) {
            tempsportinfo.push(element);
          } else if (
            moment(startDateM, "YYYY-MM-DD").isSame(
              moment(convertDate, "YYYY-MM-DD")
            )
          ) {
            if (this.checkTime(element.parsedTime)) {
              tempsportinfo.push(element);
            }
          }
        }
      }
    });
    this.sportinfo = [];
    this.sportinfo = tempsportinfo;
    // order by games by MatchTime
    this.sportinfo = this.sportinfo.sort(
      (a, b) =>
        moment(a.MatchTime).valueOf() - moment(b.MatchTime).valueOf()
    );
    console.log("[checkGameRules] sportinfo after rules: ");
    console.log(this.sportinfo);

    if (this.sportinfo.length < 3) {
      this.header = `No available games`;
      this.msg = `There are no more ${name} games left today. <br> Please check back tomorrow.`;
      this.showpopup = true;
      this.hasgame = false;
    } else {
      this.hasgame = true;
      this.showpopup = false;
    }
    this.checkbuttonstatus();
    this.loading.dismiss();
  }

  checkTime(timeString) {
    // function to not display any games that are two minutes before the game starts
    let time =
      new Date(timeString).getHours() + ":" + new Date(timeString).getMinutes();
    let nowTime = new Date().toISOString();
    let estDate = moment.tz(nowTime, "America/New_York");
    let ESTTime = moment(estDate).format("HH:mm");
    let diff = moment.duration(
      moment(ESTTime, "HH:mm").diff(moment(time, "HH:mm"))
    );
    if (Math.sign(diff.asMinutes()) == -1) {
      if (diff.asMinutes() * -1 > 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
