import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { HomePage } from '../home/home';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';

@Component({
  selector: 'page-how-to-play',
  templateUrl: 'how-to-play.html',
})
export class HowToPlayPage {

  funds:number = 0;
  videoPopUp:boolean=false
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public global:Global,
    public fundObservable:FundObservable
    ) {
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(res=>{
            this.funds=res;
        }
        ,e=>{
            console.log(e)
        })
  }
  howtpplay() {
    this.navCtrl.push(FundfirstPage);
}

goFund(){
  this.navCtrl.push(FundfirstPage)
}
  showVideo(){
    this.videoPopUp=true;
  }
  closePopup(){
    this.videoPopUp=false;
  }

}
