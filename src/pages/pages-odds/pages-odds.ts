import { Component } from "@angular/core";
import {
  NavController,
  ModalController,
  Events,
  LoadingController,
  ToastController,
  MenuController,
  Platform,
} from "ionic-angular";
import { FavouritesPage } from "./../favourites/favourites";
import { FundfirstPage } from "./../fundfirst/fundfirst";
import { LoginPage } from "./../login/login";
import { ContestChatPage } from "./../contest-chat/contest-chat";
import { FavoriteDetailPage } from "./../favorite-detail/favorite-detail";
import { Http, RequestOptions, Headers } from "@angular/http";
import {environment as Details} from '../../environment';
import { Network } from "@ionic-native/network";
import { Global } from "../../services/Global";
import { Socket } from "ng-socket-io";
import moment from "moment-timezone";
declare var FS: any;
import { FundObservable } from "../../services/fundObservable";
import { ContestMainPage } from "../contest-main/contest-main";
import { ConfirmEmailPage } from "../confirm-email/confirm-email";
import { isCordovaAvailable } from "../../is-cordova-available";
import { OneSignal } from "@ionic-native/onesignal";
import { NotificationPage } from "../notification/notification";
import { ReferFriendPage } from "../refer-friend/refer-friend";
import { MyAccountPage } from "./../my-account/my-account";
import { ChallengeHomePage } from "./../challenge-home/challenge-home";
import { PromoHomePage } from "./../promo-home/promo-home";
import { HowToPlayPage } from "../how-to-play/how-to-play";

@Component({
  selector: "page-pages-odds",
  templateUrl: "pages-odds.html",
})
export class PagesOddsPage {
  // fund = "";
  funds: number = 0;
  userinfo: any;
  loading: any;

  searchWord = "";
  searcheduserlist = [];
  search: string;
  ids = [];
  userlist = [];
  banner: boolean;
  scores = [];
  sarray = [];

