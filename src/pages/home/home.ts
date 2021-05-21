import { Component, ViewChild } from "@angular/core";
import {
  NavController,
  ModalController,
  Events,
  LoadingController,
  ToastController,
  MenuController,
  NavParams,
  Platform,
  Slides,
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
import { ChallengeSportListPage } from "../challenge-sport-list/challenge-sport-list";
import { ConfirmEmailPage } from "../confirm-email/confirm-email";
import { isCordovaAvailable } from "../../is-cordova-available";
import { OneSignal } from "@ionic-native/onesignal";
import { NotificationPage } from "../notification/notification";
import { ReferFriendPage } from "../refer-friend/refer-friend";
import { JoinContestPage } from "./../join-contest/join-contest";
import { MyAccountPage } from "./../my-account/my-account";
import { ChallengeHomePage } from "./../challenge-home/challenge-home";
import { PagesOddsPage } from "./../pages-odds/pages-odds";
import { PromoHomePage } from "./../promo-home/promo-home";
import { HowToPlayPage } from "../how-to-play/how-to-play";
import { DomSanitizer } from "@angular/platform-browser";
import { ChallengePicksPage } from "../challenge-picks/challenge-picks";
import { HowToPlayMainPage } from "../how-to-play-main/how-to-play-main";
import { SliderPage } from "../slider/slider";
import { SocialSharing } from "@ionic-native/social-sharing";

@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
export class HomePage {
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
    nhl: "./assets/img/nhl.png",
    nfl: "./assets/img/nfl.png",
    nba: "./assets/img/nba.png",
    ncaaf: "./assets/img/col-football.png",
    golf: "./assets/img/golf.png",
    ncaab: "./assets/img/col-basket.png",
    nascar: "./assets/img/nascar.png",
    mlb: "./assets/img/mlb.png",
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
  showCounter: boolean = false;
  interval;
  hideHours: boolean = false;
  hideDays: boolean = false;
  horizontalText: string = "";
  intervalNews;
  upcomingEvents;
  timers = [];
  intervalTimer = [];
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
    private navParams: NavParams,
    public platform: Platform,
    private oneSignal: OneSignal,
    private sanitization: DomSanitizer,
    public share: SocialSharing
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.menuCtrl.enable(true, "myMenu");
    let homeInitialize = Number(localStorage.getItem("homeInitialize"));
    homeInitialize = homeInitialize + 1;
    localStorage.setItem("homeInitialize", String(homeInitialize));

    if (localStorage.getItem("showAddHomePoup") !== "true") {
      this.addToHomeScreenPopup();
    }
    // get menu
    this.http.get(`${Details.URL}/admin/getmenu`).subscribe(
      (res) => {
        this.menuObj = JSON.parse(res["_body"]);
        this.menuObj.sort((a, b) => (a.priority > b.priority ? 1 : -1));
      },
      (e) => {
        console.log(e);
      }
    );
    // this.getNews();
    this.getEvents();
    // function to point to challenges page and keep the tabs.
    // i fixed the issue creating a localstore and redirect from this page to challenges.
    if (localStorage.getItem("goChallenges") == "true") {
      localStorage.removeItem("goChallenges");
      this.navCtrl.push(ContestMainPage);
    }
    if (localStorage.getItem("myAccount") == "true") {
      localStorage.removeItem("myAccount");
      this.navCtrl.push(MyAccountPage);
    }
    if (localStorage.getItem("goHowToPlay") == "true") {
      localStorage.removeItem("goHowToPlay");
      this.navCtrl.push(HowToPlayPage);
    }
    if (localStorage.getItem("keep-footer-bar") == "true") {
      console.log("here");
      localStorage.removeItem("keep-footer-bar");
      this.navCtrl.push(ReferFriendPage);
    }
    // this.loading = loadingCtrl.create({
    //     content: 'Please Wait...'
    // });
    // this.loading.present();
    /*Call API for Account Balance*/
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.http
      .get(Details.URL + "/account_info/" + id, this.optionHeader)
      .subscribe(
        (res) => {
          // console.log("resssss",res)
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
            // console.log(this.fund)
            // localStorage.setItem("fund", this.fund.toString());
            // this.fundObservable.setFund(this.fund.toString())
          }
        },
        (error) => {
          //console.log(error);
        }
      );
    this.showCounter = false;
    // this.counter()
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
    // this.getSports();
    this.search = "hide";
  }

  getEvents() {
    this.http.get(Details.URL + "/auth/upcomingevents/10").subscribe(
      (res) => {
        let data: any = JSON.parse(res["_body"]);
        data.forEach((element) => {
          element.image = element.image
            ? this.sanitization.bypassSecurityTrustStyle(
                `url(${element.image})`
              )
            : this.sanitization.bypassSecurityTrustStyle(
                'url("../../assets/img/Rectangle 328.png")'
              );
        });
        this.upcomingEvents = data;
        this.upcomingEvents.reverse();
        this.upcomingEvents.forEach((element, index) => {
          if (element.datetime) {
            this.counterTimer(index, element.datetime);
          }
        });
      },
      (e) => {
        console.log(e);
      }
    );
  }

  counterTimer(i, date) {
    let eventTime, currentTime, duration, interval;
    interval = 1000;
    this.timers[i] = { days: 0, hours: 0, mins: 0 };
    date = date.split(".")[0];
    date = moment(date).format("MM/DD/YYYY HH:mm");
    eventTime = moment.tz(date, "America/New_York");
    currentTime = moment.tz("America/New_York").format("MM/DD/YYYY HH:mm");
    duration = moment.duration(eventTime.diff(currentTime));
    this.intervalTimer[i] = setInterval(() => {
      // get updated duration
      duration = moment.duration(duration - interval, "milliseconds");
      if (duration.asSeconds() <= 0) {
        this.timers[i].days = 0;
        this.timers[i].hours = 0;
        this.timers[i].mins = 0;
        clearInterval(this.intervalTimer[i]);
      } else {
        this.timers[i].days =
          duration.days().toString().length > 1
            ? duration.days()
            : [0 + "" + duration.days()];
        this.timers[i].hours =
          duration.hours().toString().length > 1
            ? duration.hours()
            : [0 + "" + duration.hours()];
        this.timers[i].mins =
          duration.minutes().toString().length > 1
            ? duration.minutes()
            : [0 + "" + duration.minutes()];
      }
    }, interval);
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

  getNews() {
    this.http.get(`${Details.URL}/auth/news/20`).subscribe(
      (res) => {
        let news = "";
        let data;
        data = JSON.parse(res["_body"]);
        data.forEach((element) => {
          news += element.title + "&nbsp; &nbsp; <b>&#8226;</b> &nbsp; &nbsp;";
        });
        // setTimeout(() => {
        this.horizontalText = `${news}`;
        // }, 5000);
      },
      (e) => {
        console.error(e);
      }
    );
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
    console.log(
      moment.tz(moment(), "America/New_York").format("YYYY-MM-DD HH:mm")
    );
    let promise_array: Array<any> = [];
    promise_array.push(
      new Promise((resolve, reject) =>
        this.http
          .get(Details.URL + "/contest/todaygame", this.optionHeader)
          .subscribe((response) => {
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
                if (element.sports.length > 0) {
                  element.sports.forEach((res) => {
                    // let finalTime = moment.tz(res.MatchTime,'America/New_York').add(2, 'hours');
                    let finalTime = new Date(res.MatchTime).toUTCString();
                    // res.MatchTime = moment.utc(finalTime).subtract(5, 'hours').toDate()
                    // res.parsedTime = moment.utc(finalTime).subtract(5, 'hours').format('MM/DD/YYYY hh:mm A');
                    res.parsedTime = moment
                      .tz(finalTime, "America/New_York")
                      .format("MM/DD/YYYY hh:mm A");
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
                      this.sportGames[index] = {
                        game: element.game,
                        sports: this.gamesByWeek,
                      };
                    }
                    if (
                      element.game == "mlb" ||
                      element.game == "ncaab" ||
                      element.game == "nhl" ||
                      element.game == "nba"
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
            moment(a.MatchTime).valueOf() -
            moment(b.MatchTime).valueOf()
        );
      });
      this.checkForGames();
      console.log(this.sportGames);
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
    this.sportGames.forEach((res) => {
      if (res.sports.length > 0) {
        this.sportEnable.push(res.game);
      }
    });
  }

  // filter by sport
  showGamesBySport(sport) {
    this.isActive = sport;
    this.sportGames = [];
    if (sport == "all") {
      this.sportGames = this.allSportGames;
    } else {
      this.allSportGames.forEach((res) => {
        if (sport == res.game) {
          this.sportGames[0] = res;
        }
      });
    }
  }

  // Detects if device is in standalone mode
  isInStandaloneMode = () => {
    return "standalone" in (<any>window).navigator &&
      (<any>window).navigator.standalone;
  }

  addToHomeScreenPopup() {
    if (this.platform.is("mobileweb") && !this.isInStandaloneMode()) {
      // the app is in PWA mode, we proceed to detect device and browser support:
      const userAgent = window.navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(userAgent)) {
        //code for "add to desktop" for IOS:
        this.addToHomeScreenIcon = "ios-share-outline";
        this.showAddToHomeScreenPopup = true;
      }
    }
  }

  closeAddToHomeScreenPopup() {
    // alert("tested");
    this.showAddToHomeScreenPopup = false;
    localStorage.setItem("showAddHomePoup", "true");
  }


  checkForActivationCodeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const activationCode = urlParams.get("activation_code");
    return activationCode || null;
  }

  gotoChooseSport(directflag) {
    this.navCtrl.push(JoinContestPage, {
      create: "jc",
      inviteFlag: directflag,
    });
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
  gotoChooseOdds() {
    this.navCtrl.push(PagesOddsPage);
  }
  gotoChoosePromos() {
    this.navCtrl.push(PromoHomePage);
  }
  goto(parameters) {
    this.navCtrl.setRoot(ChallengePicksPage, parameters);
  }
  gotoChallengeList(parameters) {
    this.navCtrl.setRoot(ChallengeSportListPage, parameters);
  }
  gotocustom(parameters) {
    this.navCtrl.push(JoinContestPage, parameters);
  }
  gotoHowtoplay() {
    this.navCtrl.push(HowToPlayPage);
  }
  goToSpecialPromo() {
    this.navCtrl.push(PromoHomePage);
  }
  gotoReferral() {
    this.navCtrl.push(ReferFriendPage);
  }
  mailToSupport() {
    this.platformType = "BROWSER";
    if (this.platformType === "BROWSER") {
      (<any>window).location.href = (<any>window).encodeURI(
        "mailto:support@sporthitters.com?subject=''&body=''"
      );
    } else {
      this.share
        .canShareViaEmail()
        .then(() => {
          this.share
            .shareViaEmail(
              "Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters",
              "Subject",
              ["support@sporthitters.com"],
              [],
              []
            )
            .then(() => {})
            .catch((err) => {
              alert(err);
            });
        })
        .catch((err1) => {
          alert(err1);
        });
    }
  }
  counter() {
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
    eventTime = moment.tz("2020-03-15T11:59:00", "America/New_York");
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
          document.querySelector(".days").innerHTML = days;
        }
        if (!this.hideHours) {
          // document.querySelector('.hours0').innerHTML = hours[0]
          document.querySelector(".hours").innerHTML = hours;
        }
        // document.querySelector('.minutes0').innerHTML = minutes[0]
        document.querySelector(".minutes").innerHTML = minutes;
        // document.querySelector('.seconds0').innerHTML = seconds[0]
        document.querySelector(".seconds").innerHTML = seconds;
      }
    }, interval);
  }
  clearInterval() {
    clearInterval(this.interval);
  }
  ionViewWillUnload() {
    this.clearInterval();
  }
  // clear interval when leave page
  ionViewWillLeave() {
    clearInterval(this.intervalNews);
    // clear event timer
    this.intervalTimer.forEach((element) => {
      clearInterval(element);
    });
  }
  // start interval on page load
  ionViewDidEnter() {
    // this.intervalNews = setInterval(() => {
    //   this.horizontalText = "";
    //   this.getNews();
    // }, 180000);
  }
}
