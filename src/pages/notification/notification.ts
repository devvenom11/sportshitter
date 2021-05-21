import { Component } from '@angular/core';
import { NavController, NavParams, AlertController,Events } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Global } from '../../services/Global';
import {environment as Details} from '../../environment';
import { TabsPage } from '../tabs/tabs';
import { FavouritesPage } from './../favourites/favourites';
import { FundfirstPage } from './../fundfirst/fundfirst';
import {Socket} from "ng-socket-io";
import * as moment from 'moment-timezone';
import { ContestSinglePage } from '../contest-single/contest-single';
import { FundObservable } from '../../services/fundObservable';
import { setDOM } from '@angular/platform-browser/src/dom/dom_adapter';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  notifiData:any = Array();
  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  showpopup:boolean=false;
  challengeName;
  challengeVal;
  showPopupToAccept:boolean=false;
  currentIndex;
  interval;
  hideDays:boolean=false;
  hideHours:boolean=false;
  earliestGame;
  earliestGameIndex;
  hideCounter:boolean=true;


  // temp, change it later
  disableAcceptButton = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private global: Global,
    public http:Http,
    public event:Events,
    public socket:Socket,
    private alertCtrl: AlertController,
    private fundObservable: FundObservable) {

      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json' );
      this.headers.append("x-auth",localStorage.getItem("token"));
      this.optionHeader=new RequestOptions({ headers: this.headers });
      // this.fund = localStorage.getItem("fund");
      // // this.fund = this.fund==null?"0":this.fund;
      // var a = parseFloat(this.fund);
      // a = Math.floor(a);
      // this.fund = this.fund==null?"0":a.toString();
      // event.subscribe('user:fund',() => {
      //     this.fund = localStorage.getItem("fund");
      //     // this.fund = this.fund==null?"0":this.fund;
      //     var a = parseFloat(this.fund);
      //     a = Math.floor(a);
      //     this.fund = this.fund==null?"0":a.toString();
      // });

  }

  ionViewDidLoad() {
    this.disableAcceptButton = false;
    this.fundObservable.funds.subscribe(
      res=>{
        this.fund=res
      },
      e=>{
        console.log(e)
      }
    )
    //console.log('ionViewDidLoad NotificationPage');
  }

  ionViewWillEnter() {
    this.getNotifiBudget();
  }
  clearInterval(){
    clearInterval(this.interval)
  }
  ionViewWillUnload(){
    this.clearInterval();
  }
  goFavourite() {
    this.navCtrl.push(FavouritesPage,{menu:false});
  }

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }

  getNotifiBudget(){
    var user1 = localStorage.getItem("loggedUser");
    var user = JSON.parse(user1);
    var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
        userid:user['_id'],
        gametype: this.global.gameType
    };
    // this.http.post(Details.URL+"/contest/getnotifibadget", postParams, this.optionHeader)
    this.http.post(Details.URL+"/contest/getnotifibadget_funds", postParams, this.optionHeader)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1 != 'err'){
            if(data1){
                // this.global.notifiBadget = [...data1];
                this.fundObservable.setFundNotification(Number(data1.balance))
                this.global.notifiBadget = [...data1.contestlist];
                this.notifiData = [...data1.contestlist]
                console.log(this.notifiData)
                // this.notifiData = [...data1]
            }
        }
    }, error => {
        //console.log(error);// Error getting the data
    });


  }

  decline(index){
    if(index==undefined){
      index=this.currentIndex
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    let postParams = {
      userid:user['_id'], contestid:this.notifiData[index]["_id"], accept:2,gametype: this.global.gameType
    };
    this.http.post(Details.URL+"/contest/manageinvite", postParams, this.optionHeader)
    .subscribe(response => {
      this.global.notifiBadget.splice(index,1);
      this.notifiData.splice(index,1);
      this.clearInterval();
      this.showPopupToAccept=false;
      //console.log("decline");
    },err =>{
      //console.log(err);
    });
  }

  isFundAvailableForChallenge(challengeAmount){
    if(Number(challengeAmount) <= Number(this.fund)){
      return true;
    }
    return true;
  }
  showInsufficientFundsAlert  (){
    let alert = this.alertCtrl.create({
      title: 'Insufficient Funds',
      message : 'Funds in your account are not enough to join this challenge.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Add Funds',
          handler: () => {
            this.goFund();
          }
        }
      ]
    });
    alert.present();
  }

  accept(){
    this.disableAcceptButton = true;
    let index=this.currentIndex;
    // localStorage.setItem("movetosingle-contest",'false');
    let name,showPopup, date=moment().tz('America/New_York').format('MM/DD/YYYY HH:mm');
    // let checkout=this.notifiData[index].checkedgroup[0];
    // COMPARE THE CHECKEDGROUP WHERE IS THE EARLIEST GAME
    let checkout=this.notifiData[index].checkedgroup[this.earliestGameIndex];
    checkout=JSON.parse(checkout)
    console.log('current time',date)
    console.log(checkout)
    // let test=moment('2019-09-09T18:25:00.000Z').format('YYYY-MM-DD HH:mm');
    checkout.forEach(element => {
      console.log(element)
      // if( moment(date).isAfter(moment(element.timeHours).format('YYYY-MM-DD HH:mm')) || moment(date).isSame(moment(element.timeHours).format('YYYY-MM-DD HH:mm'))){
      //   showPopup=false
      // }
      if(moment(date,'MM/DD/YYYY').isSame(moment(element.timeHours).format('MM/DD/YYYY'))){
        console.log('here 1')
        if(!showPopup){
          console.log('here 2')
          if(this.checkTime(element.timeHours)){
            console.log('here 3')
            showPopup=false
          }
          else{
            console.log('here 4')
            showPopup=true
          }
        }
      }
      else if(moment(date,'MM/DD/YYYY').isAfter(moment(element.timeHours).format('MM/DD/YYYY'))){
        showPopup=true;
        console.log('here 5')
      }
    });
    if(!showPopup){
      const challengeAmount =this. notifiData[index].game;
      if(Number(challengeAmount) <= Number(this.fund)){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        let postParams = {
          userid:user['_id'], contestid:this.notifiData[index]["_id"], accept:1,gametype: this.global.gameType
        };
        this.http.post(Details.URL+"/contest/manageinvite", postParams, this.optionHeader)
        .subscribe(response => {
          this.global.notifiBadget.splice(index,1);
          this.notifiData.splice(index,1);
          this.http.post(Details.URL+"/contest/getnotifibadget_funds", {userid:user['_id'],gametype: this.global.gameType}, this.optionHeader)
            .subscribe(data => {
                var data1 = JSON.parse(data['_body']);
                if(data1 != 'err'){
                    if(data1){
                      this.fundObservable.setFundNotification(Number(data1.balance))
                    }
                }
            }, error => {
                console.log(error);// Error getting the data
          });
          // this.fund = (Number(this.fund) - Number(challengeAmount)) + "";
          console.log(this.fund);
          // localStorage.setItem("fund",this.fund);
          // this.event.publish('user:fund');
          localStorage.setItem('comingfromnotification','true')
          localStorage.setItem("movetosingle-contest1",'true');
          let body=JSON.parse(response['_body'])
          console.log(body)
          console.log(body.data)
          // this.navCtrl.push(ContestSinglePage,{constestID:body.data._id});
          this.navCtrl.setRoot(TabsPage,{notification: true,data: JSON.parse(response['_body']).data });
        },err =>{
          //console.log(err);
        });
      }else{
        this.showInsufficientFundsAlert ();
      }
    }
    else{
      this.showpopup=true
      this.decline(this.currentIndex);
    }
  }
  checkTime(timeString){
    let time=new Date(timeString).getHours()+':'+new Date(timeString).getMinutes();
    console.log('game time', time)
    let nowTime=new Date().toISOString()
    let estDate=moment.tz(nowTime,'America/New_York');
    console.log('est',estDate)
    let ESTTime=moment(estDate).format('HH:mm')
    let diff=moment.duration(moment(ESTTime,'HH:mm').diff(moment(time,'HH:mm')));
    console.log(diff.asMinutes())
    // var hours = diff.hours();
    if(Math.sign(diff.asMinutes())==-1){
        if((diff.asMinutes()*-1)>2){
            return true
        }
        else{
            return false
        }
    }
    else{
        return false
    }
}
closePopup(){
    this.showpopup=false;
}
counter(date){
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
          // hide the countdown element
          // timeElement.classList.add("hidden");
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
    }
  },interval)
}
showAcceptPopup(index){
  this.currentIndex=index;
  let name;
  if(this.notifiData[index].contestname){
    name=this.notifiData[index].contestname
  }
  else{
    name=this.notifiData[index].game_id
  }
  this.challengeName=this.notifiData[index].sport.toUpperCase()+" "+name;
  let val = "";
  if(this.notifiData[index].game == -1){
    val = "Free";
  }
  else{
    val = "$"+this.notifiData[index].game;
  }
  this.challengeVal=val;
  let checkedgroup=[]
  this.notifiData[index].checkedgroup.forEach(res=>{
    if(res!=='[]'){
      checkedgroup.push(JSON.parse(res))
    }
  })
  // take the first pick value because checkedgroup is order by time.
  let checkedgroupArry = checkedgroup.map((d) => moment(d[0].timeHours))
  let minDate = moment.min(checkedgroupArry)
  this.earliestGame=minDate['_i'];
  console.log('earliest game',this.earliestGame)
  // get the index of checkgroup where is the earliest game
  checkedgroup.forEach((element,index) => {
    element.forEach(res=>{
      if(res.timeHours==this.earliestGame){;
        this.earliestGameIndex=index
      }
    })
  });
  this.showPopupToAccept=true;
  this.counter(this.earliestGame)
}
}
