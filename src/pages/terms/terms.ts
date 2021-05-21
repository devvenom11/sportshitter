import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';

@Component({
  selector: 'terms',
  templateUrl: 'terms.html',
})
export class TermsPage {
  fund = 0;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public global: Global,
    public fundObservable: FundObservable
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
