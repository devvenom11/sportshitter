import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  Events,
  LoadingController,
} from "ionic-angular";
import { FavouritesPage } from "./../favourites/favourites";
import { CreateContestPage } from "./../create-contest/create-contest";
import { JoinContestPage } from "./../join-contest/join-contest";
import { ContestSelectPage } from "./../contest-select/contest-select";
import { ContestMainPage } from "./../contest-main/contest-main";
import { invitePage } from "./../invitePage/invitepage";
import {environment as Details} from '../../environment';
import { Http, Headers, RequestOptions } from "@angular/http";
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { EmailComposer } from "@ionic-native/email-composer";
import { Network } from "@ionic-native/network";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Global } from "../../services/Global";
import moment from "moment-timezone";
import { FundObservable } from "../../services/fundObservable";
@Component({
  selector: "page-join-contest-detail",
  templateUrl: "join-contest-detail.html",
})
export class JoinContestDetailPage {
  team: any;
  game: any;
  player: any;

  teamU = 0;
  gameU = 0;
  playerU = 0;

  sportinfo: any;
  name: any;
  continuestr: any;
  currentcontestuser = 0;
  currentcontestid = "";
  continuebtngroup = [];
  userarray = [];
  fund: number = 0;
  joincontestid = "";
  currentDate = "";
  teamc = null;
  gamec = null;
  playerc = null;
  customflag = false;

  upgrade = 0;
  createflag = "cc";

  prevteamarr = [];
  prevgamearr = [];
  prevplayerarr = [];

  previousoption = -1;
  previousoptionarr = [];

  joinoption = -1;
  joinoptionarr = [];

  previousFlag = false;
  joinFlag = false;

  fundmodalflag = false;
  loading: any;

  challengeSaved = false;
  //jami
  challengeName = null;
  payoutOption = null;

  inviteToggle = true;
  directToggle: boolean = false;
  canSee = "";
  payoutValues = [
    "1 winner: 100%",
    "2 winners: 1@ 80%,  1@ 20%",
    "3 winners: 1@ 70%, 1@ 15%, 1@ 10%, 2@ 5%",
  ];
  payoutDisplayValues = ["1 win: 100", "2 win: 80/20", "3 win: 70/15/10/2@5"];