  notifiBadgetNum = 0;
  gamesByWeek = [];
  headers = new Headers();
  optionHeader: any;
  showGame2MinAgo = [];
  menuObj;
  sportsImageURL = {
    nhl: "./assets/img/icons-sports/Group 151.svg",
    nfl: "./assets/img/Group 154.svg",
    nba: "./assets/img/icons-sports/Path 543.svg",
    ncaaf: "./assets/img/icons-sports/Group 158.svg",
    golf: "./assets/img/icons-sports/Group 156.svg",
    ncaab: "./assets/img/icons-sports/Group 159.svg",
    nascar: "./assets/img/icons-sports/Group 162.svg",
    mlb: "./assets/img/icons-sports/Path 544.svg",
    mma: "./assets/img/Group 231.svg",
  };
  sportsImageURLOtherColor = {
    nhl: "./assets/img/icons-sports/Group 100.svg",
    nfl: "./assets/img/Group 120.svg",
    nba: "./assets/img/icons-sports/Path 316.svg",
    ncaaf: "./assets/img/icons-sports/Group 121.svg",
    golf: "./assets/img/icons-sports/Group 135.svg",
    ncaab: "./assets/img/icons-sports/Group 123.svg",
    nascar: "./assets/img/icons-sports/Group 138.svg",
    mlb: "./assets/img/icons-sports/Path 535.svg",
    mma: "./assets/img/Group 230.svg",
  };
  sportEnable = [];
  allSportGames = [];
  isActive: string = "all";
  sportGames = [];
  showAddToHomeScreenPopup: boolean = false;
  addToHomeScreenIcon = "";
  platformType = "";
  OnesignalAppIdDev = "e4402010-d0b9-408b-8b83-d82694537d7b"; // "de069e3d-d582-418a-93da-bd917708dadf";//
  OnesignalAppIdstage = "94e6fadc-ac73-4b8e-a07f-8b44d9fadcda";
  OnesignalAppIdProd = "78931abd-3b8e-470c-bf4d-65c953aa03c4"; //new setup 8/14/19 ols assigned //old one c293683b-4491-416f-bdb1-61aa45597275
  OnesignalAppIdLocal = "b2ea7ecc-4b1d-4352-a1e3-9adb6f440b04"; //MyLocal -> http://localhost:8100;
  googleNumber = "710341494776";
  constructor(
    public http: Http,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public event: Events,
    public loadingCtrl: LoadingController,
    private toast: ToastController,
    public menuCtrl: MenuController,
    public network: Network,
    public socket: Socket,
    public global: Global,
    public fundObservable: FundObservable,
    public platform: Platform,
    private oneSignal: OneSignal
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.menuCtrl.enable(true, "myMenu");

    // get menu
    this.http.get(`${Details.URL}/admin/getmenu`).subscribe(
      (res) => {
        this.menuObj = JSON.parse(res["_body"]);
        this.menuObj = this.menuObj.map((item) => {
          item.game = item.game.toLowerCase();
          return item;
        });
        this.menuObj.sort((a, b) => (a.priority > b.priority ? 1 : -1));
      },
      (e) => {
        console.log(e);
      }
    );
    // function to point to challenges page and keep the tabs.
    // i fixed the issue creating a localstore and redirect from this page to challenges.
    if (localStorage.getItem("goChallenges") == "true") {
      localStorage.removeItem("goChallenges");
      this.navCtrl.push(ContestMainPage);
    }
    if (localStorage.getItem("keep-footer-bar") == "true") {
      localStorage.removeItem("keep-footer-bar");
      this.navCtrl.push(ReferFriendPage);
    }
    this.loading = loadingCtrl.create({
      content: "Please Wait...",
    });
    this.loading.present();
    /*Call API for Account Balance*/
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.http
      .get(Details.URL + "/account_info/" + id, this.optionHeader)
      .subscribe(
        (res) => {
          if (res) {
            let resJson = JSON.parse(res["_body"]);
            // This is an example script - don't forget to change it!
            FS.identify(resJson.user._id, {
              displayName: resJson.user.username,
              // TODO: Add your own custom user variables here, details at
              // http://help.fullstory.com/develop-js/setuservars
              reviewsWritten_int: 14,
            });
            // this.fund = JSON.parse(res['_body']).accountBalance;
            // localStorage.setItem("fund", this.fund.toString());
            // this.fundObservable.setFund(this.fund.toString())
          }
        },
        (error) => {
          //console.log(error);
        }
      );

    this.http
      .get(Details.URL + "/show_banner", this.optionHeader)
      .subscribe((response) => {
        if (response) {
          var value = JSON.parse(response["_body"])[0];
          var showdata = value.showBanner;
          this.banner = showdata;
        }
      });
    this.userinfo = JSON.parse(localStorage.getItem("loggedUser"));

    if (this.userinfo == null) {
      this.navCtrl.setRoot(LoginPage);
    }
    this.getSports();
    this.search = "hide";
  }

