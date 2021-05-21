import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { FavouritesPage } from './../favourites/favourites';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { Global } from '../../services/Global';

@Component({
  selector: 'page-consultants',
  templateUrl: 'consultants.html',
})
export class ConsultantsPage {
  
  fund = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public event:Events, public global:Global) {
    
      this.fund = localStorage.getItem("fund");
      //  this.fund = this.fund==null?"0":this.fund;
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
    // //console.log('ionViewDidLoad ConsultantsPage');
  }

  goFavourite() {
    this.navCtrl.push(FavouritesPage,{menu:false});
  }

  goFund(){
      this.navCtrl.push(FundfirstPage);
  }


}
