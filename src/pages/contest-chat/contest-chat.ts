import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { FavouritesPage } from './../favourites/favourites';
import { FavoriteDetailPage } from './../favorite-detail/favorite-detail';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';

@Component({
    selector: 'page-contest-chat',
    templateUrl: 'contest-chat.html',
})
export class ContestChatPage {

    message = "";
    data = [];
    messages = [];
    nickname = "";
    myid = "";
    prevchatpos = 0;
    sport = "";
    awayTeam = "";
    homeTeam = "";
    score = 0;
    fund:number = 0;
    sportflag = false;
    userflag = false;
    team="";
    name = "";
    myname="";
    userid = "";

    //jami
    challengeFlag = false;
    contest = null;
    date = null;
    flag = null;
    customer = false;
    // used to add css
    isChromeBrowser = false;
    headers = new Headers();
    optionHeader:any;
    game_id:string;
    comingfromSingleChallenge:boolean=false;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http:Http,
        public socket:Socket,
        public toast:ToastController,
        public event:Events,
        private global:Global,
        private fundObservable: FundObservable) {

        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });
        this.sport = this.navParams.get('sport');
        this.sportflag = this.navParams.get('sportflag')===true?true:false;
        this.userflag = this.navParams.get('userflag')===true?true:false;
        this.comingfromSingleChallenge=this.navParams.get('comingfromSingleChallenge')
        this.team = this.navParams.get('team')==undefined?"":this.navParams.get('team');
        this.challengeFlag = this.navParams.get('challenge')!=undefined&&true;
        this.customer = this.navParams.get('customer');
        if(this.customer) {
            this.nickname = "customer"
        } else
        if(this.sportflag){
            this.nickname = this.sport;
        }
        else if(this.team!=""){
            this.nickname = this.navParams.get('data');
        }
        else if(this.userflag){
            this.nickname = this.sport;
            this.name = this.navParams.get('name');
            var user = localStorage.getItem("loggedUser");
            user = JSON.parse(user);
            this.userid = user['_id'];
            this.myname = user['username'];
        }
        else if(this.challengeFlag){
            this.nickname = this.navParams.get('data');
            this.contest = this.navParams.get('contest');
            this.date = this.navParams.get('date');
            this.flag = this.navParams.get('flag');
            this.game_id=this.navParams.get('game_id')
        }
        else{
            this.nickname = this.navParams.get('data').ID;
        }
        this.sport = this.navParams.get('sport');
        this.awayTeam = this.navParams.get('awayTeam');
        this.homeTeam = this.navParams.get('homeTeam');
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        this.myid = user['_id'];
        this.socket.emit('set-nickname', {gameid:this.nickname, username:user['username']});
        this.getprevmsg();
        this.getMessages().subscribe(message => {
            this.messages.push(message);
            this.autoScroll();
        });
        this.checkChromeBrowser();
    }



    goFavourite() {
        this.navCtrl.push(FavouritesPage,{menu:false});
    }

    goFund(){
        this.navCtrl.push(FundfirstPage);
    }

    autoScroll() {
        setTimeout(function () {
            var myElement = document.getElementById('chat-autoscroll');  // Container which has scrollable vertical contents
            myElement.scrollTop = myElement.scrollHeight;
        }, 10);
    }

    getUsers() {
        let observable = new Observable(observer => {
          this.socket.on('users-changed', (data) => {
              if(this.nickname == data.gameid){
                observer.next(data);
              }
          });
        });
        return observable;
      }

    getMessages() {
        let observable = new Observable(observer => {
          this.socket.on('message', (data) => {
            //   if(this.userid != ""){
                if(this.userid == data.gameid){
                    observer.next(data);
                }
            //   }else{
                if(this.nickname == data.gameid){
                    observer.next(data);
                }
              //}

          });
        })
        return observable;
    }

    showToast(msg) {
        let toast = this.toast.create({
          message: msg,
          duration: 2000
        });
        toast.present();
      }

    ionViewDidLoad() {
        this.fundObservable.funds.subscribe(res=>{
            this.fund=res;
            }
            ,e=>{
              console.log(e)
        })
    }

    ionViewWillEnter(){
        if(this.sportflag || this.team!='' || this.userflag){
            document.getElementById("chat-autoscroll").style.height = "calc( 100% - 11.6rem - 56px - 56px )";
        }
        else{
            document.getElementById("chat-autoscroll").style.height = "calc( 100% - 11.6rem - 56px - 107px )";
        }
    }

    setmsg(str){
        this.message = str;
    }

    ionViewWillLeave() {
        // this.socket.disconnect();
    }

    sendmsg(){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        this.socket.emit('add-message', { text: this.message,name:user['username'], userid:user['_id'], gameid:this.nickname});
        //var headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        ///let options = new RequestOptions({ headers: headers });
        let postParams = {
            text: this.message,name:user['username'], userid:user['_id'], gameid:this.nickname,sport:this.sport,away:this.awayTeam,home:this.homeTeam
        }
        this.message = "";
        this.http.post(Details.URL+"/chat/savechat", postParams, this.optionHeader)
        .subscribe(data => {

            }, error => {
                //console.log(error);// Error getting the data
        });

    }

    getprevmsg(){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
       // var headers = new Headers();
       // headers.append("Accept", 'application/json');
       // headers.append('Content-Type', 'application/json' );
       // let options = new RequestOptions({ headers: headers });

        let postParams = {
            pos: this.prevchatpos, gameid:this.nickname, userid:user['_id'], userflag:this.userflag
        }
        this.http.post(Details.URL+"/chat/getprevchat", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            //console.log(data1);
            for(var i = 0; i < data1.length; i++){
                var date = new Date();
                if(this.challengeFlag){
                    var nowDate = new Date();
                    var date = new Date(data1[i].timestamp);
                    if( nowDate.getDate() === date.getDate())
                        this.messages.splice(0,0,{gameid:this.nickname,text:data1[i].msg,created:data1[i].timestamp,from:data1[i].username,userid:data1[i].userid});
                }else{
                    this.messages.splice(0,0,{gameid:this.nickname,text:data1[i].msg,created:data1[i].timestamp,from:data1[i].username,userid:data1[i].userid});
                }
                //console.log(this.messages);
                this.autoScroll();
            }
            this.prevchatpos += data1.length;
            }, error => {
                //console.log(error);// Error getting the data
        });
    }

    doInfinite(infiniteScroll) {
        //var headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
            pos: this.prevchatpos+1, gameid:this.nickname
        }

        this.http.post(Details.URL+"/chat/getprevchat", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            for(var i = 0; i < data1.length; i++){
                this.messages.splice(0,0,{gameid:this.nickname,text:data1[i].msg,created:data1[i].timestamp,from:data1[i].username,userid:data1[i].userid});
            }
            this.prevchatpos += data1.length;
            infiniteScroll.complete();
            }, error => {
                //console.log(error);// Error getting the data
                infiniteScroll.complete();
        });

    }

    addfav(userid, username){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        if(user['_id'] == userid)
            return;
        this.getuserlist(userid, username);
    }

    getuserlist(userid, username){

        this.http.get(Details.URL+"/fav/getuserlist",this.optionHeader).subscribe(response => {
            if (response) {
                var response1 = JSON.parse(response['_body']);
                var sarray = response1['scorelist'];
                this.navCtrl.push(FavoriteDetailPage,{userid:userid, username:username, fav:0, score:this.score, sarray:sarray});
            }
        },
        error => {
          //console.log(error);
        });
    }
    checkChromeBrowser(){
        this.isChromeBrowser = (<any>window).chrome ? true : false;
        // if(navigator){
        //     this.isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        // }
    }
    goBack(){
        if(this.comingfromSingleChallenge){
            this.navCtrl.popTo(this.navCtrl.getByIndex(this.navCtrl.length() - 3));
        }
    }
}
