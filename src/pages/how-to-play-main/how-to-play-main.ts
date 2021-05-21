import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';

@Component({
  selector: 'page-how-to-play',
  templateUrl: 'how-to-play-main.html',
})
export class HowToPlayMainPage {

  public fund = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public global:Global,
    public fundObservable:FundObservable
    ) {
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      res => {
        this.fund = res
      },
      e => {
        console.log(e)
      }
    );
  }
  howtpplay() {
    this.navCtrl.push(TabsPage);
}
closeModal1(){
  this.navCtrl.setRoot(TabsPage);
}

goFund(){
  this.navCtrl.push(FundfirstPage);
}

}
