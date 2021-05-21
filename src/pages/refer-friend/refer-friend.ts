import { Component } from '@angular/core';
import { NavController, NavParams, Events,LoadingController, ToastController, Platform } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';

import { Global } from '../../services/Global';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { FundObservable } from '../../services/fundObservable';
import {environment as Details} from '../../environment';
import { PointsActivityPage } from '../points-activity/points-activity';
import { Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'page-refer-friend',
  templateUrl: 'refer-friend.html',
})
export class ReferFriendPage {
  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  rcode:string='';
  url;
  loading;
  email;
  loggedUser;
  showpopup:boolean=false;
  currentPoint:number;
  isExample:boolean=false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public http:Http,
    public toast:ToastController,
    public loadingCtrl: LoadingController,
    public global:Global,
    private toastCtrl: ToastController,
    public platform: Platform,
    public fundObservable:FundObservable) {
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json' );
      this.headers.append("x-auth",localStorage.getItem("token"));
      this.optionHeader=new RequestOptions({ headers: this.headers });
      let user = localStorage.getItem("loggedUser");
      this.loggedUser = JSON.parse(user);
      this.rcode=this.loggedUser.rcode;
      this.url=`https://app.sporthitters.com/?rcode=${this.rcode}`
      this.loading = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChallengeHomePage');
  }

  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(res=>{
      this.fund=res;
  }
  ,e=>{
      console.log(e)
  })
  this.http.get(`${Details.URL}/fund/referralbonus/${this.loggedUser._id}`,this.optionHeader).subscribe(
    res=>{
      let data=JSON.parse(res['_body']),total=0;
      data.forEach(element => {
        if(element.redeemedpoints){
          total-=element.redeemedpoints
        }
        else{
          total+=element.pointsearned
        }
      });
      this.currentPoint=total;
    },
    e=>{
      console.log(e)
    }
  )
  }
  copyLink(){
    let copy:any=document.getElementById("url-share");
    copy.select()
    copy.setSelectionRange(0, 99999);
    document.execCommand("copy")
    let toast = this.toastCtrl.create({
      message: "URL copy to the clipboard",
      duration: 3000,
      position: 'bottom'
  });
  toast.present();
  }
  goFund(){
    this.navCtrl.push(FundfirstPage);
  }
  invite(){
    let validation= new FormControl(this.email,Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'))
    if(this.email){
      if(validation.valid){
        this.loading.present();
        let data={
          "friendemail": this.email,
          "user_id": this.loggedUser._id,
          "referlink": `https://app.sporthitters.com/?rcode=${this.rcode}`
        }
        this.http.post(`${Details.URL}/auth/invitefriend`,data,this.optionHeader).subscribe(
          res=>{
            this.loading.dismiss()
            let toast = this.toastCtrl.create({
              message: "Email have been sent",
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          },
          e=>{
            this.loading.dismiss()
            console.log(e)
          }
        )
      }
      else{
        this.loading.dismiss()
        let toast = this.toastCtrl.create({
          message: "Email address don't have a correct format.",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    }
    else{
      this.loading.dismiss()
      let toast = this.toastCtrl.create({
        message: "Email Address is required.",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }
  Showpopup(){
    this.showpopup=true;
  }
  closePopup(){
    this.showpopup=false;
  }
  sharesocial(val){
    let appURL;
    appURL=(<any>window).location.hostname=='localhost' ? 'https://app.sporthitter.test123.dev' :(<any>window).location.hostname;
    switch(val){
      case 1://SMS
        if(this.platform.is('android')){
            (<any>window).location.href=(<any>window).encodeURI(`sms:?body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\n${appURL}/?rcode=${this.rcode}`)
        }else if(this.platform.is('ios')){
            (<any>window).location.href=(<any>window).encodeURI(`sms:&body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\n${appURL}/?rcode=${this.rcode}`)
        }
        this.showpopup=false;
      break;
      case 2://Facebook
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${appURL}/?rcode=${this.rcode}`, 'facebook-popup', 'height=350,width=600');
        this.showpopup=false;
      break;
      case 3://twitter
        window.open(`https://twitter.com/share?text=Join me on SportHitters for Daily Sports Challenges. Signup with my link.&url=${appURL}/?rcode=${this.rcode}`, 'twitter-popup', 'height=350,width=600');
        this.showpopup=false;
        break;
    }
  }
  goToPointActivity(){
    this.navCtrl.push(PointsActivityPage)
  }
  showExample(){
    this.isExample=true;
  }
}
