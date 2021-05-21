import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController, LoadingController } from 'ionic-angular';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';
import {environment as Details} from '../../environment';
import { SingleSpecialPromoPage } from '../single-special-promo/single-special-promo';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-special-promo-auth',
  templateUrl: 'special-promo-auth.html',
})
export class SpecialPromoAuthPage {
  fund:number = 0;
  headers = new Headers();
  optionHeader:any;
  loading;
  item;
  loggedUser
  password
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public http:Http,
    public toast:ToastController,
    public global:Global,
    public fundObservable:FundObservable,
    public loadingCtrl:LoadingController) {
      this.headers.append("Accept", 'application/json');
      this.headers.append('Content-Type', 'application/json' );
      this.headers.append("x-auth",localStorage.getItem("token"));
      this.optionHeader=new RequestOptions({ headers: this.headers })
      this.item=this.navParams.get('item');
      let user = localStorage.getItem("loggedUser");
      this.loggedUser = JSON.parse(user);
      this.http.post(`${Details.URL}/auth/checkpromoaccess`,{promoid:this.item._id,userid:this.loggedUser['_id']}).subscribe(
        res=>{
          let status=JSON.parse(res['_body']);
          console.log(status)
          if(status.hasOwnProperty('status')){
            if(status.status){
              this.navCtrl.push(SingleSpecialPromoPage,{challenge:this.item});
            }
          }

        },
        e=>{
          console.log(e)
        }
      )
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
  submit(){
    this.loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
    this.http.post(`${Details.URL}/auth/specialpromoaccess`,{'promoid':this.item._id,'userid':this.loggedUser._id,'passcode':this.password}).subscribe(
      res=>{
        res=JSON.parse(res['_body'])
        console.log(res)
        let status=res
        if(status.hasOwnProperty('status')){
            let toast = this.toast.create({
              message: 'Wrong Passcode',
              duration: 2000
            });
            toast.present();
        }
        else if(status.hasOwnProperty('success')){
          if(status['data']=="Registration full"){
            let toast = this.toast.create({
              message: 'Registration full',
              duration: 5000
            });
            toast.present();
            this.navCtrl.setRoot(HomePage)
          }
          else{
            this.navCtrl.push(SingleSpecialPromoPage,{challenge:this.item})
          }
        }
        this.loading.dismiss()
      },
      e=>{
        console.log(e)
        this.loading.dismiss()
      }
    )
  }
}
