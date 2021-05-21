import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from "ionic-angular";
import {
  Http,
  RequestOptions,
  Headers,
  ResponseContentType,
} from "@angular/http";
import { environment } from "../../environment";
import { Global } from "../../services/Global";
import { FundObservable } from "../../services/fundObservable";
import { FundfirstPage } from "../fundfirst/fundfirst";
import { MyAccountPage } from "../my-account/my-account"

@Component({
  selector: "page-notification-settings",
  templateUrl: "notification-settings.html",
})
export class NotificationSettingsPage {
  userInfo;
  headers = new Headers();
  optionHeader: any;
  fund: number = 0;
  header: string;
  msg: string;
  showpopup: boolean = false;
  loader;
  showEditAlert: boolean = false;
  loaded: boolean = false;
  // defaults
  phone: any;
  email: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private fundObservable: FundObservable,
    public global: Global,
    public alert: AlertController,
    private loadingCtrl: LoadingController
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    // this.headers.append("x-auth", localStorage.getItem("token"));
    this.headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    this.optionHeader = new RequestOptions({
      headers: this.headers,
      responseType: ResponseContentType.Json,
    });
  }

  fetchSettings() {
    this.http
      .get(
        `${environment.baseUrl}/v2/chat/settings`, // todo move to user ...
        this.optionHeader
      )
      .subscribe(
        (res: any) => {
          this.loaded = true;
          this.phone = res._body.phone;
          this.email = res._body.email;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  saveSettings() {
    this.showLoading();
    this.http
      .post(
        `${environment.baseUrl}/v2/chat/settings`, // todo move to user ...
        {phone: this.phone, email: this.email},
        this.optionHeader
      )
      .subscribe(
        (res: any) => {
          this.phone = res._body.phone;
          this.email = res._body.email;
          this.goToMyAccount()
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ionViewWillEnter() {
    this.fetchSettings();
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.fund = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goToMyAccount() {
    this.navCtrl.push(MyAccountPage);
  }

  showLoading(duration=2000) {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      dismissOnPageChange: true,
      duration,
    });
    this.loader.present();
  }
}
