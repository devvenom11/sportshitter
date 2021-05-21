import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { NewPasswordPage } from './../new-password/new-password';
import { LoginProvider } from '../../providers/login/login';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { Http, Headers } from '@angular/http';

@Component({
    selector: 'page-activate-code',
    templateUrl: 'activatecode.html'
})
export class ActivateCodePage {
    pincode: any = "";
    username: any = "";
    email: any = "";
    password: any = "";
    form: any = [{code1:""},{code2:""},{code3:""},{code4:""}];
    state: any = "";
    getUserIds :any;
    @ViewChild('input1') myInput1;
    @ViewChild('input2') myInput2;
    @ViewChild('input3') myInput3;
    @ViewChild('input4') myInput4;

    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        public events:Events,
        public signUpService: SignUpProvider,
        public logInService: LoginProvider,
        private toastCtrl: ToastController,
      ) {
        this.pincode = this.navParams.get('code');
        this.username = this.navParams.get('user').username;
        this.email = this.navParams.get('user').email;
        this.password = this.navParams.get('user').password;
        this.state = this.navParams.get('state');

    }

    ionViewDidLoad() {
        this.myInput1.setFocus();
    }
    resend(){
        this.navCtrl.pop();
    }

    activatecode() {
        var codeStr =  this.form.code1 + this.form.code2 + this.form.code3 +this.form.code4;
        if(codeStr != this.pincode){
            let toast = this.toastCtrl.create({
                message: "Activate code is not valid.",
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
        }
        else{
            if(this.state == 'signup'){
                if(this.platform.is('iphone')){
                    this.processSignup("");
                }else{
                    this.getUserIds().then((id) => {
                        this.processSignup(id["userId"]);
                    })
                }
            }
            else if(this.state == 'forgotpassword'){
                this.navCtrl.push(NewPasswordPage, {email: this.email, username:this.username});

            }
        }
    }

    processSignup(playerid){
        this.getUserIds().then((id) => {
            let body = JSON.stringify({
                email: this.email,
                password: this.password,
                username: this.username,
                playerid:playerid
            });

            this.signUpService.signupByEmail(body).subscribe(response => {
                //console.log(response)
                let toast = this.toastCtrl.create({
                    message: response.message,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.present();

                if (response.status == true) {
                    localStorage.removeItem("loggedUser");
                    response.user["playerid"] = playerid;
                    var data = JSON.stringify(response.user);
                    localStorage.setItem('loggedUser', data);
                    localStorage.setItem('token', response.JWT);
                    // this.navCtrl.setRoot(AccountsettingPage);
                    this.navCtrl.setRoot(TabsPage);
                    this.events.publish('user:loggedIn');
                }
            });
        });
    }

    firstinput(event) {
        var val = (this.form.code1 || "");
        setTimeout(() => {
            if((this.form.code1 || "").length == 1){
                this.myInput2.setFocus();
            }else if((this.form.code1 || "").length > 1 ){
                this.form.code1 = val;
                this.myInput2.setFocus();
            }
        },100);
    }

    secondinput(event) {
        var val = (this.form.code2 || "");
        setTimeout(() => {
            if((this.form.code2 || "").length == 1){
                this.myInput3.setFocus();
            }else if((this.form.code2 || "").length > 1 ){
                this.form.code2 = val;
                this.myInput3.setFocus();
            }
        },100);
    }

    thirdinput(event) {
        var val = (this.form.code3 || "");
        setTimeout(() => {
            if((this.form.code3 || "").length == 1){
                this.myInput4.setFocus();
            }else if((this.form.code3 || "").length > 1 ){
                this.form.code3 = val;
                this.myInput4.setFocus();
            }
        },100);
    }

    fourthinput(event) {
        var val = (this.form.code4 || "");
        setTimeout(() => {
            if((this.form.code4 || "").length == 1){
                // this.myButton.setFocus();
            }else if((this.form.code4 || "").length > 1 ){
                this.form.code4 = val;
                // this.myButton.setFocus();
            }
        },100);
    }
}