  onSearch() {
    this.searcheduserlist = [];
    if (this.searchWord == "") {
      return;
    }
    this.userlist.forEach((element) => {
      var tempname = (
        (element.username ? element.username : element.displayname) || ""
      ).toLowerCase();
      if (tempname.search(this.searchWord.toLowerCase()) != -1) {
        var flag = false;
        this.ids.forEach((element1) => {
          if (element1 == element._id) {
            flag = true;
          }
        });
        if (flag == false) this.searcheduserlist.push(element);
      }
    });
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  goDetail(user, inx) {
    this.navCtrl.push(FavoriteDetailPage, {
      userid: user._id,
      username: user.username,
      fav: 0,
      score: this.scores[inx],
      sarray: this.sarray,
    });
  }

  onSearchCancel() {
    this.search = "hide";
    this.searchWord = "";
    this.searcheduserlist = [];
  }

  onSearchShow() {
    this.search = "show";
  }

  getSports() {
    /** Get Sports - Promise **/
    this.doReflex();
  }

  doReflex() {
    let promise_array: Array<any> = [];
    promise_array.push(
      new Promise((resolve, reject) =>
        this.http
          .get(Details.URL + "/contest/todaygame", this.optionHeader)
          .subscribe(response => {
            let sports = JSON.parse(response["_body"]);
            let date = new Date().toISOString();
            let estDate = moment.tz(date, "America/New_York");
            let ESTTime = moment(estDate).format("HH:mm");
            let startDate = moment(estDate).format("YYYY-MM-DD");
            let startTime = moment("05:01", "HH:mm");
            let endDate;
            let convertDate,
              month,
              todayDay = moment().day();
            // get total day for a week
            // sunday
            if (todayDay == 0) {
              endDate = moment(startDate, "YYYY-MM-DD").add(2, "days");
            }
            // monday
            if (todayDay == 1) {
              endDate = moment(startDate, "YYYY-MM-DD").add(9, "days");
            }
            if (todayDay == 2) {
              endDate = moment(startDate, "YYYY-MM-DD").add(8, "days");
            }
            if (todayDay == 3) {
              endDate = moment(startDate, "YYYY-MM-DD").add(6, "days");
            }
            if (todayDay == 4) {
              endDate = moment(startDate, "YYYY-MM-DD").add(5, "days");
            }
            if (todayDay == 5) {
              endDate = moment(startDate, "YYYY-MM-DD").add(4, "days");
            }
            if (todayDay == 6) {
              endDate = moment(startDate).add(3, "days");
            }
            try {
              sports.forEach((element, index) => {
                element.game = element.game.toLowerCase();
                if (element.sports.length > 0) {
                  element.sports.forEach((res) => {
                    // let finalTime = moment.tz(res.MatchTime,'America/New_York').add(2, 'hours');
                    let finalTime = new Date(res.MatchTime).toUTCString();
                    // res.MatchTime = moment.utc(finalTime).subtract(5, 'hours').toDate()
                    res.parsedTime = moment
                      .tz(finalTime, "America/New_York")
                      .format("MM/DD/YYYY hh:mm A");
                    // res.parsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MM/DD/YYYY hh:mm A');
                    res.newparsedTime = moment
                      .tz(finalTime, "America/New_York")
                      .format("MMM DD YYYY hh:mm A");
                    // res.newparsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MMM DD YYYY hh:mm A');
                    if (res.Odds) {
                      res.Odds = JSON.parse(res.Odds[0]);
                      if (element.game == "nfl" || element.game == "ncaaf") {
                        month = new Date(res.parsedTime).getMonth() + 1;
                        // convertDate=new Date(res.MatchTime).getFullYear()+'/'+month+'/'+new Date(res.MatchTime).getDate()
                        convertDate =
                          new Date(res.parsedTime).getFullYear() +
                          "/" +
                          month +
                          "/" +
                          new Date(res.parsedTime).getDate();
                        // check for one week games
                        if (
                          moment(moment(convertDate, "YYYY-MM-DD")).isBetween(
                            startDate,
                            endDate
                          )
                        ) {
                          this.gamesByWeek.push(res);
                        } else if (
                          moment(startDate, "YYYY-MM-DD").isSame(
                            moment(convertDate, "YYYY-MM-DD")
                          )
                        ) {
                          // check if it tuesday add rule to only show games after 05:01
                          if (todayDay == 2) {
                            // check if time game is after time start setting by admin
                            if (
                              moment(ESTTime, "HH:mm").isAfter(
                                moment(startTime, "HH:mm")
                              )
                            ) {
                              if (this.checkTime(res.parsedTime)) {
                                this.gamesByWeek.push(res);
                              }
                            }
                          } else {
                            if (this.checkTime(res.parsedTime)) {
                              this.gamesByWeek.push(res);
                            }
                          }
                        }
                        // if(element.game=='nfl'){
                        //   if (moment(moment(convertDate, 'YYYY-MM-DD')).isBetween(startDate, ' 2020-12-31')) {
                        //     this.gamesByWeek.push(res)
                        //   }
                        //   else if (moment(startDate, 'YYYY-MM-DD').isSame(moment(convertDate, 'YYYY-MM-DD'))) {
                        //     // check if it tuesday add rule to only show games after 05:01
                        //     if (todayDay == 2) {
                        //       // check if time game is after time start setting by admin
                        //       if (moment(ESTTime, 'HH:mm').isAfter(moment(startTime, 'HH:mm'))) {
                        //         if (this.checkTime(res.parsedTime)) {
                        //           this.gamesByWeek.push(res)
                        //         }
                        //       }
                        //     }
                        //     else {
                        //       if (this.checkTime(res.parsedTime)) {
                        //         this.gamesByWeek.push(res)
                        //       }
                        //     }
                        //   }
                        // }
                        // else{
                        //   if (moment(moment(convertDate, 'YYYY-MM-DD')).isBetween(startDate, endDate)) {
                        //     this.gamesByWeek.push(res)
                        //   }
                        //   else if (moment(startDate, 'YYYY-MM-DD').isSame(moment(convertDate, 'YYYY-MM-DD'))) {
                        //     // check if it tuesday add rule to only show games after 05:01
                        //     if (todayDay == 2) {
                        //       // check if time game is after time start setting by admin
                        //       if (moment(ESTTime, 'HH:mm').isAfter(moment(startTime, 'HH:mm'))) {
                        //         if (this.checkTime(res.parsedTime)) {
                        //           this.gamesByWeek.push(res)
                        //         }
                        //       }
                        //     }
                        //     else {
                        //       if (this.checkTime(res.parsedTime)) {
                        //         this.gamesByWeek.push(res)
                        //       }
                        //     }
                        //   }
                        // }
                        this.sportGames[index] = {
                          game: element.game,
                          sports: this.gamesByWeek,
                        };
                      }
                      if (
                        element.game == "mlb" ||
                        element.game == "ncaab" ||
                        element.game == "nhl" ||
                        element.game == "nba" ||
                        element.game == "mma" ||
                        element.game == "nascar" ||
                        element.game == "golf"
                      ) {
                        month = new Date(res.parsedTime).getMonth() + 1;
                        // convertDate=new Date(res.MatchTime).getFullYear()+'/'+month+'/'+new Date(res.MatchTime).getDate()
                        convertDate =
                          new Date(res.parsedTime).getFullYear() +
                          "/" +
                          month +
                          "/" +
                          new Date(res.parsedTime).getDate();
                        if (
                          moment(startDate, "YYYY-MM-DD").isSame(
                            moment(convertDate, "YYYY-MM-DD")
                          )
                        ) {
                          if (this.checkTime(res.parsedTime)) {
                            this.showGame2MinAgo.push(res);
                          }
                        } else if (
                          moment(convertDate, "YYYY-MM-DD").isAfter(
                            moment(startDate, "YYYY-MM-DD")
                          )
                        ) {
                          this.showGame2MinAgo.push(res);
                        }
                        // else if(moment(convertDate,'YYYY-MM-DD').isBefore(moment(startDate,'YYYY-MM-DD'))) {
                        //     // nothing here.
                        // }
                        // else if(moment(convertDate,'YYYY-MM-DD').isAfter(moment(startDate,'YYYY-MM-DD'))) {
                        //     this.showGame2MinAgo.push(res)
                        // }
                        // else{
                        //     this.showGame2MinAgo.push(res)
                        // }
                        this.sportGames[index] = {
                          game: element.game,
                          sports: this.showGame2MinAgo,
                        };
                      }
                    }
                  });
                  this.gamesByWeek = [];
                  this.showGame2MinAgo = [];
                }
              });
            } catch (err) {
              console.log(err);
              this.loading.dismiss();
            }
            resolve(this.sportGames);
          })
      )
    );
    Promise.all(promise_array).then((success) => {
      // remove empty array
      let my_array = this.sportGames.filter(function (x) {
        return x !== (undefined || null || "");
      });
      this.sportGames = my_array;
      // ORDER GAMES BY DATES.
      this.sportGames.forEach((res) => {
        res.sports.sort(
          (a, b) =>
            moment(a.MatchTime).valueOf() - moment(b.MatchTime).valueOf()
        );
      });
      this.checkForGames();
      this.allSportGames = this.sportGames;
      this.loading.dismiss();
    });
  }
  /**
   * Navigate to favourite page
   */
  goFavourite() {
    this.navCtrl.push(FavouritesPage, { menu: false });
  }

  chat(item, sport, awayTeam, homeTeam) {
    this.navCtrl.push(ContestChatPage, {
      data: item,
      sport: sport,
      awayTeam: awayTeam,
      homeTeam: homeTeam,
    });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  chatSport(sport) {
    this.navCtrl.push(ContestChatPage, { sport: sport, sportflag: true });
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

  // show all sport enable if they have games
  checkForGames() {
    this.sportGames.forEach(res => {
      if (res.sports.length > 0) {
        this.sportEnable.push(res.game.toLowerCase());
      }
    });
  }

  // filter by sport
  showGamesBySport(sport) {
    this.isActive = sport;
    this.sportGames = [];
    if (sport === 'all') {
      this.sportGames = this.allSportGames;
    } else {
      this.allSportGames.forEach(res => {
        if (sport === res.game) {
          this.sportGames[0] = res;
        }
      });
    }
  }

  // Detects if device is in standalone mode
  isInStandaloneMode = () =>
    "standalone" in (<any>window).navigator &&
    (<any>window).navigator.standalone;
  oneSignalF() {
    if (isCordovaAvailable()) {
      this.oneSignal.startInit(this.OnesignalAppIdProd, this.googleNumber);
      this.oneSignal.inFocusDisplaying(
        this.oneSignal.OSInFocusDisplayOption.InAppAlert
      );
      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        this.global.notifiBadget.push({ user: "badge" });
        this.navCtrl.push(NotificationPage);
      });

      this.oneSignal.endInit();
    }
    if (this.platform.is("core") || this.platform.is("mobileweb")) {
      this.platformType = "BROWSER";
      var oneSignalAppId = "";
      console.log("Inside Dev:" + (<any>window).location.hostname);
      if (
        (<any>window).location.hostname == "localhost" ||
        (<any>window).location.hostname.includes("192.168.2")
      ) {
        console.log("LOCAL");
        oneSignalAppId = this.OnesignalAppIdLocal;
      } else if (
        (<any>window).location.hostname == "app.sporthitter.test123.dev" ||
        (<any>window).location.hostname.includes(
          "3.15.54.158" || "app.sporthitter.test123.dev"
        )
      ) {
        console.log("DEV");
        oneSignalAppId = this.OnesignalAppIdDev;
      } else if ((<any>window).location.hostname == "stageapp.testshiapp.com") {
        console.log("STAGE");
        oneSignalAppId = this.OnesignalAppIdstage;
      } else {
        console.log("PROD");
        oneSignalAppId = this.OnesignalAppIdProd;
      }
      const OneSignal = window["OneSignal"] || [];
      OneSignal.push(() => {
        OneSignal.init({
          appId: oneSignalAppId,
        });
      });
      if (this.platform.is("iphone")) {
        window["getIdsAvailableFromOneSignal"] = () => {
          return Promise.resolve({
            userId: "",
          });
        };
      } else {
        window["getIdsAvailableFromOneSignal"] =
          window["OneSignal"].getIdsAvailable;
      }
      const activationCode = this.checkForActivationCodeInURL();
      if (activationCode) {
        this.navCtrl.setRoot(ConfirmEmailPage, { activationCode });
      }
    } else {
      this.platformType = "DEVICE";
    }
  }

  checkForActivationCodeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const activationCode = urlParams.get("activation_code");
    return activationCode || null;
  }

  gotoChooseAccount() {
    this.navCtrl.push(MyAccountPage);
  }

  gotoChooseChallenges() {
    this.navCtrl.push(ChallengeHomePage);
  }

  gotoChooseResult() {
    this.navCtrl.push(ContestMainPage);
  }

  gotoChoosePromos() {
    this.navCtrl.push(PromoHomePage);
  }

  gotoHowtoplay() {
    this.navCtrl.push(HowToPlayPage);
  }

  getSportOfSameDate(_sports) {
    const sports = _sports as any;
    const dateSports = [];
    for (let sport of sports) {
      const dateGames = {},
        sportN = {};
      sportN["game"] = sport.game;
      sportN["sports"] = [];
      for (let game of sport.sports) {
        if (dateGames[game.newparsedTime]) {
          dateGames[game.newparsedTime].push(game);
        } else {
          dateGames[game.newparsedTime] = [game];
        }
      }
      sportN["sports"] = Object.keys(dateGames).map((date) => {
        return { date, games: dateGames[date] };
      });
      dateSports.push(sportN);
    }

    return dateSports;
  }
}
