import { Component, ViewChild } from "@angular/core";
import {
  Nav,
  Platform,
  Events,
  MenuController,
  ToastController,
} from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { HomePage } from "../pages/home/home";
import { LoginPage } from "../pages/login/login";
import { NotificationPage } from "../pages/notification/notification";
import { RulesPage } from "../pages/rules/rules";
import { CreateContestPage } from "../pages/create-contest/create-contest";
import { SocialSharing } from "@ionic-native/social-sharing";
import { AlertController } from "ionic-angular";
import { Socket } from "ng-socket-io";
import { Global } from "../services/Global";
import { OneSignal } from "@ionic-native/onesignal";
import { Http, Headers, RequestOptions } from "@angular/http";
import { environment as Details } from "../environment";
import { ContestChatPage } from "../pages/contest-chat/contest-chat";
import { WithdrawPage } from "../pages/withdraw/withdraw";
import { ConfirmEmailPage } from "../pages/confirm-email/confirm-email";
import { HowToPlayMainPage } from "../pages/how-to-play-main/how-to-play-main";
import { TermsPage } from "../pages/terms/terms";
import { FundObservable } from "../services/fundObservable";
import { TabsPage } from "../pages/tabs/tabs";
import { EditProfilePage } from "../pages/edit-profile/edit-profile";
import { SignUpPage } from "../pages/sign-up/sign-up";
import { ReferFriendPage } from "../pages/refer-friend/refer-friend";

