import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events,MenuController, Platform } from 'ionic-angular';
import { SignUpPage } from './../sign-up/sign-up'
import { LoginProvider } from '../../providers/login/login';
import { TabsPage } from './../tabs/tabs';
import { ForgotPasswordPage } from './../forgot-password/forgot-password';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { AccountsettingPage } from './../accountsetting/accountsetting';
import { Global } from '../../services/Global';
import { Socket } from 'ng-socket-io';
import { OneSignal } from '@ionic-native/onesignal';
import { SliderPage } from '../slider/slider';
import { FundObservable } from '../../services/fundObservable';
import { MyApp } from '../../app/app.component';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    form: any = [];
    loggedUser;
    getUserIds :any;

    geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;

  watchLocationUpdates:any;
  loading:any;
  isWatching:boolean;
  showPassword:boolean=false;
    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public http:Http,
        public events: Events,
        public logInService: LoginProvider,
        private toastCtrl: ToastController,
        private googlePlus: GooglePlus,
        private twitter: TwitterConnect,
        private fb: Facebook,
        public socket:Socket,
        private global: Global,
        public menuCtrl: MenuController,
        private oneSignal: OneSignal,
        private fundObservable: FundObservable
        ) {
        this.loggedUser = localStorage.getItem("loggedUser");
        this.menuCtrl.enable(false, 'myMenu');
        this.setLogin = this.setLogin.bind(this);
        localStorage.setItem("setflag","false");
        if (this.loggedUser !== null) {
            /** Logged User **/
            this.events.publish('user:loggedIn');
            this.setLogin(JSON.parse(this.loggedUser)._id);
            this.getfundinfo();
            this.navCtrl.setRoot(TabsPage);
        }
        this.platform.ready().then(() => {
            if(this.platform.is('core') || this.platform.is('mobileweb')){
                this.getUserIds = window['getIdsAvailableFromOneSignal'];
            }else{
                this.getUserIds = this.oneSignal.getIds;
            }
        })
    }

    ionViewDidLoad() {
    }

    goSignUp() {
        this.navCtrl.push(SignUpPage);
    }

    setLogin(userid){
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/json' );
        let options = new RequestOptions({ headers: headers });
        let postParams = {
            userid: userid
        }
        this.socket.emit('authentication',{userid:JSON.parse(localStorage.getItem("loggedUser"))['_id']});
        this.socket.on('force-close-session-id.'+ userid, ()=>{
          MyApp.logout()
        });
        this.http.post(Details.URL+"/user/setLogin", postParams, options)
        .subscribe(data => {
            if(data){
                this.global.statusList = JSON.parse(data['_body']);
            }
        });
    }
    /** Get Money(fund info) **/
    getfundinfo(){
        var user = localStorage.getItem("loggedUser");
            user = JSON.parse(user);

            var headers = new Headers();
            headers.append("Accept", 'application/json');
            headers.append('Content-Type', 'application/json' );
            headers.append("x-auth",localStorage.getItem("token"));
            let options = new RequestOptions({ headers: headers });
            let postParams = {
                userid: user['_id']
            }
            this.socket.connect();
            this.http.post(Details.URL+"/fund/getfundinfo", postParams, options)
            .subscribe(data => {
              var data1 = JSON.parse(data['_body']);

              var fund = 0;
                data1.fund.forEach(element => {
                    fund += element.amount;
                });
                data1.contestfund.forEach(element => {
                    fund += element.amount;
                });
                localStorage.removeItem("fund");
                if(user['_id'] == '5a1de49ce150b4543d8a419d') {
                    this.http.post(Details.URL+"/contest/getfee",{},options)
                    .subscribe(data2 => {
                        data2 = JSON.parse(data2['_body']);
                        if(data2 && data2['totalfee']) {
                            localStorage.setItem('fund', (Math.round( (fund+data2['totalfee'])*100)/100).toString());
                            this.events.publish('user:fund');
                        }
                    }, error1 => {
                        //console.log(error1)
                    })
                } else {
                    localStorage.setItem('fund', (Math.round(fund*100)/100).toString());
                    this.events.publish('user:fund');
                }

            }, error => {
              //console.log(error);// Error getting the data
            });
      }

    /**
     * Navigate to home page
     */
    goHome() {
        this.navCtrl.setRoot(TabsPage);
    }

    public validUsername(){
      this.form.username = this.form.username.trim();
    }

    generallogIn() {
        if(this.form.username == "" || this.form.username == undefined){
            return;
        }
        // this.form.username = this.form.username.trim();
        this.loginProcess();
        //COMMENTED THIS LINE OUT BECAUSE WE ARE NOT INICIALIZE THE ONESIGNAL ON APP.COMPONENT
        //    this.getUserIds().then((id) => {
        //       this.form.playerid = id["userId"];
        //       // this.form.playerid = "";
        //       this.loginProcess();

        //     },(err) => {
        //       // rejection
        //       console.log('errorr==========',err);
        //     });

    }

    loginProcess(){
      this.logInService.loginByEmail(this.form).subscribe(response => {
        if(response.status){
          let toast = this.toastCtrl.create({
              message: response.message,
              duration: 3000,
              position: 'bottom'
          });
          toast.present();
          if (response.status == true) {

              const OneSignal = window["OneSignal"] || [];

              OneSignal.push(() => {
                OneSignal.isPushNotificationsEnabled((isEnabled) => {
                  if (isEnabled) {
                    console.log(`Push notifications are enabled for ${response.user._id}! `);
                    OneSignal.setExternalUserId(response.user._id);
                  } else {
                    console.log("Push notifications are not enabled yet.");
                  }
                });
              });

              localStorage.removeItem("loggedUser");
              response.user["playerid"] = "";
              // response.user["playerid"] = "";
              var data = JSON.stringify(response.user);
              localStorage.setItem('loggedUser', data);
              let showEditAlert= response.user.phone && response.user.phone!=''? false : true
              console.log(showEditAlert)
              this.fundObservable.setEditAlert(showEditAlert)
              localStorage.setItem('account', JSON.parse(data).account);
               // localStorage.setItem('upgrade', JSON.parse(data).upgrade);
               localStorage.setItem('upgrade', "1");// set upgrade feature  just free app for all users

              localStorage.setItem('token', response.JWT);
              if(!("firstLogin" in response.user) || response.user.firstLogin === true ){
                  localStorage.setItem("firstLogin","true");
                  localStorage.setItem("email",response.user.email);
                  localStorage.setItem("username",response.user.username);
                  this.navCtrl.setRoot(SliderPage);
              }
              // //console.log(JSON.parse(data));
              else if(JSON.parse(data).account == undefined && JSON.parse(data).profile == undefined){
                  this.navCtrl.setRoot(TabsPage);
                //   this.navCtrl.push(AccountsettingPage);
              }
              else{
                  this.navCtrl.setRoot(TabsPage);
              }
              this.events.publish('user:loggedIn');
              this.setLogin(JSON.parse(data)._id);
              this.getfundinfo();
          }
        }
        else{
            let toast = this.toastCtrl.create({
                message: response.message,
                duration: 5000,
                position: 'bottom'
            });
            toast.present();
        }
      });

    }

    /**
     * login or sign up by facebook
     */

    loginByFacebook() {
        this.fb.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                this.fb.api('me?fields=id,name,email,first_name, last_name',[]).then(profile => {
                    this.getUserIds().then((id) => {
                        var username = profile.name.replace(' ','');
                        var data = {
                            facebook_id: res.authResponse.userID,
                            displayname: username,
                            email: profile.email,
                            firstname: profile.first_name,
                            lastname: profile.last_name,
                            playerid: id["userId"]
                        }
                        this.logInService.loginBySocialAccount(data).subscribe(response => {
                            let toast = this.toastCtrl.create({
                                message: response.message,
                                duration: 3000,
                                position: 'bottom'
                            });
                            toast.present();
                            if (response.status == true) {
                                response.user["playerid"] = id["userId"];
                                localStorage.removeItem("loggedUser");
                                var data = JSON.stringify(response.user);
                                localStorage.setItem('loggedUser', data);
                                localStorage.setItem('upgrade', data['upgrade']);
                                localStorage.setItem('account', JSON.parse(data).account);
                                localStorage.setItem('token', response.JWT);
                                if(JSON.parse(data).account == undefined){
                                    this.navCtrl.setRoot(TabsPage);
                                    // this.navCtrl.push(AccountsettingPage);
                                }
                                else{
                                    this.navCtrl.setRoot(TabsPage);
                                }
                                this.events.publish('user:loggedIn');
                                this.setLogin(JSON.parse(data)._id);
                                this.getfundinfo();
                            }
                        });
                    });
                })
            })
            .catch(e => console.log('Error logging into Facebook' + JSON.stringify(e)));
    }
    /**
     * login or sign up by google
     */

    loginByGoogle() {
        this.googlePlus.login({
            'webClientId': '1093557657422-n6hpqc4h5l7fnk1e245hm9ip7cabg4ko.apps.googleusercontent.com',
            'offline': true,
        }).then(res => {
            alert("RESULT: " + JSON.stringify(res));
            this.navCtrl.setRoot(TabsPage);
        }).catch(err => alert("ERROR: " + JSON.stringify(err)));
    }

    /**
     * login or sign up by twitter
     */

    loginByTwitter() {
        this.twitter.login().then(success => {
            this.getUserIds().then((id) => {
                var data = {
                    displayname: success.userName,
                    twitter_id: success.userId,
                    playerid: id["userId"]
                }
                this.logInService.loginBySocialAccount(data).subscribe(response => {
                    let toast = this.toastCtrl.create({
                        message: response.message,
                        duration: 3000,
                        position: 'bottom'
                    });
                    toast.present();
                    if (response.status == true) {
                        response.user["playerid"] = id["userId"];
                        localStorage.removeItem("loggedUser");
                        var data = JSON.stringify(response.user);
                        localStorage.setItem('loggedUser', data);
                        localStorage.setItem('upgrade', data['upgrade']);
                        localStorage.setItem('account', JSON.parse(data).account);
                        localStorage.setItem('token', response.JWT);
                        if(JSON.parse(data).account == undefined){
                            this.navCtrl.setRoot(TabsPage);
                            // this.navCtrl.push(AccountsettingPage);
                        }
                        else{
                            this.navCtrl.setRoot(TabsPage);
                        }
                        this.events.publish('user:loggedIn');
                        this.setLogin(JSON.parse(data)._id);
                        this.getfundinfo();
                    }
                });
            });

        }, error => {
            //console.log(JSON.stringify(error));
        });

    }

    /**
     *
     * got to forgot password page
     */
    goToforgotPassword() {
        this.navCtrl.push(ForgotPasswordPage);
    }
    ShowPassword(){
       let element:any= document.getElementById("password-text").children;
        if(element[0].type==="password"){
            element[0].type="text"
            this.showPassword=true;
        }
        else{
            element[0].type="password"
            this.showPassword=false;
        }
    }

}
