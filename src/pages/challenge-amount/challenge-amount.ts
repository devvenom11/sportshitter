import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { FundObservable } from '../../services/fundObservable';
import { ChallengePicksPage } from '../challenge-picks/challenge-picks';

@Component({
  selector: 'page-challenge-amount',
  templateUrl: 'challenge-amount.html',
})
export class ChallengeAmountPage {
  fund:number = 0;
  sport;
  directFlag;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public fundObservable:FundObservable) {
      this.sport=this.navParams.get('sport')
      this.directFlag=this.navParams.get('directFlag')
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ChallengeHomePage');
  }

  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(res=>{
      this.fund=res;
    }
    ,e=>{
        console.log(e)
    })
  }

  gotoChallengePicks (val) {
    this.navCtrl.push(ChallengePicksPage,{create:'jc',amount:val,directFlag:this.directFlag, sport:this.sport});
  }

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }

}
