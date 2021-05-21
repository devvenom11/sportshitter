import { Component } from '@angular/core';
import { NavController, ModalController, Events, ToastController, NavParams } from 'ionic-angular';
import { LoginPage } from './../login/login';
import { ContestChatPage } from './../contest-chat/contest-chat';
import { Http,RequestOptions,Headers } from '@angular/http';
import {environment as Details} from '../../environment';
import { Socket } from 'ng-socket-io';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';

@Component({
    selector: 'page-chatfeed',
    templateUrl: 'chatfeed.html'
})
export class ChatfeedPage {
    sports = [];
    sportsList = [];
    sportsCount;
    jsonOdd: any;
    fund:number=0;
    userinfo:any;
    upgrade = false;
    chatfeed = "";
    ids = [];
    names = [];
    teams: any;

    emails = [];
    scores = [];
    sarray = [];

    searchWord = "";
    searcheduserlist = [];
    userlist = [];
    badgeNum:any;
    badgeItemNum:any = Array();
    search:string;
    contestsportList = [];
    loading = true;
    statusArr:any = Array();
    headers = new Headers();
    optionHeader:any;
    //badge //status //user
    status:boolean = false;
    challengeID
    challenSport;
    challengeContest;
    challengeDate;
    challengeFlag
    challengeGame_id
    constructor(public toast:ToastController,
        public http:Http,
        public navCtrl: NavController,
        public modalCtrl: ModalController,
        public event:Events,
        public socket:Socket,
        private global: Global,
        public fundObservable:FundObservable,
        public navParams: NavParams) {

        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });


        this.userinfo = JSON.parse(localStorage.getItem("loggedUser"));
        this.upgrade = localStorage.getItem("upgrade")=="1"?true:false;
        this.challengeID=this.navParams.get('challengeID')
        this.challenSport=this.navParams.get('challenSport');;
        this.challengeContest=this.navParams.get('challengeContestchallengeDate');
        this.challengeDate=this.navParams.get('challengeDate');
        this.challengeFlag=this.navParams.get('challengeFlag');
        this.challengeGame_id=this.navParams.get('challengeGame_id');
        if(this.challengeID){
            this.chat(this.challengeID,this.challenSport,this.challengeContest,this.challengeDate,this.challengeFlag,this.challengeGame_id)
        }
        event.subscribe('user:profile',() => {
            this.userinfo = JSON.parse(localStorage.getItem("loggedUser"));
            this.getSports();
            this.chatfeed = this.userinfo.profile.chat;
            this.getfavuserlist();
        });
        if (this.userinfo == null) {
            this.navCtrl.setRoot(LoginPage);
        }
        // this.fund = localStorage.getItem("fund");
        // var a = parseFloat(this.fund);
        // a = Math.floor(a);
        // this.fund = this.fund==null?"0":a.toString();
        // event.subscribe('user:fund',() => {
        //     this.fund = localStorage.getItem("fund");
        //     var a = parseFloat(this.fund);
        //     a = Math.floor(a);
        //     this.fund = this.fund==null?"0":a.toString();
        // });

        this.chatfeed = this.userinfo.profile?this.userinfo.profile.chat : "";//"" or undefined
        if(this.chatfeed == "" || this.chatfeed == undefined){
            this.chatfeed = "Team";
        }
        this.getfavuserlist();

        event.subscribe('user:addfav',() => {
            this.getfavuserlist();
        });

        if(this.global.badge && this.status)
            this.badgeNum = Object.keys(this.global.badge).length;
        this.search = "hide";

        socket.on('disconnect-user',(data)=>{
            for(var i=0;i<this.global.statusList.length;i++){
                if(this.global.statusList[i].socketId == data.socketId){
                    this.global.statusList.splice(i,1);
                    break;
                }
            }
            var i=0;
            this.ids.forEach(element=>{
                this.statusArr[i] = 0;
                for(var j=0;j<this.global.statusList.length;j++){
                    if(this.global.statusList[j].userid == element){
                        this.statusArr[i] = 1;
                        break;
                    }
                }
                i++;
            });

        });

        this.socket.on('message',(data)=>{
            if(data.gameid == this.userinfo.userid){
                if(!this.status){
                    this.badgeNum = Object.keys(this.global.badge).length;
                }
                var i=0;
                this.ids.forEach(element=>{
                    if(!this.global.badge[element])
                        this.badgeItemNum[i] = 0;
                    else
                        this.badgeItemNum[i] = this.global.badge[element].length;
                    i++;
                });
            }

        });

        this.socket.on('connect-user',(data)=>{
            var flag = false;
            for(var i=0;i<this.global.statusList.length;i++){
                if(this.global.statusList[i].userid == data.userid){
                    flag = true;
                    this.global.statusList[i] = data;
                }
            }
            if(!flag)
                this.global.statusList.push(data);
            var i=0;
            this.ids.forEach(element=>{
                this.statusArr[i] = 0;
                for(var j=0;j<this.global.statusList.length;j++){
                    if(this.global.statusList[j].userid == element){
                        this.statusArr[i] = 1;
                        break;
                    }
                }
                i++;
            });
        });

        event.subscribe('getNewMessage',(data)=>{
            if(!this.status)
                this.badgeNum = Object.keys(global.badge).length;
            var i=0;
            this.ids.forEach(element=>{
                if(!this.global.badge[element])
                    this.badgeItemNum[i] = 0;
                else
                    this.badgeItemNum[i] = this.global.badge[element].length;
                i++;
            });
        });

    }
    segmentChanged($e){

    }

    ionViewDidLoad(){
        this.fundObservable.funds.subscribe(res=>{
            this.fund=res;
        }
        ,e=>{
            console.log(e)
        })
    }

    ionViewDidEnter(){
        this.getSports();
    }

    ionViewWillEnter() {
        if(this.status == true){
            this.badgeNum = 0;
        }else{
            this.badgeNum = Object.keys(this.global.badge).length;
        }
    }

    noUser(){
        this.status = false;
    }

    removeBadge(){
        this.status = true;
        this.badgeNum = 0;
    }
    /** My Challenge **/
    getSports() {
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);

       // var headers = new Headers();
       // headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
            userid:user['_id']
        }
        if( this.global.gameType == 'game1' ) {
            this.loading = true;
            this.http.post(Details.URL+"/contest/getMyContest", postParams, this.optionHeader)
            .subscribe(data => {
                    this.loading = false;
                    var originMyContest = JSON.parse(data['_body']);
                    this.contestsportList = originMyContest;
                }, error => {
                    this.loading = false;
                    //console.log(error);// Error getting the data
            });
        } else {
            this.loading = true;

            this.http.post(Details.URL+"/contest/getMyContest_game2", postParams, this.optionHeader)
            .subscribe(data => {
                    this.loading = false;
                    var originMyContest = JSON.parse(data['_body']);
                    originMyContest.sort(function(a, b){
                        var keyA = a.sport,
                            keyB = b.sport;
                        // Compare the 2 dates
                        if(keyA < keyB) return -1;
                        if(keyA > keyB) return 1;
                        return 0;
                    });
                    this.contestsportList = originMyContest;
                }, error => {
                    this.loading = false;
                    //console.log(error);// Error getting the data
            });
        }
    }

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    chat(id, sport, contest, date, flag,game_id){
        let comingfromSingleChallenge=this.challengeID ? true:false;
        this.navCtrl.push(ContestChatPage,{data:id, sport:sport, contest:contest,date:date,flag:flag,challenge:true,game_id:game_id,comingfromSingleChallenge:comingfromSingleChallenge});
    }

    chatSport(sport){
      this.navCtrl.push(ContestChatPage,{sport:sport,sportflag:true});
    }

    chatUser(sport, name,index=0){
        this.badgeItemNum[index] = 0;
        if(sport in this.global.badge)
            this.global.badge[sport] = Array();
        this.navCtrl.push(ContestChatPage,{sport:sport, userflag:true, name:name});
    }
    /** User Tab in Chatfeed **/
    getfavuserlist(){
        this.scores = [];
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        //var headers = new Headers();
       // headers.append("Accept", 'application/json');
       // headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
          userid:user['_id']
        }
        this.http.post(Details.URL+"/fav/getfavlist", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            if(data1.length > 0){
                if(localStorage.getItem("upgrade") != '1' && data1[0].favidlist.length>10){
                    this.ids = data1[0].favidlist.slice(0, 10);
                    this.names = data1[0].favnamelist.slice(0, 10);
                }else{
                    this.ids = data1[0].favidlist;
                    this.names = data1[0].favnamelist;
                }
                var i = 0;
                this.ids.forEach(element=>{
                    if(!this.global.badge[element])
                        this.badgeItemNum[i] = 0;
                    else
                        this.badgeItemNum[i] = this.global.badge[element].length;
                    this.statusArr[i] = 0;
                    for(var j=0;j<this.global.statusList.length;j++){
                        if(this.global.statusList[j].userid == element){
                            this.statusArr[i] = 1;
                            break;
                        }
                    }
                    i++;
                });
            }
            var user = localStorage.getItem("loggedUser");
            user = JSON.parse(user);
            /** Get Userlist and Score **/
            this.http.get(Details.URL+"/fav/getuserlist",this.optionHeader).subscribe(response => {
                if (response) {
                    var response1 = JSON.parse(response['_body']);
                    this.userlist = response1['userlist'];
                    this.sarray = response1['scorelist'];
                    this.ids.forEach(element => {
                        response1.userlist.forEach(element1 => {
                            if(element1._id == element){
                                this.emails.push(element1.email);
                            }
                        });
                    });

                    this.ids.forEach(element => {
                        var score = 0;
                        var scorecount = 0;
                        for(var i = 0; i < this.sarray.length; i++){
                            if(response1['scorelist'][i].userid == element){
                                score += response1['scorelist'][i].score;
                                scorecount++;
                            }
                        }
                        score = scorecount==0?0:Math.ceil(score/scorecount);
                        this.scores.push(score);
                    });
                }
            },error => {
                //console.log(error);
            });
        }, error => {
            //console.log(error);// Error getting the data
        });
    }

    showToast(msg) {
        let toast = this.toast.create({
          message: msg,
          duration: 2000
        });
        toast.present();
    }
}
