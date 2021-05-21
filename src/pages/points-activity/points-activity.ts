import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { FundObservable } from '../../services/fundObservable';
import {environment as Details} from '../../environment';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { ReferFriendPage } from '../refer-friend/refer-friend'
import { Global } from '../../services/Global';;

/**
 * Generated class for the PointsActivityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-points-activity',
  templateUrl: 'points-activity.html',
})
export class PointsActivityPage {
  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  loading;
  amount;
  loggedUser;
  showpopup:boolean=false;
  data;
  totalPoints;
  showempty:boolean=false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http:Http,
    public toast:ToastController,
    public loadingCtrl: LoadingController,
    public fundObservable:FundObservable,
    public global:Global) {
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json' );
    this.headers.append("x-auth",localStorage.getItem("token"));
    this.optionHeader=new RequestOptions({ headers: this.headers });
    let user = localStorage.getItem("loggedUser");
    this.loggedUser = JSON.parse(user);
    this.loading = loadingCtrl.create({
      content: 'Please Wait...'
   });
  }

  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(res=>{
      this.fund=res;
  }
  ,e=>{
      console.log(e)
  })
  this.getCurrentPoints()
  }
  getCurrentPoints(){
    this.loading.present();
    this.http.get(`${Details.URL}/fund/referralbonus/${this.loggedUser._id}`,this.optionHeader).subscribe(
      res=>{
        let data=JSON.parse(res['_body']),total=0;
        this.showempty= data.length > 0 ? false : true;
        data.forEach(element => {
          if(element.redeemedpoints){
            total-=element.redeemedpoints
          }
          else{
            total+=element.pointsearned
          }
        });
        this.totalPoints=total;
        this.data=data;
        this.loading.dismiss();
        console.log(data)
      },
      e=>{
        this.loading.dismiss();
        console.log(e)
      }
    )
  }
  goFund(){
    this.navCtrl.push(FundfirstPage);
  }
  gotoRefer(){
    this.navCtrl.push(ReferFriendPage)
  }
  reddem(){
    if(this.amount){
      // TO NOT REDEEM MORE THAN YOUR CURRENT POINTS.
      if(this.amount%5!==0){
        let toast = this.toast.create({
          message: "You may only redeem points in multiples of 5.",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
      else{
        if(this.amount > this.totalPoints){
          let toast = this.toast.create({
            message: "You don't have enough points to redeem",
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        else{
          this.loading = this.loadingCtrl.create({
            content: 'Please Wait...'
          });
          this.loading.present();
          this.http.post(`${Details.URL}/fund/referralbonusredeem`,{"userid": this.loggedUser._id,"points":this.amount,"pointsvalue":this.amount*25/5},this.optionHeader).subscribe(
            res=>{
              let toast = this.toast.create({
                message: `You have redeemed ${this.amount} points. `,
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
              this.loading.dismiss();
              this.getCurrentPoints()
            },
            e=>{
              this.loading.dismiss();
              console.log(e)
            }
          )
        }
      }
    }
    else{
      let toast = this.toast.create({
        message: "Point Field is required",
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }
}
