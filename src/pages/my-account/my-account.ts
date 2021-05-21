import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform, App, LoadingController } from 'ionic-angular';
import {environment as Details} from '../../environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { TabsPage } from './../tabs/tabs';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { LoginProvider } from '../../providers/login/login';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import { CameraOptions, Camera } from '@ionic-native/camera';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FundObservable } from '../../services/fundObservable';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { BonusFundPage } from '../bonus-fund/bonus-fund';
import * as moment from 'moment-timezone';
import { ReferFriendPage } from '../refer-friend/refer-friend';
import { Global } from '../../services/Global';
import { NotificationSettingsPage } from '../notification-settings/notification-settings';

@Component({
  selector: "my-account",
  templateUrl: "my-account.html",
})
export class MyAccountPage {
  form: any = [];
  getUserIds: any;
  platformType: string = "BROWSER";
  public userData: any = [];
  userName: any;
  accountBalance: number = 0;
  pendingFunds: string;
  possiblePrize: string;
  yesterdaysChallenges: string;
  yesterdaysPrize: string;
  headers = new Headers();
  optionHeader: any;
  bonus;
  loading;
  showpopup: boolean = false;
  msg: string;
  header: string;
  hideSignUpBonus: boolean = true;
  fund = 0;
  showdata: boolean = false;
  constructor(
    public platform: Platform,
    public http: Http,
    public appCtrl: App,
    public camera: Camera,
    public share: SocialSharing,
    public navCtrl: NavController,
    private oneSignal: OneSignal,
    public navParams: NavParams,
    public events: Events,
    public signUpService: SignUpProvider,
    public logInService: LoginProvider,
    private toastCtrl: ToastController,
    private googlePlus: GooglePlus,
    private twitter: TwitterConnect,
    private fb: Facebook,
    private fundObservable: FundObservable,
    private loadingCtrl: LoadingController,
    public global: Global
  ) {
    this.platform.ready().then(() => {
      if (this.platform.is("core") || this.platform.is("mobileweb")) {
        this.getUserIds = window["getIdsAvailableFromOneSignal"];
      } else {
        this.getUserIds = this.oneSignal.getIds;
      }
    });
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    // this.accountBalance = localStorage.getItem("accountBalance");
    this.pendingFunds = localStorage.getItem("pendingFunds");
    this.possiblePrize = localStorage.getItem("possiblePrize");
    this.yesterdaysChallenges = localStorage.getItem("yesterdaysChallenges");
    this.yesterdaysPrize = localStorage.getItem("yesterdaysPrize");
    this.userName = localStorage.getItem("userName");
    this.getUserDetails();
    this.getBonus();
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.accountBalance = res;
        this.fund = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }
  closeModal() {
    console.log("test");
    this.navCtrl.setRoot(TabsPage);
  }
  getBonus() {
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.http
      .post(Details.URL + "/auth/getbonus", { userid: id }, this.optionHeader)
      .subscribe(
        (res) => {
          this.bonus = JSON.parse(res["_body"]);
          this.hideSignUpBonus = this.bonus.length > 0 ? false : true;
          let i = 0;
          this.bonus.forEach((element) => {
            if (!element.exp_date) {
              element.show = true;
            }
            if (element.redeemed) {
              element.show = false;
              i++;
            } else {
              if (
                moment(element.exp_date, "YYYY-MM-DD HH:mm:ss").isBefore(
                  moment()
                )
              ) {
                element.show = false;
                i++;
              } else {
                element.show = true;
              }
            }
          });
          this.hideSignUpBonus = i == this.bonus.length ? true : false;
          console.log(this.bonus);
        },
        (e) => {
          console.log(e);
        }
      );
  }
  getUserDetails() {
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.http.get(Details.URL + "/account_info/" + id).subscribe(
      (response) => {
        if (response) {
          this.userData = JSON.parse(response["_body"]);
          // this.accountBalance = this.userData.accountBalance;
          this.pendingFunds = this.userData.pendingFunds;
          this.possiblePrize =
            this.userData.possiblePrize != null
              ? this.userData.possiblePrize
              : 0;
          this.yesterdaysChallenges = this.userData.yesterdaysChallenges;
          this.yesterdaysPrize = this.userData.yesterdaysPrize;
          this.showdata = true;
        }
      },
      (error) => {
        //console.log(error);
      }
    );
  }

  mailToSupport() {
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
  takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    };

    this.camera.getPicture(options).then(
      (imageData) => {
        let base64Image = "data:image/jpeg;base64," + imageData;
      },
      (err) => {
        // Handle error
      }
    );
  }

  GoToAddFund() {
    this.navCtrl.setRoot(FundfirstPage);
  }
  goFund() {
    this.navCtrl.push(FundfirstPage);
  }
  GoToMyChallenge() {
    localStorage.setItem("setflag", "true");
    localStorage.setItem("setflag1", "false");
    this.navCtrl.setRoot(TabsPage);
  }
  editProfile() {
    this.navCtrl.push(EditProfilePage);
  }
  GoToBonus() {
    this.navCtrl.push(BonusFundPage);
  }
  addBonusFund(i) {
    this.loading = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    this.loading.present();
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.http
      .get(`${Details.URL}/redeem_bonus/${this.bonus[i]._id}/${id}`)
      .subscribe(
        (res) => {
          this.loading.dismiss();
          this.hideSignUpBonus = true;
          this.getBonus();
          this.showPopup("Bonus added successfully", "Done");
          console.log(res);
        },
        (e) => {
          this.loading.dismiss();
          this.showPopup("Something wrong happen. Please try again", "Error");
          console.log(e);
        }
      );
    console.log(this.bonus[i]);
  }
  showPopup(msg, header) {
    this.msg = msg;
    this.header = header;
    this.showpopup = true;
  }
  closePopup() {
    this.showpopup = false;
    this.header = "";
    this.header = "";
  }
  GoToRefer() {
    this.navCtrl.push(ReferFriendPage);
  }
  goToNotificationSettings() {
    this.navCtrl.push(NotificationSettingsPage);
  }
}
