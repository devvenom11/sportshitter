import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { Http,RequestOptions,Headers } from '@angular/http';
import { LoginProvider } from '../../providers/login/login';
import { FundObservable } from '../../services/fundObservable';
import { SliderPage } from '../slider/slider';
import { TabsPage } from '../tabs/tabs';
import { SignUpPage } from '../sign-up/sign-up';
import { Socket } from 'ng-socket-io';
import { MyApp } from '../../app/app.component';
import { Global } from '../../services/Global';
import {environment as Details} from '../../environment';

/**
 * Generated class for the ConfirmEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-confirm-email',
  templateUrl: 'confirm-email.html',
})
export class ConfirmEmailPage implements OnInit{

  private _activationCode : String;
  public loading : Boolean;
  public message : String;
  public linkedExpired : Boolean;
  showForm:boolean=false;
  form: any = [];
  showPassword:boolean=false;

  constructor(private _navCtrl: NavController,
    private _navParams: NavParams,
    private _signUpService: SignUpProvider,
    public http:Http,
    public logInService: LoginProvider,
    private toastCtrl: ToastController,
    private fundObservable: FundObservable,
    public events: Events,
    public socket:Socket,
    private global: Global,) {

  }
  ngOnInit(){
    this.loading = false;
    this.linkedExpired = false;
    this.message = this._navParams.get('message');
    this._activationCode =  this._navParams.get('activationCode');
    if(this._activationCode){
      this._verifyActivationCode();
    }
  }

  private _verifyActivationCode(){
    this.loading = true;
    this.message = "Verifying your account...";
    this._signUpService.verifyActivationCode(this._activationCode)
    .subscribe(response=>{
      this.loading = false;
      if(response.status){
        this.message = response.message;
        this.showForm=true;
      }else{
        this.linkedExpired = Boolean(response.linkedExpired);
        this.message = response.message;
        this.showForm=false;
      }
    },(err)=>{
      this.loading = false;
      this.showForm=false
      this.message = "Something went wrong."
    })

  }

  public goBack(){
    //this._navCtrl.setRoot(LoginPage);
    (<any>window).location.href="/";
  }

  public resendActivationLink(){
    this.linkedExpired = false;
    this.loading = true;
    this.message = "Processing your request...";
    this._signUpService.resendActivationLink(this._activationCode)
    .subscribe(response=>{
      this.loading = false;
      if(response.status){
        this.message = response.message;
      }else{
        this.message = response.message;
      }
    },(err)=>{
      this.loading = false;
      this.message = "Something went wrong."
    })
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ConfirmEmailPage');
  }
  goToforgotPassword() {
    this._navCtrl.push(ForgotPasswordPage);
  }
  generallogIn() {
    if(this.form.username == "" || this.form.username == undefined){
      return;
    }
    this.loginProcess();
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
          const OneSignal = window['OneSignal'] || [];

          OneSignal.push(() => {
            OneSignal.isPushNotificationsEnabled((isEnabled) => {
              if (isEnabled) {
                console.log(`Push notifications are enabled for ${response.user._id}! `);
                OneSignal.setExternalUserId(response.user._id);
              }
              else {
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
                this._navCtrl.setRoot(SliderPage);
            }
            // //console.log(JSON.parse(data));
            else if(JSON.parse(data).account == undefined && JSON.parse(data).profile == undefined){
                this._navCtrl.setRoot(TabsPage);
              //   this.navCtrl.push(AccountsettingPage);
            }
            else{
                this._navCtrl.setRoot(TabsPage);
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
  goSignUp() {
    this._navCtrl.push(SignUpPage);

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
  public validUsername(){
    this.form.username = this.form.username.trim();
  }
  ShowPassword(){
    let element:any= document.getElementById("password-text2").children;
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
