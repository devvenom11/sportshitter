import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions,Headers } from '@angular/http';
import {environment as Details} from '../../environment';
import {Global} from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { LoginProvider } from '../../providers/login/login';
import { NotificationSettingsPage } from '../notification-settings/notification-settings';

@Component({
  selector: "page-edit-profile",
  templateUrl: "edit-profile.html",
})
export class EditProfilePage {
  userInfo;
  headers = new Headers();
  optionHeader: any;
  fund: number = 0;
  header: string;
  msg: string;
  showpopup: boolean = false;
  loader;
  showEditAlert: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private fundObservable: FundObservable,
    public global: Global,
    public alert: AlertController,
    private loginProvider: LoginProvider,
    private loadingCtrl: LoadingController
  ) {
    this.userInfo = JSON.parse(localStorage.getItem("loggedUser"));
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });
    this.http
      .post(
        Details.URL + "/contest/getnotifibadget_funds",
        { userid: this.userInfo._id, gametype: this.global.gameType },
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
    this.fundObservable.showEditAlert.subscribe((res) => {
      this.showEditAlert = res;
    });
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
  goToNotificationSettings() {
    this.navCtrl.push(NotificationSettingsPage);
  }
  openAlert(title) {
    let field;
    switch (title) {
      case "password":
        field = {
          name: "newData",
          type: "password",
          placeholder: title,
        };
        break;
      case "Phone":
        field = {
          name: "newData",
          type: "tel",
          placeholder: title,
        };
        break;
      case "Email":
        field = {
          name: "newData",
          type: "email",
          placeholder: title,
        };
        break;
    }
    let prompt = this.alert.create({
      title: `${title} change`,
      message: `Please add your new ${title} here`,
      inputs: [field],
      buttons: [
        {
          text: "Cancel",
          handler: (data) => {},
        },
        {
          text: "Save",
          handler: (data) => {
            this.showLoading();
            switch (title) {
              case "password":
                if (data.newData.length >= 6) {
                  this.loginProvider
                    .forgotPassword(
                      this.userInfo.email,
                      data.newData,
                      this.userInfo.username
                    )
                    .subscribe(
                      (res) => {
                        if (res.status) {
                          this.loader.dismiss();
                          this.showPopup(
                            "Done",
                            "Your new password have been created successfully"
                          );
                        } else {
                          this.showPopup(
                            "Error",
                            "Something wrong happen. Please try again."
                          );
                        }
                      },
                      (e) => {
                        console.log(e);
                      }
                    );
                } else {
                  this.loader.dismiss();
                  this.showPopup(
                    "Error",
                    "The password cannot be less than six characters."
                  );
                }
                break;
              case "Phone":
                if (data.newData != "") {
                  this.http
                    .post(
                      Details.URL + "/user/updatephone",
                      { id: this.userInfo._id, phone: data.newData },
                      this.optionHeader
                    )
                    .subscribe(
                      (res) => {
                        if (res.status) {
                          this.loader.dismiss();
                          localStorage.setItem(
                            "loggedUser",
                            JSON.stringify(JSON.parse(res["_body"]).data)
                          );
                          this.userInfo = JSON.parse(
                            localStorage.getItem("loggedUser")
                          );
                          this.fundObservable.setEditAlert(false);
                          this.showPopup(
                            "Done",
                            "Your Phone number have been saved successfully"
                          );
                        } else {
                          this.showPopup(
                            "Error",
                            "Something wrong happen. Please try again."
                          );
                        }
                      },
                      (e) => {
                        console.log(e);
                      }
                    );
                } else {
                  this.loader.dismiss();
                  this.showPopup("Error", "Empty field is not allow it.");
                }
                break;
              case "Email":
                this.http
                  .post(
                    Details.URL + "/user/updatemail",
                    { id: this.userInfo._id, phone: data.newData },
                    this.optionHeader
                  )
                  .subscribe(
                    (res) => {
                      if (res.status) {
                        this.loader.dismiss();
                        localStorage.setItem(
                          "loggedUser",
                          JSON.stringify(JSON.parse(res["_body"]).data)
                        );
                        this.userInfo = JSON.parse(
                          localStorage.getItem("loggedUser")
                        );
                        this.showPopup(
                          "Done",
                          "Your Email number have been edited successfully"
                        );
                      } else {
                        this.showPopup(
                          "Error",
                          "Something wrong happen. Please try again."
                        );
                      }
                    },
                    (e) => {
                      console.log(e);
                    }
                  );
                break;
            }
          },
        },
      ],
    });
    prompt.present();
  }
  showPopup(header, msg) {
    this.header = header;
    this.msg = msg;
    this.showpopup = true;
  }
  closePopup() {
    this.showpopup = false;
  }
  showLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000,
    });
    this.loader.present();
  }
}
