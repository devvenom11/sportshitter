import {Component} from '@angular/core';
import { NavController, NavParams,ToastController} from 'ionic-angular';

import {LoginProvider} from '../../providers/login/login';
import {LoginPage} from './../login/login';

/**
 * Generated class for the NewPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-new-password',
    templateUrl: 'new-password.html'
})
export class NewPasswordPage {
    form: any = [];
    email = "";
    username = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, public logInService: LoginProvider, private toastCtrl: ToastController) {
        this.email = this.navParams.get('email');
        this.username = this.navParams.get('username');        
    }

    ionViewDidLoad() {
        // //console.log('ionViewDidLoad NewPasswordPage');
    }

    /**
     * update password
     */
    updatepassword() {
        this.logInService.forgotPassword(this.email, this.form.password, this.username).subscribe(response => {            
            let toast = this.toastCtrl.create({
                message: response.message,
                duration: 6000,
                position: 'bottom'
            });
            toast.present();
            this.navCtrl.push(LoginPage);
         })
    }
}
