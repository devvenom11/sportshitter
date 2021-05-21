import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FavouritesPage } from './../favourites/favourites';
import { CreateContestPage } from './../create-contest/create-contest';
import { JoinContestPage } from './../join-contest/join-contest';
import { ContestDetailPage } from './../contest-detail/contest-detail';
import { Http,Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { Global } from '../../services/Global';

@Component({
    selector: 'page-contest-sport',
    templateUrl: 'contest-sport.html',
})
export class ContestSportPage {
    items: any;
    fund = "";
    headers = new Headers();
    optionHeader:any;
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public global: Global,
        public http:Http,
        public event:Events) {
        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });
        this.items = [];
        this.getSports();
        this.fund = localStorage.getItem("fund");
        // this.fund = this.fund==null?"0":this.fund;
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
    }

    ionViewDidLoad() {
        //console.log('ionViewDidLoad ContestMainPage');
    }

    /**
    * Navigate to favourite page
    */
    goFavourite() {
        this.navCtrl.push(FavouritesPage,{menu:false});
    }
    goFund(){
        this.navCtrl.push(FundfirstPage);
    }

    /**
    * Navigate to create contest page
    */
    goToCreateContest() {
        this.navCtrl.push(CreateContestPage,{tab:false});
    }

     /**
    * Navigate to join contest page
    */
    goToJoinContest() {
        this.navCtrl.push(JoinContestPage);
    }

    /** get sport list from odd api */
    getSports() {

        //this.items = ['NFL','MLB','NHL','NBA','GOLF','NCAAB','NCAAF'];
        // this.items = ['NFL','NHL','NBA','GOLF','NCAAB','NCAAF'];//['mlb','nfl','ncaaf']
        // this.items = ['MLB','NFL','NCAAF'];
        if(this.global.gameType == "game1")
            this.items = ['NFL','NCAAF','NHL'];
        else
            this.items = ['NFL','NCAAF','NHL','NBA'];
    }

    godetail(sport){
        var sp = sport.toLowerCase();
        this.http.get(Details.URL+"/odds/getsportstypegame:"+sp,this.optionHeader).subscribe(response => {
            if (response) {
                response = JSON.parse(response['_body']);
                response = JSON.parse(response['data']);
                this.navCtrl.push(ContestDetailPage, {name:sp,data:response});
            }
        },
        error => {
            //console.log(error);
        });
    }
}
