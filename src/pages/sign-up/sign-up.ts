import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, Platform } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { TabsPage } from './../tabs/tabs';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { LoginProvider } from '../../providers/login/login';
import { ActivateCodePage } from './../activatecode/activatecode';
import { ConfirmEmailPage } from '../confirm-email/confirm-email';
// import {img} from '../../assets/icon/Phone-icon.png';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { OneSignal } from '@ionic-native/onesignal';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
    selector: 'page-sign-up',
    templateUrl: 'sign-up.html'
})
export class SignUpPage {
    form: any = [];
    getUserIds: any;
    geoLongitude:any;
    geoLatitude:any;
    // blackList:any=[
    //     'nevada',
    //     'nv',
    //     'arizona',
    //     'az',
    //     'alabama',
    //     'al',
    //     'hawaii',
    //     'hi',
    //     'idaho',
    //     'id',
    //     'iowa',
    //     'ia',
    //     'luisiana',
    //     'la',
    //     'montana',
    //     'mt',
    //     'chennai',
    //     'maa',
    //     'washington',
    //     'wa'
    // ];
    blackList:any;
    showpopup:boolean=false;
    buttonD:boolean=true;
    showPassword:boolean=false;
    rcode;
    constructor(public platform: Platform, public navCtrl: NavController, private oneSignal: OneSignal, public navParams: NavParams, public events: Events, public signUpService: SignUpProvider, public logInService: LoginProvider, private toastCtrl: ToastController, private googlePlus: GooglePlus, private twitter: TwitterConnect, private fb: Facebook, private http: Http,private geolocation: Geolocation) {
        this.platform.ready().then(() => {
            if (this.platform.is('core') || this.platform.is('mobileweb')) {
                this.getUserIds = window['getIdsAvailableFromOneSignal'];
            } else {
                this.getUserIds = this.oneSignal.getIds;
            }
        })
    }

    ionViewDidLoad() {
        this.rcode=this.navParams.get('rcode');
        console.log(this.rcode)
        this.form.verified_user=1;
        // this.signUpService.getBlackList().subscribe(
        //     res=>{
        //         this.blackList=JSON.parse(res['_body'])
        //         if(this.blackList.length>0){
        //             this.geolocation.getCurrentPosition().then((resp) => {
        //                 this.geoLatitude = resp.coords.latitude;
        //                 this.geoLongitude = resp.coords.longitude;
        //                 this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.geoLatitude},${this.geoLongitude}&key=AIzaSyAr6j76GCk5I5lXtF2oVkw0NymWndZ1wdY`).subscribe(
        //                     res=>{
        //                         console.log(res)
        //                         let resp=JSON.parse(res['_body']);
        //                         let isBlackList;
        //                         resp.results.forEach(element => {
        //                             let address=element.formatted_address;
        //                             let split=address.split(",");
        //                             let splitSpace=address.split(" ");
        //                             if(split.length>0){
        //                                 split.forEach(splitVal => {
        //                                     // if(this.blackList.includes(splitVal.replace(/[^A-Z0-9]/ig, '').toLowerCase())){
        //                                     //     isBlackList=true;
        //                                     // }
        //                                     this.blackList.forEach(val=>{
        //                                         if(val.statename.toLowerCase()==splitVal.toLowerCase()){
        //                                             isBlackList=true;
        //                                         }
        //                                         else if(val.shortname.includes(splitVal.replace(/[^A-Z0-9]/ig, '').toLowerCase())){
        //                                             isBlackList=true;
        //                                         }
        //                                     })
        //                                 });
        //                             }
        //                             // if(splitSpace.length>0){
        //                             //     console.log(splitSpace)
        //                             //     splitSpace.forEach(splitVal => {
        //                             //         // if(this.blackList.includes(splitVal.replace(/[^A-Z0-9]/ig, '').toLowerCase())){
        //                             //         //     isBlackList=true;
        //                             //         // }
        //                             //         this.blackList.forEach(val=>{
        //                             //             if(val.statename.includes(splitVal.replace(/[^A-Z0-9]/ig, '').toLowerCase())){
        //                             //                 isBlackList=true;
        //                             //                 console.log(splitVal)
        //                             //                 console.log('aqui 3')
        //                             //             }
        //                             //             else if(val.shortname.includes(splitVal.replace(/[^A-Z0-9]/ig, '').toLowerCase())){
        //                             //                 isBlackList=true;
        //                             //                 console.log('aqui 4')
        //                             //             }
        //                             //         })
        //                             //     });
        //                             // }
        //                         });
        //                         if(isBlackList){
        //                             this.form.verified_user=0;
        //                             this.form.location=resp.results[0].formatted_address
        //                         }
        //                         else{
        //                             this.form.verified_user=1;
        //                             this.form.location=resp.results[0].formatted_address
        //                         }
        //                       },
        //                       e=>{
        //                           console.log(e)
        //                           this.form.verified_user=1;
        //                           this.showToast('Error: We are having problems getting your location. Please reaload the page again.')
        //                         }
        //                   )
        //             },
        //             e=>{
        //                 console.log(e)
        //                 this.form.verified_user=1;
        //                 this.showToast(`Error: ${e.message}`)
        //             })
        //         }
        //         else{
        //             this.form.verified_user=1
        //         }
        //     },
        //     e=>{
        //        console.log(e)
        //        this.form.verified_user=1
        //     }
        // )
        // //console.log('iosnViewDidLoad SignUpPage');
    }

    /**
     * Redirect to login page
     */
    goLoginIn() {
        this.navCtrl.setRoot(LoginPage)
    }

    public validUsername(){
      this.form.username = this.form.username.trim();
    }

    /**
     * sign up by email
     */
    GeneralSignUp() {
        if(this.form.phone && this.form.phone.length>0){
          this.form.phone = ('+1' + this.form.phone).toString();
        }
        else{
          delete this.form.phone;
        }
        if(this.rcode){
            this.form.rcode=this.rcode;
        }
        console.log(this.form);
        this.signUpService.verifyEmail(this.form, 'signup').subscribe(response => {
            let toast = this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            if (response.status == true) {
                if(this.form.verified_user==1){
                    this.showpopup=false
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
                else{
                    this.showpopup=true;
                }
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
    showToast(msg) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: 5000
        });
        toast.present();
      }
    closePopup(){
        this.showpopup=false
    }
    ShowPassword(){
        let element:any= document.getElementById("password-text-signup").children;
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
