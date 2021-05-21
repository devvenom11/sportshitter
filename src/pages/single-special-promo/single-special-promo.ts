import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController, Platform } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';
import {environment as Details} from '../../environment';
import {DomSanitizer} from '@angular/platform-browser';
import * as moment from 'moment-timezone';
import { ReferFriendPage } from '../refer-friend/refer-friend';
import { ContestSelectPage } from '../contest-select/contest-select';
import { ContestSinglePage } from '../contest-single/contest-single';

@Component({
  selector: 'page-single-special-promo',
  templateUrl: 'single-special-promo.html',
})
export class SingleSpecialPromoPage {

  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  loading;
  itemID;
  loggedUser;
  promoData;
  challengeData;
  interval;
  hideDays:boolean=false;
  hideHours:boolean=false;
  hideCounter:boolean=true;
  showData:boolean=false;
  rcode;
  label:string='MAKE PICKS';
  showCounter:boolean=false;
  challengeStarted:boolean=false;
  showbutton:boolean=true;
  haveCheckedgroup:boolean=false;
  fullTimeLabel:string;
  labelEndDate:string;
  showLabel:boolean=true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public http:Http,
    public toast:ToastController,
    public global:Global,
    public fundObservable:FundObservable,
    public loadingCtrl:LoadingController,
    private sanitization:DomSanitizer,
    public platform: Platform) {
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json' );
      this.headers.append("x-auth",localStorage.getItem("token"));
      this.optionHeader=new RequestOptions({ headers: this.headers })
      let user = localStorage.getItem("loggedUser");
      this.loggedUser = JSON.parse(user);
      this.itemID=this.navParams.get('challenge')._id
      this.rcode=this.loggedUser.rcode;
      console.log(this.itemID)
      this.getCurrentPromoInfo();
  }

  ionViewDidLoad() {

  }
  ionViewWillUnload(){
    this.clearInterval();
  }
  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(res=>{
      this.fund=res;
    }
    ,e=>{
      console.log(e)
    })
  }
  getCurrentPromoInfo(){
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
    this.http.get(`${Details.URL}/auth/single_specialpromolist/${this.itemID}`,this.optionHeader).subscribe(
      res=>{
        let data=JSON.parse(res['_body'])
        this.promoData=data.promo[0];
        this.challengeData=data.challenge;
        console.log(this.promoData)
        console.log(this.challengeData)
        this.promoData.promoimage=  this.promoData.promoimage ? this.sanitization.bypassSecurityTrustStyle(`url( ${this.promoData.promoimage})`):  this.sanitization.bypassSecurityTrustStyle(`url(./assets/img/loginbg.jpg)`) ;
        this.showData=true;
        this.labelEndDate=moment(this.promoData.challenge_end.split('.')[0]).format('MMMM D,YYYY hh:mm a')
        this.counter(this.promoData.challenge_start,'start')
        this.showCounter=true;
        // if(this.challengeData.resultlist.length > 0){
        //   if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
        //     this.label="DETAILS"
        //     this.showbutton=true;
        //   }
        //   else{
        //     this.showbutton=false;
        //   }
        //   this.showCounter=false;
        //   this.challengeStarted=true
        // }
        // else{
        //   let checkedgroup=[]
        //   this.challengeData.checkedgroup.forEach(res=>{
        //     if(res!=='[]'){
        //       checkedgroup.push(JSON.parse(res))
        //     }
        //   })
        //   let checkedgroupArry = checkedgroup.map((d) => {
        //     if(d.length>0){
        //       return moment(d[0].timeHours)
        //     }
        //   })
        //   // remove empty data.
        //   checkedgroupArry = checkedgroupArry.filter(function (el) {
        //     return el != null;
        //   });
        //   if(checkedgroupArry.length>0){
        //     this.haveCheckedgroup=true;
        //      // take the first pick value because checkedgroup is order by time.
        //     let checkedgroupArry = checkedgroup.map((d) => moment(d[0].timeHours))
        //     let minDate = moment.min(checkedgroupArry)
        //     if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
        //       if(this.challengeData.checkedgroup[this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])]=='[]'){
        //         this.label="MAKE PICKS"
        //       }
        //       else{
        //         this.label="DETAILS"
        //       }
        //     }
        //     console.log('earliest game',minDate._i)
        //     this.counter(minDate._i)
        //     this.showCounter=true;
        //   }
        //   else{
        //     this.haveCheckedgroup=false;
        //     this.showCounter=true;
        //     this.counter(this.promoData.challenge_start)
        //     // this.label="MAKE PICKS"
        //   }
        // }
        this.loading.dismiss()
      },
      e=>{
        this.showData=false;
        this.loading.dismiss()
        console.log(e)
      }
    )
  }
  goFund(){
    this.navCtrl.push(FundfirstPage);
  }
  counter(date,value){
    // remove 00Z from the date to fix issue with timezone
    date=date.split('.')[0]
    //IOS was converting the time so i set the time in this way.
    date=moment(date).format('MM/DD/YYYY hh:mm A')
    let timeString=new Date(date)
    let month=timeString.getMonth() +1
    // used '/' instead of '-' because IOS show issues.
    let time=timeString.getFullYear()+'/'+ month +'/'+ timeString.getDate() + ' '+ timeString.getHours()+':'+timeString.getMinutes()+':'+timeString.getSeconds();
    let momentFormat=moment(time),fullTime;
    fullTime=momentFormat.format('YYYY-MM-DD')+'T'+momentFormat.format('HH:mm:ss')
    fullTime=fullTime.toString();
    let eventTime, currentTime, duration, interval, intervalId,days,hours,minutes,seconds;
    interval = 1000;
    eventTime = moment.tz(fullTime,"America/New_York")
    currentTime = moment.tz("America/New_York");
    duration = moment.duration(eventTime.diff(currentTime));
    this.interval=setInterval(()=>{
        // get updated duration
        duration = moment.duration(duration - interval, 'milliseconds');
        if (duration.asSeconds() <= 0) {
          this.hideDays= true;
          this.hideHours= true;
          document.querySelector('.minutes0').innerHTML = "0"
          document.querySelector('.minutes1').innerHTML = "0"
          document.querySelector('.seconds0').innerHTML = "0"
          document.querySelector('.seconds1').innerHTML = "0"
            clearInterval(intervalId);
            this.clearInterval();
            this.showCounter=false;
            if(value=='end'){
              this.showLabel=false;
              if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
                // if(this.challengeData.checkedgroup[this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])]=='[]'){
                  this.label='DETAILS'
                // }
              }
            }
            else{
              this.counter(this.promoData.challenge_end,'end')
              this.showCounter=true
            }
            // if(this.challengeData.checkedgroup[0]=='[]'){
            //   this.label='MAKE PICKS'
            //   this.challengeStarted=false;
            //   this.showbutton=true;
            // }
            // else{
            //   if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
            //     this.showbutton=true;
            //     this.label='DETAILS'
            //   }
            //   else{
            //     this.showbutton=false;
            //   }
            //   this.challengeStarted=true;
            // }
          this.hideCounter=false;
        } else {
            days=duration.days().toString().length > 1 ? duration.days().toString().split('') : [0,duration.days().toString()];
            hours=duration.hours().toString().length > 1 ? duration.hours().toString().split('') : [0,duration.hours().toString()];
            minutes=duration.minutes().toString().length > 1 ? duration.minutes().toString().split('') : [0,duration.minutes().toString()];
            seconds= duration.seconds().toString().length > 1 ? duration.seconds().toString().split('') : [0,duration.seconds().toString()];
            this.hideDays= Number(days[0]+days[1]) > 0 ? false: true;
            this.hideHours= Number(hours[0]+hours[1]) > 0 ? false: true;
            if(!this.hideDays){
              document.querySelector('.days0').innerHTML = days[0]
              document.querySelector('.days1').innerHTML = days[1]
            }
            if(!this.hideHours){
              document.querySelector('.hours0').innerHTML = hours[0]
              document.querySelector('.hours1').innerHTML = hours[1]
            }
            document.querySelector('.minutes0').innerHTML = minutes[0]
            document.querySelector('.minutes1').innerHTML = minutes[1]
            document.querySelector('.seconds0').innerHTML = seconds[0]
            document.querySelector('.seconds1').innerHTML = seconds[1]
            this.hideCounter=false;
            // if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
            //   if(this.challengeData.checkedgroup[this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])]=='[]'){
            //     this.label='MAKE PICKS'
            //   }
            //   else{
            //     this.label='DETAILS'
            //   }
            // }
            if(value=='start'){
              this.showbutton=false;
              this.fullTimeLabel=moment(fullTime).format('MMMM D,YYYY hh:mm a');
              this.challengeStarted=false
            }
            else{
              this.challengeStarted=true
              if(this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])!=-1){
                if(this.challengeData.checkedgroup[this.challengeData.userlist.findIndex(x => x ===this.loggedUser['_id'])]=='[]'){
                  this.label='MAKE PICKS'
                }
                else{
                  this.label='DETAILS'
                }
              }
              this.showbutton=true;
            }
            // if(!this.haveCheckedgroup){
            //   this.showbutton=false;
            // }
      }
    },interval)
  }
  clearInterval(){
    clearInterval(this.interval)
  }
  sharesocial(val){
    switch(val){
      case 0://email
        this.navCtrl.push(ReferFriendPage)
      case 1://SMS
        if(this.platform.is('android')){
            (<any>window).location.href=(<any>window).encodeURI(`sms:?body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\nhttps://app.sporthitters.com/?rcode=${this.rcode}`)
        }else if(this.platform.is('ios')){
            (<any>window).location.href=(<any>window).encodeURI(`sms:&body=Join me on SportHitters for Daily Sports Challenges. Signup with my link.\nhttps://app.sporthitters.com/?rcode=${this.rcode}`)
        }
      break;
      case 2://Facebook
        window.open(`https://www.facebook.com/sharer/sharer.php?u=https://app.sporthitters.com/?rcode=${this.rcode}`, 'facebook-popup', 'height=350,width=600');
      break;
      case 3://twitter
        window.open(`https://twitter.com/share?text=Join me on SportHitters for Daily Sports Challenges. Signup with my link.&url=https://app.sporthitters.com/?rcode=${this.rcode}`, 'twitter-popup', 'height=350,width=600');
        break;
    }
  }
  picks(){
    this.clearInterval();
    if(this.label=='DETAILS'){
      this.showCounter=false;
      this.navCtrl.push(ContestSinglePage,{'constestID':this.challengeData._id})
    }
    else{
      this.showCounter=false;
      this.navCtrl.push(ContestSelectPage,{'challengeName':this.challengeData.contestname,'currentcontestid':this.challengeData.promoid,'player':this.challengeData.player,'game':this.challengeData.game,'directFlag':this.challengeData.directflag, 'sport':this.challengeData.sport,'create':this.challengeData.flag,'team':this.promoData.picks})
    }
  }
}
