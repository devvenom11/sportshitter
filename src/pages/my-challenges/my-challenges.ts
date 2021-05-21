import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from "../../services/Global";
import sportConfig from "../../app/sport-config";
import { JoinTournamentPage } from "../join-tournament/join-tournament";

/**
 * Generated class for the MyChallengesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-my-challenges',
  templateUrl: 'my-challenges.html',
})
export class MyChallengesPage {
  selectedSportKey: any;
  selectedSport: any;
  lightSelectedSport: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public global: Global) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyChallengesPage');
    this.selectedSportKey = this.navParams.get("sport");
    this.selectedSport = sportConfig[this.selectedSportKey];
    this.lightSelectedSport = sportConfig['light_'+this.selectedSportKey];
  }
  goJoinTournament(){
    this.navCtrl.push(JoinTournamentPage,{sport : this.selectedSportKey});
  }

}
