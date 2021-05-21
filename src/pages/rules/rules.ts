import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FundObservable } from '../../services/fundObservable';
import { Global } from '../../services/Global';
import { FundfirstPage } from '../fundfirst/fundfirst';

@Component({
  selector: 'page-rules',
  templateUrl: 'rules.html',
})
export class RulesPage {

  public fund = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public fundObservable:FundObservable,
    public global:Global
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

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }

}
