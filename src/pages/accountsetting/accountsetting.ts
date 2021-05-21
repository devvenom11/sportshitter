import { Component } from '@angular/core';
import { NavController, NavParams, Events, ToastController, ActionSheetController } from 'ionic-angular';
import { PreferencePage } from './../preference/preference';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FavouritesPage } from './../favourites/favourites';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { TabsPage } from './../tabs/tabs';

@Component({
  selector: 'page-accountsetting',
  templateUrl: 'accountsetting.html',
})
export class AccountsettingPage {
  fund = "";
  showItem = false;
  newsitems = [];
  newkey="";
  favsport = "";
  upgrade = false;
  chat = "";
  showDlgUpgrade = false;
  showBtnUpgrade = false;
  userlength = 0;

  gender = '';
  age = '';
  team = '';
  sport = '';
  presport = '';
  place = '';
  cocktail = '';
  headers = new Headers();
  optionHeader:any;
  constructor(public sheetCtrl: ActionSheetController,
    public http:Http,
    public navCtrl: NavController,
    public navParams: NavParams,
    public event:Events,
    public toast: ToastController) {

    /*Author:Anjali
        Set API for Account Balance*/

        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });


        let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
        this.http.get(Details.URL+"/account_info/"+id,this.optionHeader).subscribe(res => {
            console.log("resssss",res)
        if (res) {
        this.fund = JSON.parse(res['_body']).accountBalance;
        console.log(this.fund)
        localStorage.setItem("fund", this.fund.toString());
        this.event.publish('user:fund');
        console.log(res);
        }
        },
        error => {
        //console.log(error);
        });
    this.getUserLength();

    this.fund = localStorage.getItem("fund");
    var a = parseFloat(this.fund);
    a = Math.floor(a);
    this.fund = this.fund==null?"0":a.toString();
    event.subscribe('user:fund',() => {
        this.fund = localStorage.getItem("fund");
        var a = parseFloat(this.fund);
        a = Math.floor(a);
        this.fund = this.fund==null?"0":a.toString();
    });

    event.subscribe('user:upgrade',() => {
      this.upgrade = localStorage.getItem("upgrade")=="1"?true:false;
    });
    this.upgrade = localStorage.getItem("upgrade")=="1"?true:false;

    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    if(user['profile'] != undefined){
      this.favsport = user['profile'].default;
    }

    if(user['account'] != undefined){
      this.gender = user['account'].gender;
      this.age = user['account'].age;
      this.cocktail = user['account'].cocktail;
      this.place = user['account'].place;
      this.presport = user['account'].presport;
      this.sport = user['account'].sport;
      this.team = user['account'].team;
    }
  }

  getUserLength(){
    this.http.get(Details.URL+"/fav/getuserlist",this.optionHeader).subscribe(response => {
      if (response) {
        var response1 = JSON.parse(response['_body']);
        var sarray = response1['userlist'];
        this.userlength = sarray.length;
      }
    },
    error => {
      //console.log(error);
    });
  }

  ionViewDidLoad() {
  }

  goPreference(){
    this.navCtrl.push(PreferencePage);
  }

  addItem(){
    this.showItem = true;
  }

  eventHandler(code){
    if(code == 13){
      if(this.newsitems.length < 3){
        this.newsitems.push(this.newkey);
        this.showItem = false;
        this.newkey = '';
      }
      else{
        this.showToast("The maxlength of news keys is 3.");
      }
    }
  }

  removeItem(i){
    this.newsitems.splice(i,1);
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
  /** Set HomeScreenFeed **/
  submit(){
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);

    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid:user['_id'],newkey: this.newsitems, default:this.favsport,chat:this.chat
    }

    this.http.post(Details.URL+"/user/addprofile", postParams, this.optionHeader)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1.message != 'err'){
          this.showToast("Success!");
          var userinfo = JSON.parse(localStorage.getItem('loggedUser'));
          userinfo['profile'] = postParams;

          localStorage.removeItem('loggedUser');
          localStorage.setItem('loggedUser', JSON.stringify(userinfo));
          this.event.publish('user:profile');
          this.navCtrl.setRoot(TabsPage);
        }
        else{
          this.showToast("Failed!");
        }
      }, error => {
        //console.log(error);// Error getting the data
    });
  }

  /** Set Preferences **/
  submit1(){
    if(this.gender == '' || this.age == '' || this.team == '' || this.sport == '' || this.presport == ''
    || this.place == '' || this.cocktail == ''){
      this.showToast('Invalid Value!');
      return;
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
        userid:user['_id'],gender: this.gender, age:this.age, team: this.team, sport:this.sport, presport: this.presport, place:this.place, cocktail:this.cocktail
    }

    this.http.post(Details.URL+"/user/addaccount", postParams, this.optionHeader)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1.message != 'err'){
          this.showToast("Success!");
          var userinfo = JSON.parse(localStorage.getItem('loggedUser'));
          userinfo['account'] = postParams;
          localStorage.removeItem('loggedUser');
          localStorage.setItem('loggedUser', JSON.stringify(userinfo));
          this.event.publish('user:profile');
          this.navCtrl.setRoot(TabsPage);
        }
        else{
          this.showToast("Failed!");
        }
      }, error => {
        //console.log(error);// Error getting the data
    });
  }

  goFavourite() {
    this.navCtrl.push(FavouritesPage,{menu:false});
  }

  goFund(){
    this.navCtrl.push(FundfirstPage);
  }

  closeUpgrade(){
    this.showDlgUpgrade = false;
  }

  openUpgrade(flag){
    this.showDlgUpgrade = true;
    this.showBtnUpgrade = flag;
  }

  getFreeUpgrade(){
    this.addupgrage(30);
    let toast = this.toast.create({
      message: "Congratulations you will receive a free upgrade to SportHitters Fanatics version",
      duration: 6000
    });
    toast.present();
  }


  goUpgrade(){
    if(this.userlength < 1000){
      this.getFreeUpgrade();
    }
    else{
      let actionSheet = this.sheetCtrl.create({
        title: 'Select your upgrade type.',
        buttons: [
          {
            text: '$30 for year',
            handler: () => {
              if(parseInt(this.fund)<=30){
                this.showToast("Add funds your account.");

              }
              else{
                this.withdraw(30);
              }
            }
          },
          {
            text: '$3.95 for month',
            handler: () => {
              if(parseInt(this.fund)<=3.95){
                this.showToast("Add funds your account.");

              }
              else{
                this.withdraw(3.95);
              }
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {

            }
          }
        ]
      });

      actionSheet.present();
    }
  }

  addupgrage(money){
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);

    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid:user['_id']
    }

    this.http.post(Details.URL+"/fav/addupgrade", postParams, this.optionHeader)
    .subscribe(data => {
          var data1 = JSON.parse(data['_body']);
          this.showDlgUpgrade = false;
          this.showBtnUpgrade = false;
          localStorage.setItem("upgrade","1");
          this.event.publish('user:upgrade');
          this.showToast("Upgrade success.");
        }, error => {
            //console.log(error);
    });
  }

  withdraw(amount){

    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );

    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      amount:amount,
      fundid:"upgrade",
      stripetoken:user['_id']
    }
    this.http.post(Details.URL+"/fund/postwithdraw", postParams, this.optionHeader)
    .subscribe(data => {
      var data1 = JSON.parse(data['_body']);
      if(data1.message=='ok'){
        /*Anjali:Commented*/
        // var fund = parseInt(this.fund)-amount;
        // this.fund = fund.toString();
        // localStorage.setItem("fund",this.fund);
        // this.event.publish('user:fund');
        this.addupgrage(amount);
      }
      else{
        this.showDlgUpgrade = false;
        this.showToast("Add funds your account.");
      }
    }, error => {
      //console.log(error);// Error getting the data
    });
  }

  changeGender(g){
    this.gender = g;
  }

}
