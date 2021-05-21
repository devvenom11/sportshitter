import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { TabsPage } from './../tabs/tabs';
import { FavouritesPage } from './../favourites/favourites';
import { FundfirstPage } from './../fundfirst/fundfirst';

@Component({
  selector: 'page-preference',
  templateUrl: 'preference.html',
})
export class PreferencePage {

  fund = "";
  gender = '';
  age = '';
  team = '';
  sport = '';
  presport = '';
  place = '';
  cocktail = '';

  constructor(public http:Http,public navCtrl: NavController, public navParams: NavParams, public event:Events, public toast:ToastController) {

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

    // this.gender = 'm';
    // this.cocktail = 'ff';
    // this.sport = 'NFL'

    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    if(user['account'] != undefined){
      this.gender = user['account'].gender;
      this.age = user['account'].age;
      this.cocktail = user['account'].cocktail;
      this.place = user['account'].place;
      this.presport = user['account'].presport;
      this.sport = user['account'].sport;
      this.team = user['account'].team;
    }

  }

  ionViewDidLoad() {
    // //console.log('ionViewDidLoad PreferencePage');
  }

  submit(){
    if(this.gender == '' || this.age == '' || this.team == '' || this.sport == '' || this.presport == ''
    || this.place == '' || this.cocktail == ''){
      this.showToast('Invalid Value!');
      return;
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    var headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json' );
    headers.append("x-auth",localStorage.getItem("token"));
    let options = new RequestOptions({ headers: headers });
    let postParams = {
        userid:user['_id'],gender: this.gender, age:this.age, team: this.team, sport:this.sport, presport: this.presport, place:this.place, cocktail:this.cocktail
    }

    this.http.post(Details.URL+"/user/addaccount", postParams, options)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1.message != 'err'){
          this.showToast("Success!");
          var userinfo = JSON.parse(localStorage.getItem('loggedUser'));
          userinfo['account'] = postParams;
          localStorage.removeItem('loggedUser');
          localStorage.setItem('loggedUser', JSON.stringify(userinfo));
          this.event.publish('user:profile');
          this.navCtrl.setRoot(TabsPage);
        }
        else{
          this.showToast("Failed!");
        }
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

  changeGender(g){
    this.gender = g;
  }

  goFavourite() {
    this.navCtrl.push(FavouritesPage,{menu:false});
  }

  goFund(){
      this.navCtrl.push(FundfirstPage);
  }

}
