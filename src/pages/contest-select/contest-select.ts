import { Component } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  Events,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController,
} from "ionic-angular";
import { FavouritesPage } from "./../favourites/favourites";
import { ContestMainPage } from "./../contest-main/contest-main";
import { ContestSinglePage } from "./../contest-single/contest-single";
import { Headers, Http, RequestOptions } from "@angular/http";
import { environment as Details } from '../../environment';
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { Global } from "../../services/Global";
import moment from "moment-timezone";
import { FundObservable } from "../../services/fundObservable";
import { ChallengePicksPage } from "../challenge-picks/challenge-picks";

@Component({
  selector: "page-contest-select",
  templateUrl: "contest-select.html",
})
export class ContestSelectPage {
  sportinfo: any;
  player: any;
  team: any;
  game: any;
  name: any;
  checkitemlength: number = 0;
  checkedgroup: any = [];
  currentcontestid = "";
  funds: number = 0;
  fund = 0;
  createflag = "jc";
  showpicks = false;
  showpicklist = [];
  currentDate = "";
  fundmodalflag = false;
  inviteflag: any = null;
  joinflag: boolean = null;
  contestname;
  directflag: boolean = false;
  pointsPossible: number = 0;
  contestPrizeFraction = Details.contestPrizeFraction;
  headers = new Headers();
  optionHeader: any;
  gamesByWeek = [];
  showpopup: boolean = false;
  msg: string;
  header: string;
  needGoBack: boolean = false;
  time;
  sport;
  loading;
  awaySports = [];
  homeSports = [];
  allPoints = [];
  // fee:number;
  isComingFromNotificationPage: boolean = false;
  singleChallengeData;
  needGoChallenge: boolean = false;
  interval;
  showCounter: boolean = false;
  hideHours: boolean = false;
  hideDays: boolean = false;
  earliestGame;
  hideCounter: boolean = true;
  commingFromCustom: boolean = false;
  challengeName: string = "";
  promoData;
  challengeData;
  constructor(
    public navCtrl: NavController,
    public toast: ToastController,
    public alert: AlertController,
    public action: ActionSheetController,
    public event: Events,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public http: Http,
    public global: Global,
    public loadingCtrl: LoadingController,
    public fundObservable: FundObservable
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.loading = loadingCtrl.create({
      content: "Please Wait...",
    });
    this.loading.present();
    if (localStorage.getItem("comingfromnotification") == "true") {
      this.isComingFromNotificationPage = true;
      localStorage.removeItem("comingfromnotification");
    }
    this.sportinfo = this.navParams.get("sportinfo");

    if (this.navParams.get("create")) {
      this.createflag = this.navParams.get("create");
    }
    this.commingFromCustom = this.navParams.get("commingFromCustom");
    this.challengeName = this.navParams.get("challengeName");
    this.name = this.navParams.get("sport").toUpperCase();
    this.team = this.navParams.get("team");
    this.currentcontestid = this.navParams.get("currentcontestid");
    this.player = parseInt(this.navParams.get("player"));
    this.game = this.navParams.get("game");
    this.joinflag = this.navParams.get("joinflag");
    this.inviteflag = this.navParams.get("inviteflag");
    this.contestname = this.navParams.get("contestname");
    this.directflag = this.navParams.get("directFlag");
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    this.getGames();

    if (this.currentcontestid) {
      this.getSingleGame(user["_id"]);
    }
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
        this.fund = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  closefundmodal() {
    this.fundmodalflag = false;
  }

  back() {
    this.navCtrl.setRoot(ContestMainPage);
  }

  /**
   * Navigate to favourite page
   */
  goFavourite() {
    this.navCtrl.push(FavouritesPage, { menu: false });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  closepicks() {
    this.showpicks = false;
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
  showConfirmPicks() {
    // check if picks are complete
    if (this.checkitemlength < parseInt(this.team)) {
      let toast = this.toast.create({
        message: "please check enough picks.",
        duration: 3000,
        position: "bottom",
      });
      toast.present();
      return;
    } else {
      let ifTimeLater,
        gameFinish = false;
      let date = new Date().toISOString();
      let estDate = moment.tz(date, "America/New_York");
      let startDate = moment(estDate).format("YYYY-MM-DD");
      let convertDate, gameDate, month;
      this.checkedgroup.forEach((res) => {
        if (res != 0) {
          gameDate = new Date(res.timeHours);
          month = gameDate.getMonth() + 1;
          convertDate =
            gameDate.getFullYear() + "-" + month + "-" + gameDate.getDate();
          // check if game is today
          if (
            moment(startDate, "YYYY-MM-DD").isSame(
              moment(convertDate, "YYYY-MM-DD")
            )
          ) {
            if (!this.checkTime(res.timeHours)) {
              ifTimeLater = true;
            }
          }
        }
      });
      if (this.currentcontestid) {
        // IF IS A SPECIAL PROMO
        if (this.createflag == "sp") {
          let date = this.promoData.challenge_end.split(".")[0];
          //IOS was converting the time so i set the time in this way.
          date = moment(date).format("MM/DD/YYYY hh:mm A");
          if (!this.checkTime(date)) {
            ifTimeLater = true;
            gameFinish = true;
          }
          // if(this.challengeData.resultlist.length>0){
          //   ifTimeLater=true
          //   gameFinish=true
          // }
          // else{
          //   let singleCheckedgroup=[]
          //   console.log('sp')
          //   this.challengeData.checkedgroup.forEach(res=>{
          //     singleCheckedgroup.push(JSON.parse(res))
          //   })
          //   singleCheckedgroup.forEach(res=>{
          //     res.forEach(res2=>{
          //       if(!this.checkTime(res2.timeHours)){
          //         ifTimeLater=true;
          //         gameFinish=true
          //       }
          //     })
          //   })
          // }
        }
        if (this.singleChallengeData) {
          if (this.singleChallengeData.challengedetails.resultlist.length > 0) {
            ifTimeLater = true;
            gameFinish = true;
          }
          // CHECK IF THE OTHERS GAMES ALREADY STARTED
          else {
            let singleCheckedgroup = [];
            this.singleChallengeData.challengedetails.checkedgroup.forEach(
              (res) => {
                singleCheckedgroup.push(JSON.parse(res));
              }
            );
            singleCheckedgroup.forEach((res) => {
              res.forEach((res2) => {
                if (
                  moment(startDate, "YYYY-MM-DD").isSame(
                    moment(res2.timeHours).format("YYYY-MM-DD")
                  )
                ) {
                  if (!this.checkTime(res2.timeHours)) {
                    ifTimeLater = true;
                    gameFinish = true;
                  }
                }
              });
            });
          }
        }
      }
      if (ifTimeLater) {
        if (gameFinish) {
          this.header = "Chosen Games Time Out.";
          this.msg =
            "One or more of the games from your challenging have already started. Once a game beggings you can not make picks for this challenge ";
          this.showpopup = true;
          this.needGoChallenge = true;
        } else {
          this.header = "Chosen Games Time Out.";
          this.msg =
            "One or more of the games you picked have already started. Once a game beggings it can no longer be chosen for a challenge";
          // show popup and reset all values
          this.showpopup = true;
          this.needGoBack = false;
          this.showpopup = true;
          this.needGoBack = false;
          this.checkedgroup = [];
          this.awaySports = [];
          this.homeSports = [];
          this.checkitemlength = 0;
          this.allPoints = [];
          this.pointsPossible = 0;
          this.getGames();
        }
      } else {
        this.showpicklist = this.checkedgroup;
        this.clearInterval();
        this.showpicks = true;
      }
    }
  }

  confirmPicks() {
    this.loading = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    this.loading.present();
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    if (!this.isComingFromNotificationPage) {
      if (this.game != 0 && this.game > this.fund) {
        let toast = this.toast.create({
          message: "please check fund status.",
          duration: 3000,
          position: "bottom",
        });
        this.fundmodalflag = true;
        this.loading.dismiss();
        toast.present();
        return;
      }
    }
    let checkWithout0 = [];
    this.checkedgroup.forEach((res) => {
      if (res != 0) {
        checkWithout0.push(res);
      }
    });
    this.checkedgroup = checkWithout0;
    this.sortByDate(this.checkedgroup);
    let postParams;
    // check if it a special promo challenge
    if (this.promoData) {
      postParams = {
        joinuser: user["_id"],
        contestname: this.challengeData.contestname,
        promo_id: this.challengeData.promoid,
        checkedgroup: JSON.stringify(this.checkedgroup.filter(Boolean)),
      };
      this.http
        .post(
          `${Details.URL}/contest/joinpromo_challenge`,
          postParams,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            this.loading.dismiss();
            this.showpicks = false;
            this.navCtrl.setRoot(ContestMainPage);
          },
          (e) => {
            console.log(e);
            this.loading.dismiss();
          }
        );
    } else {
      // if user is creating a custom challenge.
      if (this.commingFromCustom) {
        postParams = {
          userid: user["_id"],
          checkedgroup: JSON.stringify(this.checkedgroup.filter(Boolean)),
          name: this.name,
          team: this.team,
          player: this.player,
          game_id: this.currentDate,
          game: this.game,
          create: this.createflag,
          contestname: this.challengeName,
          payoutoption: 1,
          inviteflag: true,
        };
        this.http
          .post(
            Details.URL + "/contest/register_game2",
            postParams,
            this.optionHeader
          )
          .subscribe(
            (data) => {
              this.currentcontestid = JSON.parse(data["_body"])["message"][
                "_id"
              ];
              postParams = {
                id: this.currentcontestid,
                joinuser: user["_id"],
                game: this.game,
                checkedgroup: JSON.stringify(this.checkedgroup.filter(Boolean)),
                totalscore: 0,
                freeservice: 0,
              };
              this.http
                .post(
                  Details.URL + "/contest/joinbysport_game2",
                  postParams,
                  this.optionHeader
                )
                .subscribe(
                  (resp) => {
                    let data = JSON.parse(resp["_body"]);
                    this.updateFund();
                    this.showpicks = false;
                    this.loading.dismiss();
                    this.navCtrl.push(ContestSinglePage, {
                      constestID: this.currentcontestid,
                    });
                  },
                  (error) => {
                    this.loading.dismiss();
                    console.log(error); // Error getting the data
                    this.header = "Error";
                    this.msg = "Something wrong happen. Please try again.";
                    this.showpopup = true;
                    this.needGoBack = false;
                    this.updateFund();
                    // this.navCtrl.setRoot(ContestMainPage);
                  }
                );
            },
            (e) => {
              console.log(e);
            }
          );
      } else {
        //if a user come with an invitation then join to the challenge. this is for custom and private (only if you receive the invitation. if you create the challenge will enter in the next conditional).
        if (this.currentcontestid) {
          postParams = {
            id: this.currentcontestid,
            joinuser: user["_id"],
            game: this.game,
            checkedgroup: JSON.stringify(this.checkedgroup.filter(Boolean)),
            totalscore: 0,
            freeservice: 0,
          };
          this.http
            .post(
              Details.URL + "/contest/joinbysport_game2",
              postParams,
              this.optionHeader
            )
            .subscribe(
              (resp) => {
                let data = JSON.parse(resp["_body"]);
                this.showpicks = false;
                this.updateFund();
                this.loading.dismiss();
                if (data.userid !== user["_id"]) {
                  this.navCtrl.setRoot(ContestMainPage);
                } else {
                  this.navCtrl.push(ContestSinglePage, {
                    constestID: this.currentcontestid,
                  });
                }
              },
              (error) => {
                this.loading.dismiss();
                console.log(error); // Error getting the data
                this.header = "Error";
                this.msg = "Something wrong happen. Please try again.";
                this.showpopup = true;
                this.needGoBack = false;
                // this.navCtrl.setRoot(ContestMainPage);
              }
            );
        }
        // check if it a public or private challenge
        else {
          // private challenge. only if the user create the challenge.
          if (this.directflag) {
            console.log("private");
            let params = {
              userid: user["_id"],
              checkedgroup: [],
              name: this.name,
              team: this.team,
              player: this.player,
              game: this.game,
              game_id: this.currentDate,
              create: this.createflag,
              payoutoption: null,
              directflag: this.directflag,
              freeservice: 0,
            };
            this.http
              .post(
                Details.URL + "/contest/register_game2",
                params,
                this.optionHeader
              )
              .subscribe(
                (data) => {
                  this.currentcontestid = JSON.parse(data["_body"])["message"][
                    "_id"
                  ];
                  postParams = {
                    id: this.currentcontestid,
                    joinuser: user["_id"],
                    game: this.game,
                    checkedgroup: JSON.stringify(
                      this.checkedgroup.filter(Boolean)
                    ),
                    totalscore: 0,
                    freeservice: 0,
                  };
                  this.http
                    .post(
                      Details.URL + "/contest/joinbysport_game2",
                      postParams,
                      this.optionHeader
                    )
                    .subscribe(
                      (resp) => {
                        this.updateFund();
                        this.showpicks = false;
                        this.loading.dismiss();
                        this.navCtrl.push(ContestSinglePage, {
                          constestID: this.currentcontestid,
                        });
                      },
                      (error) => {
                        this.loading.dismiss();
                        console.log(error); // Error getting the data
                        this.header = "Error";
                        this.msg = "Something wrong happen. Please try again.";
                        this.showpopup = true;
                        this.needGoBack = false;
                        // this.navCtrl.setRoot(ContestMainPage);
                      }
                    );
                },
                (error) => {
                  console.log(error); // Error getting the data
                }
              );
          }
          // public challenge
          else {
            console.log("public");
            postParams = {
              userid: user["_id"],
              checkedgroup: JSON.stringify(this.checkedgroup.filter(Boolean)),
              name: this.name,
              team: this.team,
              player: this.player,
              game: this.game,
              game_id: this.currentDate,
              create: this.createflag,
              payoutoption: null,
              directflag: this.directflag,
              freeservice: 0,
            };
            this.http
              .post(
                Details.URL + "/contest/joinpublic_challenge",
                postParams,
                this.optionHeader
              )
              .subscribe(
                (data) => {
                  this.loading.dismiss();
                  this.showpicks = false;
                  this.updateFund();
                  this.navCtrl.setRoot(ContestMainPage);
                  // this.currentcontestid = JSON.parse(data['_body'])['message']['_id'];
                  // this.postRequest(0);
                },
                (error) => {
                  this.loading.dismiss();
                  this.header = "Error";
                  this.msg = "Something wrong happen. Please try again.";
                  this.showpopup = true;
                  this.needGoBack = false;
                  console.log(error); // Error getting the data
                }
              );
          }
        }
      }
    }
  }
  checkTime(timeString) {
    // function to not display any games that are two minutes before the game starts
    // let time=timeString.getHours()+':'+timeString.getMinutes();
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
  closePopup() {
    if (this.needGoChallenge) {
      this.navCtrl.setRoot(ContestMainPage);
    }
    if (this.needGoBack) {
      this.showpopup = false;
      if (this.isComingFromNotificationPage) {
        this.navCtrl.setRoot(ContestMainPage);
      } else {
        this.navCtrl.setRoot(ChallengePicksPage);
      }
    } else {
      this.showpopup = false;
    }
  }
  sortByDate(array) {
    return array.sort(
      (a, b) =>
        moment(a.timeHours).valueOf() - moment(b.timeHours).valueOf()
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
      // element.MatchTime = moment.utc(finalTime).subtract(5, 'hours').toDate()
      // element.parsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MMM DD YYYY hh:mm A');
      element.parsedTime = moment
        .tz(finalTime, "America/New_York")
        .format("MMM DD YYYY hh:mm A");
      // element.parsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MM/DD/YYYY hh:mm A');
      // element.MatchTime = finalTime.toDate();
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
    // FEE CALCULATION
    // if(this.currentcontestid){
    //   this.fee=(Number(this.player+1)*Number(this.game))-(Number(this.sportinfo[0].customfee)/100)*(Number(this.player+1)*Number(this.game))
    // }
    // else{
    //   if(this.directflag){
    //     this.fee=(Number(this.player+1)*Number(this.game))-(Number(this.sportinfo[0].privatefee)/100)*(Number(this.player+1)*Number(this.game))
    //   }
    //   else{
    //     this.fee=(Number(this.player+1)*Number(this.game))-(Number(this.sportinfo[0].publicfee)/100)*(Number(this.player+1)*Number(this.game))
    //   }
    // }
    this.loading.dismiss();
    if (this.sportinfo.length < this.team) {
      this.header = `No ${this.name} Games`;
      if (this.name == "NFL" || this.name == "NCAAF" || this.name == "SX") {
        this.msg =
          "Sorry there are no games left this week. Check back tomorrow.";
      } else {
        this.msg = "Sorry there are no games left today. Check back tomorrow.";
      }
      this.showpopup = true;
      this.needGoBack = true;
    }
  }
  updateFund() {
    let user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    let postParams = {
      userid: user["_id"],
      gametype: this.global.gameType,
    };
    this.http
      .post(
        Details.URL + "/contest/getnotifibadget_funds",
        postParams,
        this.optionHeader
      )
      .subscribe(
        (data) => {
          var data1 = JSON.parse(data["_body"]);
          if (data1 != "err") {
            if (data1) {
              this.fundObservable.setFundNotification(Number(data1.balance));
            }
          }
        },
        (error) => {
          console.log(error); // Error getting the data
        }
      );
  }
  getSingleGame(userid) {
    // if challenge is special promo
    if (this.createflag == "sp") {
      this.http
        .get(
          `${Details.URL}/auth/single_specialpromolist/${this.currentcontestid}`,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            let data = JSON.parse(res["_body"]);
            this.promoData = data.promo[0];
            this.challengeData = data.challenge;
            let date = this.promoData.challenge_end.split(".")[0];
            //IOS was converting the time so i set the time in this way.
            date = moment(date).format("MM/DD/YYYY hh:mm A");
            this.showCounter = true;
            this.counter(date);
            // if(this.challengeData.userlist.length==0){
            //    // remove 00Z from the date to fix issue with timezone
            //   let date=this.promoData.challenge_start.split('.')[0]
            //   //IOS was converting the time so i set the time in this way.
            //   date=moment(date).format('MM/DD/YYYY hh:mm A')
            //   this.showCounter=true;
            //   this.counter(date)
            // }
            // else{
            //   let checkedgroup=[]
            //   this.challengeData.checkedgroup.forEach(res=>{
            //     if(res!=='[]'){
            //       checkedgroup.push(JSON.parse(res))
            //     }
            //   })
            //   if(checkedgroup.length > 0){
            //     // take the first pick value because checkedgroup is order by time.
            //     let checkedgroupArry = checkedgroup.map((d) => moment(d[0].timeHours))
            //     let minDate = moment.min(checkedgroupArry)
            //     this.earliestGame=minDate._i
            //     console.log('earliest game sp',this.earliestGame)
            //     this.showCounter=true;
            //     this.counter(this.earliestGame)
            //   }
            //   else{
            //     this.showCounter=false;
            //   }
            // }
          },
          (e) => {
            console.log(e);
          }
        );
    }
    // if its not.
    else {
      this.http
        .get(
          `${Details.URL}/contest/singlegame_info/${this.currentcontestid}/${userid}`,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            let data = JSON.parse(res["_body"]);
            this.singleChallengeData = data[0];
            if (this.singleChallengeData) {
              // let checkedgroup=JSON.parse(this.singleChallengeData.challengedetails.checkedgroup[0])
              let checkedgroup = [];
              this.singleChallengeData.challengedetails.checkedgroup.forEach(
                (res) => {
                  if (res !== "[]") {
                    checkedgroup.push(JSON.parse(res));
                  }
                }
              );
              // take the first pick value because checkedgroup is order by time.
              let checkedgroupArry = checkedgroup.map((d) =>
                moment(d[0].timeHours)
              );
              let minDate = moment.min(checkedgroupArry);
              this.earliestGame = minDate['_i'];
              this.counter(this.earliestGame);
              // this.counter(checkedgroup[0].timeHours)
              this.showCounter = true;
            }
          },
          (e) => {
            console.log(e);
          }
        );
    }
  }
  counter(date) {
    let timeString = new Date(date);
    let month = timeString.getMonth() + 1;
    let time =
      timeString.getFullYear() +
      "/" +
      month +
      "/" +
      timeString.getDate() +
      " " +
      timeString.getHours() +
      ":" +
      timeString.getMinutes() +
      ":" +
      timeString.getSeconds();
    let momentFormat = moment(time),
      fullTime;
    fullTime =
      momentFormat.format("YYYY-MM-DD") + "T" + momentFormat.format("HH:mm:ss");
    fullTime = fullTime.toString();
    let eventTime,
      currentTime,
      duration,
      interval,
      intervalId,
      days,
      hours,
      minutes,
      seconds;
    interval = 1000;
    eventTime = moment.tz(fullTime, "America/New_York");
    currentTime = moment.tz("America/New_York");
    duration = moment.duration(eventTime.diff(currentTime));
    this.interval = setInterval(() => {
      // get updated duration
      duration = moment.duration(duration - interval, "milliseconds");
      if (duration.asSeconds() <= 0) {
        this.hideDays = true;
        this.hideHours = true;
        // document.querySelector('.minutes0').innerHTML = "0"
        document.querySelector(".minutes").innerHTML = "00";
        // document.querySelector('.seconds0').innerHTML = "0"
        document.querySelector(".seconds").innerHTML = "00";
        clearInterval(intervalId);
        // hide the countdown element
        // timeElement.classList.add("hidden");
        this.hideCounter = false;
        if (this.createflag == "sp") {
          // if(this.challengeData.userlist.length==0){
          this.showCounter = false;
          this.clearInterval();
          // }
        }
      } else {
        days =
          duration.days().toString().length > 1
            ? duration.days()
            : [0 + "" + duration.days()];
        hours =
          duration.hours().toString().length > 1
            ? duration.hours()
            : [0 + "" + duration.hours()];
        minutes =
          duration.minutes().toString().length > 1
            ? duration.minutes()
            : [0 + "" + duration.minutes()];
        seconds =
          duration.seconds().toString().length > 1
            ? duration.seconds()
            : [0 + "" + duration.seconds()];
        this.hideDays = Number(days) > 0 ? false : true;
        this.hideHours = Number(hours) > 0 ? false : true;
        if (!this.hideDays) {
          // document.querySelector('.days0').innerHTML = days[0]
          document.querySelector(".daysPicks").innerHTML = days;
        }
        if (!this.hideHours) {
          // document.querySelector('.hours0').innerHTML = hours[0]
          document.querySelector(".hoursPicks").innerHTML = hours;
        }
        // document.querySelector('.minutes0').innerHTML = minutes[0]
        document.querySelector(".minutesPicks").innerHTML = minutes;
        // document.querySelector('.seconds0').innerHTML = seconds[0]
        document.querySelector(".secondsPicks").innerHTML = seconds;
        this.hideCounter = false;
      }
    }, interval);
  }
  clearInterval() {
    clearInterval(this.interval);
  }
  ionViewWillUnload() {
    this.clearInterval();
  }
}
