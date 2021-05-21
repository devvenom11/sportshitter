import { Component } from '@angular/core';
import {AlertController, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import { Global } from "../../services/Global";
import sportConfig from "../../app/sport-config";
import { MyChallengesPage } from "../../pages/my-challenges/my-challenges";
import { ChallengeSportListPage } from "../challenge-sport-list/challenge-sport-list";
import {Headers, Http, RequestOptions} from "@angular/http";
import {environment as Details} from "../../environment";
import moment from "moment-timezone";

/**
 * Generated class for the JoinTournamentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-join-tournament',
  templateUrl: 'join-tournament.html',
})
export class JoinTournamentPage {
  selectedSportKey: String;
  selectedSport: any;
  sportinfo: any;
  headers = new Headers();
  optionHeader: any;
  name: any;
  time: any;
  currentDate = "";
  loading;
  team: any;
  prizeMoney: any = {};
  checkitemlength: number = 0;
  homeSports = [];
  awaySports = [];
  allPoints = [];
  checkedgroup: any = [];
  pointsPossible: number = 0;

  constructor(
    public toast: ToastController,
    public alert: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public global: Global,
    public http: Http,
    public loadingCtrl: LoadingController,
  ) {
    this.loading = loadingCtrl.create({
      content: "Please Wait...",
    });
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.name = this.navParams.get("sport").toUpperCase();
    this.getGames();
    this.getPrizeMoney();
  }

  getPrizeMoney() {
    this.http
      .get(
        `${Details.URL}/contest/prizemoney`,
        this.optionHeader
      )
      .subscribe(
        (res) => {
          let response = JSON.parse(res["_body"]);
          this.prizeMoney = response;
        },
        (e) => {
          console.log(e);
        }
      );
  }
  getGames() {
    let games = [],
      counter = 0,
      newGameArry = [];
    if (this.name == "SX") {
      let sports = ["NHL", "NBA", "NCAAB", "NFL", "NCAAF", "GOLF", "NASCAR"];
      sports.forEach((arry) => {
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
          `${Details.URL}/contest/todaygame/${this.name.toLowerCase()}`,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            let response = JSON.parse(res["_body"]);
            this.sportinfo = response;
            this.checkGameRules();
          },
          (e) => {
            console.log(e);
          }
        );
    }
  }

  checkGameRules() {
    var tempsportinfo = [];
    let date = new Date().toISOString();
    let estDate = moment.tz(date, "America/New_York");
    let ESTTime = moment(estDate).format("HH:mm");
    this.time = ESTTime;
    let startDateM = moment(estDate).format("YYYY-MM-DD");
    this.currentDate = moment(estDate).format("MMDDYY");
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
    this.sportinfo.forEach((element) => {
      let finalTime = new Date(element.MatchTime).toUTCString();
      element.parsedTime = moment
        .tz(finalTime, "America/New_York")
        .format("MMM DD YYYY hh:mm A");
      if (element.Odds) {
        element.Odds = JSON.parse(element.Odds[0]);
        // nfl and ncaaf rules
        console.log(this.name);

        if (this.name == "NFL" || this.name == "NCAAF" || this.name == "SX") {
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
            // check if it tuesday add rule to only show games after 05:01
            if (todayDay == 2) {
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
          this.name == "MLB" ||
          this.name == "NCAAB" ||
          this.name == "NHL" ||
          this.name == "NBA"
          // ||
          // this.name == "SX"
        ) {
          month = new Date(element.parsedTime).getMonth() + 1;
          // convertDate=new Date(element.MatchTime).getFullYear()+'-'+month+'-'+new Date(element.MatchTime).getDate()
          convertDate =
            new Date(element.parsedTime).getFullYear() +
            "/" +
            month +
            "/" +
            new Date(element.parsedTime).getDate();
          // console.log('EST TIME',moment(startDateM).format('YYYY-MM-DD'))
          // console.log('MatchTime',moment(convertDate).format('YYYY-MM-DD'))
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
        if (
          this.name == "MMA" ||
          this.name == "NASCAR" ||
          this.name == "GOLF"
        ) {
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
    this.loading.dismiss();
  }

  checkTime(timeString) {
    let time =
      new Date(timeString).getHours() + ":" + new Date(timeString).getMinutes();
    let nowTime = new Date().toISOString();
    let estDate = moment.tz(nowTime, "America/New_York");
    let ESTTime = moment(estDate).format("HH:mm");
    // console.log(diff.asMinutes())
    let diff = moment.duration(
      moment(ESTTime, "HH:mm").diff(moment(time, "HH:mm"))
    );
    // var hours = diff.hours();
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

  checkItem2(
    index,
    type,
    otherTeam,
    time,
    yourPick,
    spread,
    homespread,
    eventID,
    TotalNumber,
    g2value,
    $event,
    check,
    source
  ) {
    let timeHours = time;
    time = moment(time).format("MM/DD hh:mm");
    // check if value is true or false
    if ($event._value) {
      // check number of picks
      if (
        this.checkitemlength >= parseInt(this.team) &&
        !(this.homeSports[index] == true && this.awaySports[index] == true)
      ) {
        let toast = this.toast.create({
          message: "Max Length, Change your checked list.",
          duration: 3000,
          position: "bottom",
        });
        toast.present();
        $event._value = false;
        if (check == "awaySports") {
          this.awaySports.pop();
        } else {
          this.homeSports.pop();
        }
      } else {
        // add pick value and possible points
        this.allPoints[index] = g2value;
        this.checkitemlength++;
        if (check == "awaySports") {
          if (this.homeSports[index]) {
            this.homeSports[index] = false;
          }
          this.awaySports[index] = $event._value;
        } else {
          if (this.awaySports[index]) {
            this.awaySports[index] = false;
          }
          this.homeSports[index] = $event._value;
        }
        this.checkedgroup[index] = {
          type: type,
          ii: otherTeam,
          time: time,
          timeHours: timeHours,
          team: yourPick,
          spread: spread,
          total: TotalNumber,
          homespread: homespread,
          eventid: eventID,
          g2Val: g2value,
          source: source,
        };
      }
    } else {
      // remove picks and possible points
      this.checkitemlength--;
      if (check == "awaySports") {
        this.awaySports[index] = $event._value;
      } else {
        this.homeSports[index] = $event._value;
      }
      if (!this.awaySports[index] && !this.homeSports[index]) {
        this.allPoints[index] = 0;
        this.checkedgroup[index] = 0;
        // this.checkedgroup.splice(index,1)
      }
    }
    // sum all possible point
    this.pointsPossible = this.allPoints.reduce(
      (a, b) => parseFloat(a) + parseFloat(b),
      0
    );
  }

  ionViewDidLoad() {
    this.selectedSportKey = this.navParams.get("sport");
    this.selectedSport = sportConfig[this.selectedSportKey];
  }

  myChallenges(){
    this.navCtrl.push(MyChallengesPage,{sport : this.selectedSportKey});
  }
  goToChallengeSportList(){
    this.navCtrl.push(ChallengeSportListPage);
  }

}
