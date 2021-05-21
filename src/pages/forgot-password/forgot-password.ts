import { Component } from '@angular/core';
import { NavController, NavParams,ToastController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login/login';
import { SignUpProvider } from '../../providers/sign-up/sign-up';
import { ActivateCodePage } from './../activatecode/activatecode';

@Component({
    selector: 'page-forgot-password',
    templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
    form: any = [];

    constructor(public navCtrl: NavController,
      public navParams: NavParams,
      public logInService: LoginProvider,
      private toastCtrl: ToastController,
      public signUpService: SignUpProvider,
    ) {

    }

    ionViewDidLoad() {
        // //console.log('ionViewDidLoad ForgotPasswordPage');
    }

    /**
     * forgot password
     */
    forgotpassword() {
        this.signUpService.verifyEmail(this.form, 'forgotpassword').subscribe(response => {
            // //console.log(response)
            let toast = this.toastCtrl.create({
                message: response.message,
                duration: 3000,
                position: 'bottom'
            });
            toast.present();
            if (response.status == true) {
                this.navCtrl.push(ActivateCodePage, {code: response.code, user: response.user, state: "forgotpassword"});
            }
        });
    }
}
