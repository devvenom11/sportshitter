import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions , Headers} from '@angular/http';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';
import {environment as Details} from '../../environment';
import { SpecialPromoAuthPage } from '../special-promo-auth/special-promo-auth';
import {DomSanitizer} from '@angular/platform-browser';
import { ChallengePicksPage } from '../challenge-picks/challenge-picks';
import { JoinContestPage } from '../join-contest/join-contest';


@Component({
  selector: 'page-promo-home',
  templateUrl: 'promo-home.html',
})
export class PromoHomePage {
  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  loading;
  data;
  path=Details.URL;
  showData:boolean=true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public http:Http,
    public toast:ToastController,
    public global:Global,
    public fundObservable:FundObservable,
    public loadingCtrl:LoadingController,
    private sanitization:DomSanitizer) {
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json' );
      this.headers.append("x-auth",localStorage.getItem("token"));
      this.optionHeader=new RequestOptions({ headers: this.headers })
      this.getPromos();
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.fundObservable.funds.subscribe(res=>{
      this.fund=res;
    }
    ,e=>{
      console.log(e)
    })
  }
  goFund(){
    this.navCtrl.push(FundfirstPage);
  }
  getPromos(){
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
   });
   this.loading.present();
    this.http.get(`${Details.URL}/auth/specialpromolist`,this.optionHeader).subscribe(
      res=>{
        let data=JSON.parse(res['_body'])
        data.forEach(element => {
          element.promoimage= element.promoimage ? this.sanitization.bypassSecurityTrustStyle(`url( ${element.promoimage})`) :  this.sanitization.bypassSecurityTrustStyle(`url(./assets/img/loginbg.jpg)`) ;
        });
        this.data=data
        this.showData= this.data.length > 0 ? true : false
        console.log(this.data)
        this.loading.dismiss();
      },
      e=>{
        this.loading.dismiss();
        console.log(e)
      }
    )
  }
  gotoSpecialChallenge(item){
    if(item.passcode){
      this.navCtrl.push(SpecialPromoAuthPage,{item:item})
    }
  }
  goto(parameters){
    this.navCtrl.setRoot(ChallengePicksPage,parameters)
  }
  gotocustom(parameters){
    this.navCtrl.push(JoinContestPage,parameters)
  }
}
