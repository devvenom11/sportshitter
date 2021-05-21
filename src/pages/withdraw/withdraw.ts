import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, AlertController, Platform } from 'ionic-angular';
import { FundfirstPage } from './../fundfirst/fundfirst';
import {environment as Details} from '../../environment';
import { Http, Headers, RequestOptions } from '@angular/http';

import { EmailComposer } from '@ionic-native/email-composer';
import { FundObservable } from '../../services/fundObservable';
import { Global } from '../../services/Global';
import { HomePage } from '../home/home';
import { BonusFundPage } from '../bonus-fund/bonus-fund';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { TabsPage } from '../tabs/tabs';
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {
  fund:number = 0;
  amount = 0;
  loading:any;
  buttonD:boolean=false;
  wamount = "";
  note="";
  repaymenttype="";
  withdrawEmail = "";
  withdrawOption = ""; // "PAYPAL" || "CREDIT_CARD"
  isFirstTime:boolean=true;
  oldVal:any;
  showpopup:boolean=false;
  headers = new Headers();
  optionHeader:any;
  showpopupw:boolean=false;
  totalWithdraw;
  withdrawspent;
  platformType: string = 'BROWSER';
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public event:Events,
    public toast: ToastController,
    public http: Http,
    public emailComposer:EmailComposer,
    public alertCtrl: AlertController,
    public fundObservable: FundObservable,
    private platform: Platform,
    private global:Global,
    public share: SocialSharing) {
    /*Author:Anjali
        Call API for Account Balance*/
        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });

        let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
        this.http.get(Details.URL+"/account_info/"+id,this.optionHeader).subscribe(res => {
          let response=JSON.parse(res['_body'])
          console.log(response)
          if(response.user.bonus){
            this.showpopupw=true;
            this.totalWithdraw=response.user.bonus_rollover
            this.withdrawspent=response.user.completed_total ? response.user.completed_total : 0
          }
          else{
            this.showpopupw=false
          }
        },
        error => {
        console.log(error);
        });
  }

  selectWithdrawOption(option){
    this.withdrawOption = option;
  }
  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      res=>{
        this.fund=res
      },
      e=>{
        console.log(e)
      }
    )
    // default is paypal
    this.selectWithdrawOption('paypal');
  }

  toBack(){
    this.navCtrl.pop();
  }

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }

  btnwithdrawfund () {
    if(this.withdrawOption==''){
      this.showToast('Please select a payment option')
      return
    }
    if(this.wamount == '')
      return;
      if(parseFloat(this.wamount) > this.fund){
        this.showToast('The amount you are attempting withdrawal is greater than your available withdrawal amount.')
        return
      }
      else if(parseFloat(this.wamount) < 10 ){
        this.showToast("Invalid amount! Please enter minimum $10");
        // document.getElementById('game_btn1').style.opacity = '0.5';
        return;
      }
      else if(parseFloat(this.wamount) > 1000){
        this.showToast("Invalid amount! max $1000.");
        return
      }

    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();

    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
   // headers.append('Content-Type', 'application/json' );

    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid: user['_id'],
      amount: this.wamount,
      note: this.note,
      pay_type:this.withdrawOption
    }
    this.http.post(Details.URL+"/fund/postwithdraw", postParams, this.optionHeader)
    .subscribe(data => {
      var data1 = JSON.parse(data['_body']);
      if(data1.status==true){
        this.showpopup=true;
        // this.showToast('Congratulations Hitter, your withdraw is being processed in the next 24 hours');
        this.updateFundObservable();
        // document.getElementById('game_btn1').style.opacity = '0.5';

         /* Author:Anjali, CommentOut code*/
        // var fund = Math.round(parseFloat(this.fund)*100)/100-Math.round(parseFloat(this.wamount)*100)/100;
        // localStorage.removeItem("fund");
        // localStorage.setItem('fund', fund.toString());
        // this.fund = fund.toString();
        // this.event.publish('user:fund');
      }
      else{
        this.showToast('Amount is not available!');
        this.wamount = "";
      }
      this.loading.dismiss();
    }, error => {
      //console.log(error);// Error getting the data
      this.loading.dismiss();
    });
  }

  reselectPayment (index) {
    this.enableButton();
    // this.amount = 0;
    // if(index == 0) {
      if(parseFloat(this.wamount) > this.fund){
        this.showToast('The amount you are attempting withdrawal is greater than your available withdrawal amount.')
        return
      }
      else if(parseFloat(this.wamount) < 10 ){
        this.showToast("Invalid amount! Please enter minimum $10");
        // document.getElementById('game_btn1').style.opacity = '0.5';
        return;
      }
      else if(parseFloat(this.wamount) > 1000){
        this.showToast("Invalid amount! max $1000.");
        return
      }
      // if(this.wamount != ''){
      //   document.getElementById('game_btn1').style.opacity = '1.0';
      //   // this.amount = parseFloat(this.wamount);
      // }

    // } else {
    //   document.getElementById('game_btn1').style.opacity = '1.0';
    //   this.amount = parseFloat(this.fund);
    // }
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  confirmWidhraw() {
    const confirm = this.alertCtrl.create({
      title: 'Withdraw funds?',
      message: 'Are to sure to withdraw funds?',
      buttons: [
        {
          text: 'CANCEL',
          handler: () => {
            console.log('CANCEL');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.btnwithdrawfund();
          }
        }
      ]
    });
    confirm.present();

  }
  enableButton(){
    if(this.wamount!==''){
        this.buttonD=true;
      // this.wamount=parseFloat(this.wamount).toFixed(2)
    }
    else{
      this.buttonD=false;
    }
  }
  updateFundObservable(){
    let user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    this.http.post(Details.URL+"/contest/getnotifibadget_funds", {userid:user['_id'],gametype: this.global.gameType}, this.optionHeader)
      .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1 != 'err'){
          if(data1){
              this.fundObservable.setFundNotification(Number(data1.balance))
          }
        }
      }, error => {
        //console.log(error);// Error getting the data
    });
    // let fund=Number(localStorage.getItem("fund"))
    // let newFund=fund - Number(this.wamount)
    // localStorage.setItem('fund',String(newFund.toFixed(2)))
    // this.fundObservable.setFund(newFund.toFixed(2))
  }
  goback() {
    this.navCtrl.pop();
  }
  keyup(val){
    if(this.platform.is('mobileweb')){
      const userAgent = window.navigator.userAgent.toLowerCase();
      if(/iphone|ipad|ipod/.test(userAgent)){
        this.calcKey(val)
      }
      else{
        this.wamount=val.target.value
        let value=this.wamount.replace(/[^0-9\.]/, '')
        if(value.includes('.')){
          let valslit=value.split('.');
          if(valslit.length>2){
              this.wamount=valslit[0]
            }
            else{
                let va1:any=valslit[1];
                let valLenght=va1.toString().length;
                if(valLenght > 2){
                  this.wamount=valslit[0]+'.'+va1.slice(0,-1)
                }
                else{
                  this.wamount=value
                }

            }
        }
        else{
          this.wamount=value
        }
      }
    }
    else{
      this.calcKey(val)
    }
  }
  calcKey(val){
    console.log(val)
    if(val.target.value!=''){
      if(this.wamount.includes('.')){
        let split=val.target.value.split('.')
        if(val.key=='Backspace'){
          this.oldVal=val.target.value;
          this.wamount=val.target.value
          return
        }
        else if(parseInt(val.key)){
          if(split.length<2){
            this.oldVal=val.target.value;
            this.wamount=val.target.value
            return
          }
        }
        else if(val.key=='.'){
          if(split.length>2){
            this.wamount=this.oldVal
            return
          }
          else{
          this.oldVal=val.target.value;
          this.wamount=val.target.value
          return
          }
        }
        if(split.length>2){
          this.wamount=this.oldVal
          return
        }
        if(split[1].length>2){
          this.wamount=this.oldVal
          return
        }
        // else{
        //   console.log('h')
        //   this.oldVal=val.target.value;
        //   this.wamount=val.target.value
        //   console.log(this.wamount)
        //   return
        // }
      }
      if(val.key=='.'){
        this.oldVal=val.target.value;
        this.wamount=val.target.value
      }
      else if(val.key=='Backspace'){
        this.oldVal=val.target.value;
        this.wamount=val.target.value
      }
      else if(parseInt(val.key)){
        this.oldVal=val.target.value;
        this.wamount=val.target.value
      }
      else if(val.key=='0'){
        this.oldVal=val.target.value;
        this.wamount=val.target.value
      }
      else if(val.key=='ArrowLeft' || val.key== 'ArrowRight' || val.key=='ArrowUp' || val.key=='ArrowDown'){
        return
      }
      else{
        this.wamount=''
        return
      }
    }
    // if(val!=''){
    //   let value=parseFloat(val)
    //   if(this.isFirstTime){
    //     this.isFirstTime=false
    //     this.wamount=(value.toFixed(2))
    //   }
    //   else{
    //     if(Math.floor(value.valueOf()) === value.valueOf()){
    //       this.wamount=val;
    //       console.log('val',val)
    //     }
    //     else{
    //       let decimalNumber=value.toString().split(".")[1].length
    //       console.log(decimalNumber)
    //       if(decimalNumber>2){
    //         this.wamount=value.toFixed(2)
    //       }
    //       else{
    //         this.wamount=value.toString();
    //       }
    //     }
    //   }
    // }
  }
  closePopup(){
    this.showpopup=false;
    this.wamount = "";
    this.withdrawOption=''
    this.note=''
  }
  closePopupW(){
    this.navCtrl.setRoot(HomePage)
  }
  GoToMyChallenge() {
      localStorage.setItem("setflag", "true");
      localStorage.setItem("setflag1", "false");
      this.navCtrl.setRoot(TabsPage);
  }
  editProfile(){
    this.navCtrl.push(EditProfilePage)
  }
  GoToBonus(){
    this.navCtrl.push(BonusFundPage)
  }
  mailToSupport() {
    if (this.platformType === 'BROWSER') {
        (<any>window).location.href = (<any>window).encodeURI("mailto:support@sporthitters.com?subject=''&body=''")
    } else {
        this.share.canShareViaEmail().then(() => {
            this.share.shareViaEmail('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', 'Subject', ['support@sporthitters.com'], [], []).then(() => {
            }).catch((err) => {
                alert(err)
            });
        }).catch((err1) => {
            alert(err1)
        });
    }
}
}
