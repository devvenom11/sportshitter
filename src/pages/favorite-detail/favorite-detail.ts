import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { Global } from '../../services/Global';

@Component({
    selector: 'page-favorite-detail',
    templateUrl: 'favorite-detail.html',
})
export class FavoriteDetailPage {
    username = "";
    userid = "";
    //sportarray = [];
    resulttotalarray : any;
    //scorearray = [];
    finalscorearray = [];
    chatarray = [];
    chatlngarray = [];
    gameidarray = [];
    favflag = 0;
    score = 0;
    homearray = [];
    awayarray = [];
    home = "";
    away = "";
    selectedinx = -1;
    sarray = [];

    scoreList = [];
    sportList = [];
    sportNumList = [];

    sport = "";
    presport = "";
    place = "";
    cocktail = "";
    team = "";
    fund = "";
    headers = new Headers();
    optionHeader:any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public global:Global,public event:Events) {

        this.fund = localStorage.getItem("fund");
        var a = parseFloat(this.fund);
        a = Math.floor(a);
        this.fund = this.fund==null?"0":a.toString();
        event.subscribe('user:fund',() => {
            this.fund = localStorage.getItem("fund");
            // this.fund = this.fund==null?"0":this.fund;
            var a = parseFloat(this.fund);
            a = Math.floor(a);
            this.fund = this.fund==null?"0":a.toString();
        });

        this.username = this.navParams.get('username').toUpperCase();
        this.userid = this.navParams.get('userid');
        this.score = this.navParams.get('score');

        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });


        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        this.navParams.get('sarray').forEach(element => {

            if(element.userid == user['_id'])
            {
                if(this.sportList.indexOf(element.sport) != -1) {
                    this.scoreList[this.sportList.indexOf(element.sport)] += element.score;
                    this.sportNumList[this.sportList.indexOf(element.sport)]++;
                } else {
                    this.sportList.push(element.sport);
                    this.scoreList.push(element.score);
                    this.sportNumList.push(1);
                }
            }
        });
        if(this.navParams.get('fav')==0){
            this.getallfavinfo();
        }
        else{
            this.favflag = 1;
        }
        this.getchatinfo();
    }

    ionViewDidLoad() {
        //var headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
            userid: this.userid
        }

        this.http.post(Details.URL+"/user/getprofile", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            if(data1.account) {
                this.sport = data1.account.sport;
                this.team = data1.account.team;
                this.presport = data1.account.presport;
                this.place = data1.account.place;
                this.cocktail = data1.account.cocktail;
            }
        },error => {
            //console.log(error);
        });
    }

    showdetail(inx){
        if(this.selectedinx == inx){
            this.selectedinx = -1;
            this.home = "";
            this.away = "";
        }
        else{
            this.home = this.homearray[inx];
            this.away = this.awayarray[inx];
            this.selectedinx = inx;
        }

    }

    gochat(inx){
        // this.http.get(Details.URL+"/odds/getodds:"+this.gameidarray[inx]).subscribe(response => {
        //     if (response) {
        //         response = JSON.parse(response['_body']);
        //         var responsearr = JSON.parse(response['data']);
        //         this.navCtrl.setRoot(ContestChatPage,{data:responsearr[0], sport:this.chatarray[inx], awayTeam:this.away, homeTeam:this.home});
        //     }
        // },
        // error => {
        //   //console.log(error);
        // });
    }

    getallfavinfo(){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);

        //var headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
          userid:user['_id']
        }

        this.http.post(Details.URL+"/fav/getfavlist", postParams, this.optionHeader)
        .subscribe(data => {
              var data1 = JSON.parse(data['_body']);
              var fav = data1[0].favidlist.indexOf(this.userid);
              if(fav !== -1){
                this.favflag = 1;
              }
            }, error => {
                //console.log(error);// Error getting the data
        });
    }

    getchatinfo(){

        //var headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
            userid: this.userid
        }

        this.http.post(Details.URL+"/fav/getallchatbyuser", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            var temp = "";
                data1.forEach(element => {
                    if(element.sport != temp && element.sport &&element.sport.length<=5 && element.home!=undefined && element.away!=undefined){
                        this.chatarray.push(element.sport);
                        this.homearray.push(element.home);
                        this.awayarray.push(element.away);
                        this.gameidarray.push(element.gameid);
                        temp = element.sport;
                        if(this.chatlngarray[this.chatarray.length-1]==undefined){
                            this.chatlngarray[this.chatarray.length-1]=0;
                        }
                        this.chatlngarray[this.chatarray.length-1]++;

                    }
                });
            }, error => {
                //console.log(error);// Error getting the data
        });
    }

    setfav(val){
        var user = localStorage.getItem("loggedUser");
        user = JSON.parse(user);
        if(user['_id'] == this.userid)
            return;
       // var headers = new Headers();
       // headers.append("Accept", 'application/json');
       // headers.append('Content-Type', 'application/json' );
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
            favid: this.userid, favname:this.username, userid:user['_id'], flag:val
        }
        this.http.post(Details.URL+"/fav/addfav", postParams, this.optionHeader)
        .subscribe(data => {
            var data1 = JSON.parse(data['_body']);
            if(data1.message == 'ok'){
                this.favflag = val;
            }
        }, error => {
                //console.log(error);// Error getting the data
        });
    }

    goFund(){
        this.navCtrl.push(FundfirstPage);
    }
}
