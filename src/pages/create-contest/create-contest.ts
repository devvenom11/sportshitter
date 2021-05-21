import { Component } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController, NavParams, Events, ActionSheetController, ToastController } from 'ionic-angular';
import {environment as Details} from '../../environment';
import { Global } from '../../services/Global';

@Component({
  selector: 'page-create-contest',
  templateUrl: 'create-contest.html',
})
export class CreateContestPage {
  showDlgUpgrade = false;
  fund = "";
  onMenu = false;
  onTab = true;
  userlength = 0;
  headers = new Headers();
  optionHeader:any;
  constructor(public http:Http ,
    public navCtrl: NavController,
    public toast:ToastController ,
    public navParams: NavParams,
    public event:Events,
    public sheetCtrl: ActionSheetController,
    public global:Global) {
        /*Author:Anjali
        Call API for Account Balance*/
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
    // this.fund = this.fund==null?"0":this.fund;
    var a = parseFloat(this.fund);
    a = Math.floor(a);
    this.fund = this.fund==null?"0":a.toString();
    event.subscribe('user:fund',() => {
      this.fund = localStorage.getItem("fund");
      // this.fund = this.fund==null?"0":this.fund;
      var a = parseFloat(this.fund);
      a = Math.floor(a);
      this.fund = this.fund==null?"0":a.toString();
    });

    event.subscribe('user:tab4',(ontab) => {
      this.onTab = ontab;
    });

    this.onMenu = this.navParams.get('menu')===false?false:true;
    this.onTab = this.navParams.get('tab')===false?false:true;

  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CreateContestPage');
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

  goToUpgradeContest(){
    this.showDlgUpgrade = true;
    //this.goUpgrade();
    //this.navCtrl.push(ContestSportPage);//this.navCtrl.push(JoinContestPage,{create:true});
  }

  // goUpgrade(){
  //   var user = localStorage.getItem("loggedUser");
  //   user = JSON.parse(user);

  //   var headers = new Headers();
  //   headers.append("Accept", 'application/json');
  //   headers.append('Content-Type', 'application/json' );
  //   let options = new RequestOptions({ headers: headers });
  //   let postParams = {
  //     userid:user['_id']
  //   }

  //   this.http.post(Details.URL+"/fav/addupgrade", postParams, options)
  //   .subscribe(data => {
  //         var data1 = JSON.parse(data['_body']);
  //         localStorage.setItem("upgrade","1");
  //         this.event.publish('user:upgrade');
  //         this.navCtrl.push(ContestMainPage);
  //       }, error => {
  //           //console.log(error);
  //   });
  // }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
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
              // var data1 = JSON.parse(data['_body']);
              this.showDlgUpgrade = false;
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
       // var headers = new Headers();
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
            //Author:Anjali
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

  closeUpgrade(){
    this.showDlgUpgrade = false;
   }

}
