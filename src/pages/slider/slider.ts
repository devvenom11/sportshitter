import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { LoginProvider } from '../../providers/login/login';
import { ActivateCodePage } from '../activatecode/activatecode';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
// import {img} from '../../assets/icon/Phone-icon.png';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import { HowToPlayPage } from '../how-to-play/how-to-play';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
// import { LoginProvider } from '../../providers/login/login';

@Component({
    selector: 'slider-page',
    templateUrl: 'slider.html'
})
export class SliderPage {
    form: any = [];
    getUserIds: any;
    @ViewChild('slides') slides: Slides;
    slideno: number = 0;
    setlabel: string;
    firstPage:boolean=true
    lastSlide:boolean=false;
    slideOpts = {
        initialSlide: 1,
        speed: 400
    };
    constructor(public platform: Platform, public navCtrl: NavController, private oneSignal: OneSignal, public navParams: NavParams, public events: Events, public signUpService: SignUpProvider, public logInService: LoginProvider, private toastCtrl: ToastController, private googlePlus: GooglePlus, private twitter: TwitterConnect, private fb: Facebook) {
        this.platform.ready().then(() => {
            if (this.platform.is('core') || this.platform.is('mobileweb')) {
                this.getUserIds = window['getIdsAvailableFromOneSignal'];
            } else {
                this.getUserIds = this.oneSignal.getIds;
            }
        });
        let email = localStorage.getItem("email");
        let username = localStorage.getItem("username");
        this.logInService.updateFirstLogin(email, username).subscribe(response => {
        })
    }
    start(){
        this.firstPage=false;
    }
    skip(){
        this.navCtrl.setRoot(TabsPage)
    }
    slideChanged() {
        this.slideno = this.slides.getActiveIndex();
        this.lastSlide= this.slides.isEnd() ? true : false;
        this.setlabel = this.slideno == 2 ? "continue" : "";
    }
    ionViewDidLoad() {
        // //console.log('iosnViewDidLoad SignUpPage');
    }

    /**
     * Redirect to login page
     */
    howtpplay() {
        this.slides.slideNext();
    }

    /**
     * sign up by email
     */
    GeneralSignUp() {
        this.signUpService.verifyEmail(this.form, 'signup').subscribe(response => {
            //console.log(response)
            let toast = this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            if (response.status == true) {

                // this.navCtrl.push(ActivateCodePage, {code: response.code, user: response.user, state: "signup"});
                this.navCtrl.push(ConfirmEmailPage, { message: 'An activation is sent to your email. Please verfiy your email' })
                /*
                                localStorage.removeItem("loggedUser");
                                var data = JSON.stringify(response.user);
                                localStorage.setItem('loggedUser', data);
                                localStorage.setItem('token', response.JWT);
                                this.navCtrl.setRoot(TabsPage);
                                this.events.publish('user:loggedIn');
                */
            }
        });

    }

    /**
     * login or sign up by facebook
     */


    loginByFacebook() {
        this.fb.login(['public_profile', 'email'])
            .then((res: FacebookLoginResponse) => {
                this.fb.api('me?fields=id,name,email,name_format', []).then(profile => {
                    this.oneSignal.getIds().then((id) => {
                        var username = profile.name.replace(' ', '');

                        var data = {
                            facebook_id: res.authResponse.userID,
                            displayname: username,
                            email: profile.email,
                            firstname: profile.first_name,
                            lastname: profile.last_name,
                            playerid: id["userId"]
                        }
                        this.logInService.loginBySocialAccount(data).subscribe(response => {
                            // //console.log(response)
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
                                localStorage.setItem('token', response.JWT);
                                this.navCtrl.setRoot(TabsPage);
                                this.events.publish('user:loggedIn');
                            }
                        });

                    });
                });
            })
            .catch(e => console.log('Error logging into Facebook' + JSON.stringify(e)));
    }

    /**
     * login or sign up by google
     */

    loginByGoogle() {
        this.googlePlus.login({
            'webClientId': '1093557657422-n6hpqc4h5l7fnk1e245hm9ip7cabg4ko.apps.googleusercontent.com',
            'offline': true
        })
            .then(res => {
                // //console.log("RESULT: " + JSON.stringify(res));
                this.navCtrl.setRoot(TabsPage);
            })
            .catch(err => console.log("ERROR: " + JSON.stringify(err)));
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
                    // //console.log(response)
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
                        localStorage.setItem('token', response.JWT);
                        this.navCtrl.setRoot(TabsPage);
                        this.events.publish('user:loggedIn');
                    }
                });
            }, error => {
                //console.log("ERROR: " + JSON.stringify(error));
            });
        });
    }
    home(){
        this.navCtrl.setRoot(TabsPage)
    }
}
