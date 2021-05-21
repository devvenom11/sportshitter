import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { FavouritesPage } from './../favourites/favourites';
import { CreateContestPage } from './../create-contest/create-contest';
import { JoinContestPage } from './../join-contest/join-contest';
import {environment as Details} from '../../environment';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FundfirstPage } from './../fundfirst/fundfirst';

@Component({
    selector: 'page-contest-detail',
    templateUrl: 'contest-detail.html',
})
export class ContestDetailPage {

    team:any;
    game:any;
    player:any;
    sportinfo:any;
    name:any;
    fund = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, public toast:ToastController, public event:Events) {
        event.subscribe('user:fund',() => {
            this.fund = localStorage.getItem("fund");
            var a = parseFloat(this.fund);
            a = Math.floor(a);
            this.fund = this.fund==null?"0":a.toString();
        });
        this.team = "6";
        this.game = "10";
        this.player = "1";
        this.sportinfo = this.navParams.get('data');
        this.name = this.navParams.get('name').toUpperCase();
        this.fund = localStorage.getItem("fund");
        var a = parseFloat(this.fund);
        a = Math.floor(a);
        this.fund = this.fund==null?"0":a.toString();
    }

    postRequest() {
        //this.navCtrl.push(ContestSelectPage,{name:this.name,player:this.player,team:this.team,game:this.game,sportinfo:this.sportinfo,joinflag:false});
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

    continue(){
        this.postRequest();
    }
}