@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  //platformType ="";
  pages: Array<{
    title: string;
    component: any;
    subs: any;
    iconClass: string;
    navParam: string;
  }>;

  loggedUser: any = {};
  username = "";
  upgrade = "";
  shareFlag = false;
  notifiBadgetNum = 0;

  facebookIOS: string =
    "https://itunes.apple.com/us/app/facebook/id284882215?mt=8";
  facebookANDROID: string =
    "https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en";

  emailIOS: string =
    "https://itunes.apple.com/us/app/email-edison-mail/id922793622?mt=8";
  emailANDROID: string = "https://play.google.com/store/search?q=email";

  twitterIOS: string =
    "https://itunes.apple.com/us/app/twitter/id333903271?mt=8";
  twitterANDROID: string =
    "https://play.google.com/store/apps/details?id=com.twitter.android&hl=en";

  googleNumber = "710341494776";
  platformType = "";
  // showAddToHomeScreenPopup =  false;
  // addToHomeScreenIcon = "";
  headers = new Headers();
  optionHeader: any;
  showEditAlert: boolean = false;
  rcode: string = "";
  public user: any;
  public static logout = () => {};

  constructor(
    private alertCtrl: AlertController,
    public share: SocialSharing,
    public event: Events,
    public platform: Platform,
    public toast: ToastController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public socket: Socket,
    public menuCtrl: MenuController,
    private global: Global,
    private oneSignal: OneSignal,
    public http: Http,
    public fundObservable: FundObservable
  ) {
    MyApp.logout = this.logout.bind(this);
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    // show or hide the phone alert

    this.user = JSON.parse(localStorage.getItem("loggedUser"));

    this.socket.on("message:received", (event) => {
      if(this.user && event.message.author._id !== this.user._id) {
        this.global.badgeChatCount += this.global.badgeChatCount;
      }
    });

    this.fundObservable.showEditAlert.subscribe(
      (res) => {
        this.showEditAlert = res;
      },
      (e) => {
        console.log(e);
      }
    );
    this.platform.ready().then(() => {
      localStorage.setItem("upgrade", "1"); // upgrade feature just free app for all users

      if (this.splashScreen) {
        setTimeout(() => {
          socket.connect();

          socket.on("connect", () => {
            console.log("connect websocket");
          });
          this.splashScreen.hide();
          this.statusBar.styleDefault();
          if (platform.is("ios")) {
            statusBar.hide();
          }

          if (localStorage.getItem("loggedUser") != null) {
            var user = localStorage.getItem("loggedUser");
            this.loggedUser = JSON.parse(user);
            this.getFriendBadge();
            socket.on(
              "force-close-session-id." + this.loggedUser._id,
              this.logout.bind(this)
            );
            socket.emit("is-state-account-valid", this.loggedUser._id);
            this.rcode = this.loggedUser.rcode;
            this.username =
              this.loggedUser.username || this.loggedUser.displayname;
            this.showEditAlert =
              this.loggedUser.phone && this.loggedUser.phone != ""
                ? false
                : true;
            this.fundObservable.setEditAlert(this.showEditAlert);
            let myInterval = setInterval(() => {
              /*this.socket.emit('notifications', JSON.parse(localStorage.getItem("loggedUser"))._id);
              this.socket.on('new-notifications', (data) => {
                this.global.notifiBadget = [...data];
                //this.notifiData = [...data]
              })*/
              //   var headers = new Headers();
              //   headers.append("Accept", 'application/json');
              //   headers.append('Content-Type', 'application/json' );
              //   let options = new RequestOptions({ headers: headers });
              let postParams = {
                userid: this.loggedUser["_id"],
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
                        this.fundObservable.setFundNotification(
                          Number(data1.balance)
                        );
                        this.global.notifiBadget = [...data1.contestlist];
                      }
                    }
                  },
                  (error) => {
                    console.error(error);
                  }
                );
                this.getFriendBadge();

            }, 20000);
            localStorage.setItem("myInterval", myInterval.toString());
          }
          events.subscribe("user:upgrade", () => {
            this.pages = [
              {
                title: "My Account",
                component: TabsPage,
                iconClass: "person",
                subs: [],
                navParam: "myAccount",
              },
              {
                title: "My Challenges",
                component: TabsPage,
                iconClass: "calendar",
                subs: [],
                navParam: "goChallenges",
              },
              {
                title: "Withdraw",
                component: WithdrawPage,
                iconClass: "logo-usd",
                subs: [],
                navParam: "",
              },
              // {title: 'Share', component: HomePage, iconClass: 'share', subs: [
              // ], navParam:'Share'
              // },
              {
                title: "Notification",
                component: NotificationPage,
                iconClass: "ios-notifications",
                subs: [],
                navParam: "",
              },
              {
                title: "How To Play",
                component: TabsPage,
                iconClass: "help",
                subs: [],
                navParam: "",
              },
              // {title: 'Account settings', component: AccountsettingPage, iconClass: 'md-settings', subs: [], navParam:''},
              {
                title: "About",
                component: HomePage,
                iconClass: "md-information-circle",
                subs: [
                  {
                    title: "Terms",
                    component: TermsPage,
                  },
                  {
                    title: "Privacy",
                    component: RulesPage,
                  },
                ],
                navParam: "",
              },

              {
                title: "Sign Out",
                component: HomePage,
                iconClass: "md-log-out",
                subs: [],
                navParam: "",
              },
            ];
          });

          var upgrade = localStorage.getItem("upgrade");
          events.subscribe("user:loggedIn", () => {
            var user = localStorage.getItem("loggedUser");
            this.loggedUser = JSON.parse(user);
            this.username =
              this.loggedUser.username || this.loggedUser.displayname;
          });
          // used for an example of ngFor and navigation
          if (upgrade == "1") {
            this.pages = [
              {
                title: "My Account",
                component: TabsPage,
                iconClass: "person",
                subs: [],
                navParam: "myAccount",
              },
              {
                title: "My Challenges",
                component: TabsPage,
                iconClass: "calendar",
                subs: [],
                navParam: "goChallenges",
              },
              {
                title: "Withdraw",
                component: WithdrawPage,
                iconClass: "logo-usd",
                subs: [],
                navParam: "",
              },
              // {title: 'Share', component: HomePage, iconClass: 'share', subs: [], navParam:'Share'},
              {
                title: "Notification",
                component: NotificationPage,
                iconClass: "ios-notifications",
                subs: [],
                navParam: "",
              },
              {
                title: "How To Play",
                component: TabsPage,
                iconClass: "help",
                subs: [],
                navParam: "goHowToPlay",
              },
              // {title: 'Account settings', component: AccountsettingPage, iconClass: 'md-settings', subs: [], navParam:''},
              {
                title: "About",
                component: HomePage,
                iconClass: "md-information-circle",
                subs: [
                  {
                    title: "Terms",
                    component: TermsPage,
                  },
                  {
                    title: "Privacy",
                    component: RulesPage,
                  },
                ],
                navParam: "",
              },

              {
                title: "Sign Out",
                component: HomePage,
                iconClass: "md-log-out",
                subs: [],
                navParam: "",
              },
            ];
          } else {
            this.pages = [
              {
                title: "Upgrade",
                component: CreateContestPage,
                iconClass: "md-arrow-round-up",
                subs: [],
                navParam: "",
              },
              {
                title: "Withdraw",
                component: WithdrawPage,
                iconClass: "logo-usd",
                subs: [],
                navParam: "",
              },
              // {title: 'Share', component: HomePage, iconClass: 'share', subs: [], navParam:'Share'},
              {
                title: "Notification",
                component: NotificationPage,
                iconClass: "ios-notifications",
                subs: [],
                navParam: "",
              },
              {
                title: "How To Play",
                component: HowToPlayMainPage,
                iconClass: "help",
                subs: [],
                navParam: "goHowToPlay",
              },
              // {title: 'Account settings', component: AccountsettingPage, iconClass: 'md-settings', subs: [], navParam:''},
              {
                title: "About",
                component: HomePage,
                iconClass: "md-information-circle",
                subs: [
                  {
                    title: "Terms",
                    component: TermsPage,
                  },
                  {
                    title: "Privacy",
                    component: RulesPage,
                  },
                ],
                navParam: "",
              },

              {
                title: "Sign Out",
                component: HomePage,
                iconClass: "md-log-out",
                subs: [],
                navParam: "",
              },
            ];
          }
        }, 100);
      }

      const activationCode = this.checkForActivationCodeInURL();
      this.checkForReferCode();
      if (activationCode && localStorage.getItem("loggedUser") == null) {
        this.nav.setRoot(ConfirmEmailPage, { activationCode });
      } else {
        this.platformType = "DEVICE";
      }
    });
    this.socket.on("connect-user", (data) => {
      var flag = false;
      for (var i = 0; i < this.global.statusList.length; i++) {
        if (this.global.statusList[i].userid == data.userid) {
          flag = true;
          this.global.statusList[i] = data;
        }
      }
      if (!flag) this.global.statusList.push(data);
    });
  }

  checkForActivationCodeInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const activationCode = urlParams.get("activation_code");
    return activationCode || null;
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            this.menuCtrl.close();
          },
        },
        {
          text: "OK",
          handler: function () {
            this.logout();
          }.bind(this),
        },
      ],
    });
    alert.present();
  }

  private logout() {
    this.socket.disconnect();
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json' );
    // let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid: user["_id"],
      playerid: user["playerid"],
    };
    clearInterval(parseInt(localStorage.getItem("myInterval")));
    this.http
      .post(Details.URL + "/auth/signout", postParams, this.optionHeader)
      .subscribe((data) => {
        localStorage.removeItem("showAddHomePoup");
        localStorage.removeItem("homeInitialize");
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("myInterval");
        localStorage.removeItem("upgrade");
        localStorage.removeItem("account");
        localStorage.removeItem("token");
        localStorage.removeItem("fund");
        localStorage.removeItem("gameType");
        this.loggedUser = {
          username: "",
        };
        this.menuCtrl.close();

        this.nav.setRoot(LoginPage);
      });
  }

  initializeApp() {}

  hideSplashScreen() {}

  openPage(page) {
    this.nav.push(page.component, { nav: page.navParam });
  }

  sharesocial(inx) {
    let appURL;
    appURL =
      (<any>window).location.hostname == "localhost"
        ? "https://app.sporthitter.test123.dev"
        : (<any>window).location.hostname;
    switch (inx) {
      case 0: //email
        // if(this.platformType==='BROWSER'){
        //     (<any>window).location.href=(<any>window).encodeURI("mailto:?subject=Check Out this new SportHitters app for Sports fans&body=Check Out this new SportHitters app for Sports fans https://app.sporthitters.com/")
        // }else{
        //     this.share.canShareViaEmail().then(() => {
        //         this.share.shareViaEmail('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', 'Subject', ['recipient@example.org'],[],[]).then(() => {
        //         }).catch((err) => {
        //             alert(err)
        //         });
        //     }).catch((err1) => {
        //         alert(err1)
        //     });
        // }
        // (<any>window).location.href=(<any>window).encodeURI("mailto:?subject=Check Out this new SportHitters app for Sports fans&body=Check Out this new SportHitters app for Sports fans https://app.sporthitters.com/")
        /* this.menuCtrl.close();
                localStorage.setItem('keep-footer-bar','true')
                this.nav.push(TabsPage)*/
        this.menuCtrl.close();
        this.nav.push(ReferFriendPage);

        break;

      case 1: //SMS
        //canShareVia(appName, message, subject, image, url)
        // if(this.platformType==='BROWSER'){
        //     if(this.platform.is('android')){
        //         (<any>window).location.href=(<any>window).encodeURI("sms:?body=Check Out this new SportHitters app for Sports fans!\nhttps://app.sporthitters.com/")
        //     }else if(this.platform.is('ios')){
        //         (<any>window).location.href=(<any>window).encodeURI("sms://+1/&body=Check Out this new SportHitters app for Sports fans!\nhttps://app.sporthitters.com/")
        //     }else{
        //         // do nothing
        //     }
        // }else{
        //     this.share.canShareVia("","","").then(() => {
        //         // Sharing via email is possible
        //         //console.log("Sharing via email is possible");
        //     }).catch(() => {
        //         // Sharing via email is not possible
        //         //console.log("Sharing via email is impossible");
        //     });
        //     //shareViaSMS(messge, phoneNumber)
        //     this.share.shareViaSMS('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '').then(() => {
        //         // Success!
        //     }).catch(() => {
        //     // Error!
        //     });
        // }
        this.rcode = this.loggedUser.rcode;
        console.log(this.platformType);
        if (this.platform.is("android")) {
          (<any>window).location.href = (<any>window).encodeURI(
            `sms:?body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\n${appURL}/?rcode=${this.rcode}`
          );
        } else if (this.platform.is("ios")) {
          (<any>window).location.href = (<any>window).encodeURI(
            `sms:&body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\n${appURL}/?rcode=${this.rcode}`
          );
        }
        break;

      case 2: //Facebook
        var facebookWindow = window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${appURL}/?rcode=${this.rcode}`,
          "facebook-popup",
          "height=350,width=600"
        );
        if (facebookWindow.focus) {
          facebookWindow.focus();
        }
        // this.share.canShareVia("facebook","","").then(() => {
        //     // Sharing via email is possible
        //     //console.log("Sharing via email is possible");
        //     this.share.shareViaFacebook('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '','').then(() => {
        //         // Success!
        //     }).catch(() => {
        //     // Error!
        //     });
        // }).catch(() => {
        //     // Sharing via email is not possible
        //     //console.log("Sharing via email is impossible");
        //     let msg = "Please install facebook app.";
        //     let toast = this.toast.create({
        //         message: msg,
        //         duration: 2000
        //     });
        //     toast.present();
        //     setTimeout(() => {
        //         if(this.platform.is('ios')){
        //             (<any>window).open(this.facebookIOS, "_system");
        //         }else{
        //             (<any>window).open(this.facebookANDROID, "_system");
        //         }
        //     },1000);
        // });

        break;

      case 3: //twitter
        var twitterWindow = window.open(
          `https://twitter.com/share?text=Join me on SportHitters for Daily Sports Challenges. Signup with my link.&url=${appURL}/?rcode=${this.rcode}`,
          "twitter-popup",
          "height=350,width=600"
        );
        if (twitterWindow.focus) {
          twitterWindow.focus();
        }
        //shareViaTwitter(message, image, url)
        // this.share.canShareVia("twitter","","").then(() => {
        //     // Sharing via email is possible
        //     //console.log("Sharing via email is possible");
        //     this.share.shareViaTwitter('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '', '').then(() => {
        //         // Success!
        //     }).catch(() => {
        //     // Error!
        //     });
        // }).catch(() => {
        //     // Sharing via email is not possible
        //     let msg = "Please install twitter app.";
        //     let toast = this.toast.create({
        //         message: msg,
        //         duration: 2000
        //     });
        //     toast.present();
        //     setTimeout(() => {
        //         if(this.platform.is('ios')){
        //             (<any>window).open(this.twitterIOS, "_system");
        //         }else{
        //             (<any>window).open(this.twitterANDROID, "_system");
        //         }
        //     },1000);

        // });

        break;

      default:
        this.shareFlag = false;
        break;
    }
  }

  getFriendBadge() {
    this.http
      .get(
        `${Details.URL}/fav/badgefriendcount`,
        this.optionHeader
      )
      .subscribe(
        (data) => {
          var data1 = JSON.parse(data["_body"]);
          if (data1 != "err") {
            this.global.badgeFriendCount = data1.badgeFriendCount || 0;
          }
        },
        (error) => {
          console.log(error);// Error getting the data
        }
      );
  }

  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  toggleGroup(group) {
    if (group.title == "Sign Out") {
      this.presentConfirm();
    } else if (group.title == "About") {
      group.show = !group.show;
      //this.menuCtrl.close();
    } else if (group.title == "Upgrade") {
      this.nav.push(CreateContestPage, { menu: true, tab: false });
      this.menuCtrl.close();
    } else if (group.title == "Share") {
      this.shareFlag = true;
      this.menuCtrl.close();
    } else if (group.navParam == "customer") {
      this.nav.push(ContestChatPage, { customer: true });
      // alert("Please contact us @support@sporthitters.com. \n we are currently waiting for Apple Approval  to have in App Chat Customer Service.");
      this.menuCtrl.close();
    } else {
      // create a localstorage to set keep the tabs on click menu nav
      if (group.navParam == "goChallenges") {
        localStorage.setItem("goChallenges", "true");
      } else if (group.navParam == "goHowToPlay") {
        localStorage.setItem("goHowToPlay", "true");
      } else if (group.navParam == "myAccount") {
        localStorage.setItem("myAccount", "true");
        console.log(localStorage.getItem("myAccount"));
      }
      this.nav.push(group.component);
      this.menuCtrl.close();
    }
  }

  isSubmenuShown(group) {
    return group.show;
  }
  gotoEdit() {
    this.nav.push(EditProfilePage);
    this.menuCtrl.close();
  }

  checkForReferCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const rcode = urlParams.get("rcode");
    if (rcode != null) {
      this.nav.setRoot(SignUpPage, { rcode: rcode });
    }
  }
  // Detects if device is in standalone mode
  // isInStandaloneMode = () => ('standalone' in (<any>window).navigator) && ((<any>window).navigator.standalone);

  // addToHomeScreenPopup() {
  //     if (this.platform.is('mobileweb') && !this.isInStandaloneMode()) {
  //         // the app is in PWA mode, we proceed to detect device and browser support:
  //         const userAgent = window.navigator.userAgent.toLowerCase();
  //         if (/iphone|ipad|ipod/.test(userAgent)) {
  //             //code for "add to desktop" for IOS:
  //             this.addToHomeScreenIcon = "ios-share-outline";
  //             this.showAddToHomeScreenPopup = true;

  //         }
  //         // else if (/android/.test(userAgent)) {
  //         //     //code for "add to desktop" for Android:
  //         //     this.addToHomeScreenIcon = "md-more";
  //         //     this.showAddToHomeScreenPopup = true;
  //         // }
  //     }
  // }

  // closeAddToHomeScreenPopup(){
  //     // alert("tested");
  //     this.showAddToHomeScreenPopup = false;
  // }
}