  numberOfpicks = [3, 4, 5, 6];
  payout = "";
  picks = "";
  activeInput = "";
  headers = new Headers();
  optionHeader: any;
  sport: string;
  funds = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public toast: ToastController,
    public event: Events,
    public loadingCtrl: LoadingController,
    public emailComposer: EmailComposer,
    public global: Global,
    private network: Network,
    private socialSharing: SocialSharing,
    private fundObservable: FundObservable
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });

    this.loading = this.loadingCtrl.create({
      content: "Please Wait...",
    });

    this.loading.present();
    this.createflag = this.navParams.get("create");
    this.sport = this.navParams.get("sport");
    this.getGames();
    if (this.createflag == "cc") {
      this.customflag = true;
    }
    // this.name = this.navParams.get('name').toUpperCase();
    this.continuestr = 0;
    // this.fund = localStorage.getItem("fund");
    // var a = parseFloat(this.fund);
    // a = Math.floor(a);
    // this.fund = this.fund==null?"0":a.toString();
    // event.subscribe('user:fund',() => {
    //     this.fund = localStorage.getItem("fund");
    //     var a = parseFloat(this.fund);
    //     a = Math.floor(a);
    //     this.fund = this.fund==null?"0":a.toString();
    // });
    event.subscribe("user:upgrade", () => {
      this.upgrade = 1;
    });
    this.upgrade = localStorage.getItem("upgrade") == "1" ? 1 : 0;
    this.prevgamearr = ["10", "25", "50", "100", "-1"];
    this.prevteamarr = ["6", "10"];
    this.prevplayerarr = ["1", "5", "9"];

    let date = new Date().toISOString();
    let estDate = moment.tz(date, "America/New_York");

    this.currentDate = moment(estDate).format("MMDDYY");
    var saveData = JSON.parse(localStorage.getItem("saveCreateData"));
    if (saveData && this.navParams.get("name") in saveData) {
      this.playerc = saveData[this.navParams.get("name")].player;
      this.teamc = saveData[this.navParams.get("name")].team;
      this.gamec = saveData[this.navParams.get("name")].game;
    }
    network.onDisconnect().subscribe(
      (data) => {
        //console.log("unconnect");
        //console.log(data)
        this.loading.dismiss();
      },
      (error) => console.error(error)
    );
  }
  show(dropdownName) {
    this.canSee = dropdownName;
  }
  hide() {
    this.canSee = "";
  }
  toggle(dropdownName) {
    this.canSee = this.canSee == dropdownName ? "" : dropdownName;
  }
  activateInput(input) {
    this.activeInput = input;
  }
  deActivateInput() {
    this.activeInput = "";
  }
  setValue(key, value) {
    this[key] = value;
    this.hide();
  }
  closefundmodal() {
    this.fundmodalflag = false;
  }
  postRequestPremium() {
    if (
      this.createflag &&
      (this.playerc == 0 || this.teamc == 0 || this.gamec == 0)
    ) {
      this.showToast("Please input correct values.");
      return;
    }
    if (
      this.createflag &&
      (this.playerc == null || this.teamc == null || this.gamec == null)
    ) {
      this.showToast("Please input correct values.");
      return;
    }

    //var saveData = JSON.parse(localStorage.getItem("saveCreateData"));
    if (this.challengeName == null || this.challengeName == "") {
      this.showToast("Please input callenge name.");
      return;
    }
    this.checkGameRules();
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

  /**
   * Navigate to join contest page
   */
  goToJoinContest() {
    this.navCtrl.push(JoinContestPage);
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
  goToMakePickPage() {
    this.navCtrl.push(ContestSelectPage, {
      sport: this.sport,
      player: this.playerc,
      team: this.teamc,
      game: this.gamec,
      sportinfo: this.sportinfo,
      joinflag: true,
      create: this.createflag,
      commingFromCustom: true,
      challengeName: this.challengeName,
    });
  }
  goToContestMainPage() {
    this.navCtrl.setRoot(ContestMainPage);
  }
  goToInviteChallenger() {
    this.navCtrl.push(invitePage, {
      menu: false,
      contestid: this.currentcontestid,
      gameType: this.global.gameType,
      invitelimit: parseInt(this.playerc),
    });
  }
  getGames() {
    let games = [],
      counter = 0,
      newGameArry = [];
    if (this.sport == "SX") {
      //   let sports = [
      //     "NHL",
      //     "NBA",
      //     "NCAAB",
      //     "MLB",
      //     "NFL",
      //     "NCAAF",
      //     "GOLF",
      //     "NASCAR",
      //   ]; by sunil
      let sports = ["NFL", "NCAAF"];
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
                this.sportinfo = newGameArry.sort(
                  (a, b) =>
                    moment(a.MatchTime).valueOf() -
                    moment(b.MatchTime).valueOf()
                );
                this.loading.dismiss();
                console.log(this.sportinfo);
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
          `${Details.URL}/contest/todaygame/${this.sport.toLowerCase()}`,
          this.optionHeader
        )
        .subscribe(
          (res) => {
            let response = JSON.parse(res["_body"]);
            this.sportinfo = response;
            // order by date
            this.sportinfo = this.sportinfo.sort(
              (a, b) =>
                moment(a.MatchTime).valueOf() -
                moment(b.MatchTime).valueOf()
            );
            this.loading.dismiss();
            console.log(this.sportinfo);
          },
          (e) => {
            console.log(e);
            this.loading.dismiss();
          }
        );
    }
  }
  checkGameRules() {
    console.log(
      "est",
      moment.tz(moment(), "America/New_York").format("YYYY-MM-DD HH:mm")
    );
    console.log("current", moment().format("YYYY-MM-DD HH:mm"));
    var tempsportinfo = [];
    let date = new Date().toISOString();
    let estDate = moment.tz(date, "America/New_York");
    let ESTTime = moment(estDate).format("HH:mm");
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
      // endpoint is returing MachtTime like 2019-09-13T23:05:00.000Z so for some reazon it doesnt work when try to parse to EST so i add 2 hours more
      let finalTime = new Date(element.MatchTime).toUTCString();
      //   element.MatchTime = moment.utc(finalTime).subtract(5, 'hours').toDate()
      //   element.parsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MM/DD/YYYY hh:mm A');
      element.parsedTime = moment
        .tz(finalTime, "America/New_York")
        .format("MM/DD/YYYY hh:mm A");
      //   element.Odds=JSON.parse(element.Odds[0])
      // nfl and ncaaf rules
      if (this.sport == "NFL" || this.sport == "NCAAF" || this.sport == "SX") {
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
            if (moment(ESTTime, "HH:mm").isAfter(moment(startTime, "HH:mm"))) {
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
      else if (
        this.sport == "MLB" ||
        this.sport == "NCAAB" ||
        this.sport == "NHL" ||
        this.sport == "NBA"
        // || this.sport=="SX" by sunil
      ) {
        month = new Date(element.parsedTime).getMonth() + 1;
        // convertDate=new Date(element.MatchTime).getFullYear()+'-'+month+'-'+new Date(element.MatchTime).getDate()
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
      if (
        this.sport == "MMA" ||
        this.sport == "NASCAR" ||
        this.sport == "GOLF"
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
    });
    this.sportinfo = tempsportinfo;
    console.log(this.sportinfo);
    if (this.sportinfo.length < this.teamc) {
      this.showToast(
        "Please choose another option there are not enough games for this option."
      );
      return;
    } else {
      // let user = localStorage.getItem("loggedUser");
      // user=JSON.parse(user);
      // let postParams = {
      //     userid: user['_id'],
      //     checkedgroup:JSON.stringify([]),
      //     name: this.sport,
      //     team: this.teamc,
      //     player: this.playerc,
      //     game_id: this.currentDate,
      //     game: this.gamec,
      //     create:this.createflag,
      //     contestname:this.challengeName,
      //     payoutoption:1,
      //     inviteflag:this.inviteToggle
      // };
      this.goToMakePickPage();
      // console.log(postParams)
      // create custom challenge
      //     this.http.post(Details.URL+"/contest/register_game2", postParams, this.optionHeader)
      //     .subscribe(data => {
      //         console.log(JSON.parse(data['_body'])['message'])
      //         this.currentcontestid = JSON.parse(data['_body'])['message']['_id'];
      //         this.challengeSaved=true;
      //     }, error => {
      //         console.log(error);// Error getting the data
      // });
    }
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
}
