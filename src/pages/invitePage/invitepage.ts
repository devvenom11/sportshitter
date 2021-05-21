import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FavoriteDetailPage } from './../favorite-detail/favorite-detail';
import { EmailComposer } from '@ionic-native/email-composer';
import { ActionSheetController } from 'ionic-angular'
import { SocialSharing } from '@ionic-native/social-sharing';
import { Global } from '../../services/Global';
import { FundObservable } from '../../services/fundObservable';
import { FundfirstPage } from '../fundfirst/fundfirst';

@Component({
  selector: 'page-invitepage',
  templateUrl: 'invitepage.html',
})
export class invitePage {
  items = [];
  ids = [];
  emails = [];
  scores = [];
  favs = [];
  sarray = [];
  showinvite = true;
  funds:number = 0;
  userlength = 0;
  searchWord = "";
  userlist = [];
  searcheduserlist = [];
  generalscores = [];
  search:string;

  name = "";
  game = "";
  player = "";
  pick = "";
  payoutOption=0;
  googleNumber = "710341494776";
  platformType="";
  showAddToHomeScreenPopup =  false;
  addToHomeScreenIcon = "";
  //Jami
  inviteArr = [];
  invitePickerNum = 0;
  contestid = -1;

  limit = 0;
  shareFlag:boolean = false;

  gameType = 'game1';
  userid;

  facebookIOS:string = "https://itunes.apple.com/us/app/facebook/id284882215?mt=8";
    facebookANDROID:string = "https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en";

    emailIOS:string = "https://itunes.apple.com/us/app/email-edison-mail/id922793622?mt=8";
    emailANDROID:string = "https://play.google.com/store/search?q=email";

    twitterIOS:string = "https://itunes.apple.com/us/app/twitter/id333903271?mt=8";
    twitterANDROID:string = "https://play.google.com/store/apps/details?id=com.twitter.android&hl=en";
    fund=0;
    headers = new Headers();
    optionHeader:any;
  constructor( public share:SocialSharing ,
    public sheetCtrl: ActionSheetController,
     public event:Events,
     public navCtrl: NavController,
     public navParams: NavParams,
     public toast:ToastController,
     public http:Http,
     public global:Global,
     /*Author:Anjali
     add line */
     public platform: Platform,
     private emailComposer: EmailComposer,
     public loadingCtrl:LoadingController,
     private fundObservable: FundObservable ) {
        /*Author:Anjali
        Call API for Account Balance*/
        let id = JSON.parse(localStorage.getItem("loggedUser"))._id;

        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });


        // this.http.get(Details.URL+"/account_info/"+id,this.optionHeader).subscribe(res => {
        //     console.log("resssss",res)
        // if (res) {
        // this.fund = JSON.parse(res['_body']).accountBalance;
        // console.log(this.fund)
        // localStorage.setItem("fund", this.fund.toString());
        // this.event.publish('user:fund');
        // console.log(res);
        // }
        // },
        // error => {
        // //console.log(error);
        // });
    this.getUserLength();

    if(this.navParams.get('contestid')!=undefined){
      this.contestid = this.navParams.get('contestid');
    }
    //this.getuserlist();
    this.limit = this.navParams.get('invitelimit');
    this.gameType = this.navParams.get('gameType');
    this.getfavuserlist();
    //this.showBtnUpgrade = localStorage.getItem("upgrade")=="1"?false:true;

    // this.fund = localStorage.getItem("fund");
    // this.fund = this.fund==null?"0":this.fund;
    // var a = parseFloat(this.fund);
    // a = Math.floor(a);
    // this.fund = this.fund==null?"0":a.toString();
    // event.subscribe('user:fund',() => {
    //   this.fund = localStorage.getItem("fund");
    //   // this.fund = this.fund==null?"0":this.fund;
    //   var a = parseFloat(this.fund);
    //   a = Math.floor(a);
    //   this.fund = this.fund==null?"0":a.toString();
    // });

    // event.subscribe('user:upgrade',() => {
    //   this.showBtnUpgrade = localStorage.getItem("upgrade")=="1"?false:true;
    // });
    this.search = "show";
    this.getGameDetails();
  }
  canSee=""
  hide() {
      this.canSee = "";
  }
  toggle(dropdownName){
      this.canSee = this.canSee==dropdownName ? "" : dropdownName;
  }
  ionViewDidLoad() {
    this.fundObservable.funds.subscribe(
      res=>{
        this.funds=res
        this.fund=res;
      },
      e=>{
        console.log(e)
      }
    )
    //console.log('ionViewDidLoad FavouritesPage');
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getuserlist(){
  }

  goFund(){
    this.navCtrl.push(FundfirstPage)
  }


  onSearch(){
    this.searcheduserlist = [];
    if(this.searchWord == ""){
      return;
    }
    this.userlist.forEach(element => {
      var tempname = (element.username || element.displayname);
      if(tempname)
        tempname = tempname.toLowerCase();
      if(tempname && tempname.search(this.searchWord.toLowerCase())!= -1){
        var flag = false;
        this.ids.forEach(element1 => {
          if(element1 == element._id){
            flag = true;
          }
        });
        if(flag == false)
          this.searcheduserlist.push(element);
      }
    });
  }

  onSearchCancel(){
    this.search = "hide";
    this.searchWord = "";
    this.searcheduserlist = [];
  }

  onSearchShow(){
      this.search = "show";
  }

  goshare() {
    let actionSheet = this.sheetCtrl.create({
      title: 'Invite Friends.',
      buttons: [
        {
          text: 'Via Email',
          role: 'destructive',
          handler: () => {

            this.emailComposer.isAvailable().then((available: boolean)=>{
                if(available){
                  //console.log("sun");
                }else{
                  //console.log("moon");
                }
              });
              let email = {
                  to:'recipient@example.org',
                  subject:'Subject',
                  body:'Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters',
                  isHtml: true
                };
                this.emailComposer.open(email);
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

  getGameDetails(){
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });

    let postParams = {
        contestid:this.contestid,userid:user['_id']
    }
    console.log('this.gameType',this.gameType)
    this.userid = user['_id'];
    if(this.gameType == 'game1'){
      this.http.get(Details.URL+"/contest/getcontestinfobyid:"+this.contestid,this.optionHeader).subscribe(response => {
          if (response) {
            var contestinfo = JSON.parse(response['_body'])[0];
              this.name = contestinfo.sports;
              this.game = contestinfo.contestname;
              this.player = contestinfo.player;
              this.pick = contestinfo.team;
              this.payoutOption=contestinfo.payoutoption;
          }
      },
      error => {
      });
    }
    else{
      this.http.get(Details.URL+"/contest/getcontestinfobyid_game2/"+this.contestid,this.optionHeader).subscribe(response => {
          if(response){
            console.log(response)
            var contestinfo = JSON.parse(response['_body'])[0];
            console.log(contestinfo)
            this.name=contestinfo.sport
            this.game=contestinfo.flag =='cc' ? contestinfo.contestname : contestinfo.game_id;
            console.log(this.name)
            // this.name = contestinfo.sports;
            // this.game = contestinfo.contestname;
            this.player = contestinfo.player;
            this.pick = contestinfo.team;
            this.payoutOption = contestinfo.payoutoption;
          }
      },
      error => {
      });
    }

  }

  getfavuserlist(){
    this.scores = [];
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);

    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid:user['_id']
    };

    this.http.post(Details.URL+"/fav/getfavlist", postParams, this.optionHeader)
    .subscribe(data => {
          var data1 = JSON.parse(data['_body']);
          var arr = [];
          var arrIds = []
          if(data1.length > 0){
            if(localStorage.getItem("upgrade") != '1' && data1[0].favidlist.length>10){
              arrIds = data1[0].favidlist.slice(0, 10);
              arr = data1[0].favnamelist.slice(0, 10);
            }
            else{
              arrIds = data1[0].favidlist;
              arr = data1[0].favnamelist;
            }
          }


          var user = localStorage.getItem("loggedUser");
          user = JSON.parse(user);
          //headers = new Headers();
          //headers.append("Accept", 'application/json');
          //headers.append('Content-Type', 'application/json' );
          //let options = new RequestOptions({ headers: headers });
          let postParams = {
            ids:arrIds,contestid:this.contestid, gametype: this.gameType
          };
          this.http.post(Details.URL+"/contest/checkinvite", postParams, this.optionHeader).subscribe(response3 => {
              var data = JSON.parse(response3['_body']);
              // this.ids = data;
              var tempIds = data;
              // this.items = [];
              var tempItems = [];
              var i = 0;
              arrIds.forEach(element=>{
                if(tempIds.indexOf(element) != -1){
                  tempItems.push(arr[i]);
                  this.inviteArr.push(false);
                }
                i++;
              })
              this.http.get(Details.URL+"/fav/getuserlist",this.optionHeader).subscribe(response => {
                if (response) {
                    var response1 = JSON.parse(response['_body']);
                    this.sarray = response1['scorelist'];
                    var userlistArr = [];
                    response1.userlist.forEach(element => {
                      userlistArr.push(element._id);
                    });
                    var idsVal = JSON.parse(JSON.stringify(tempIds));
                    for(var i=0;i< idsVal.length;i++) {
                      if(userlistArr.indexOf(idsVal[i]) == -1) {
                        tempItems.splice(tempIds.indexOf(idsVal[i]),1);
                        tempIds.splice(tempIds.indexOf(idsVal[i]),1);
                      }
                    }
                    this.ids = tempIds;
                    this.items = tempItems;
                    this.ids.forEach(element => {
                      response1.userlist.forEach(element1 => {
                        if(element1._id == element){
                          this.emails.push(element1.email || '');
                        }
                      });
                    });
                    this.ids.forEach(element => {
                        var score = 0;
                        var scorecount = 0;
                        for(var i = 0; i < response1['scorelist'].length; i++){
                          if(response1['scorelist'][i].userid == element){
                            score += response1['scorelist'][i].score;
                            scorecount++;
                          }
                        }
                        score = scorecount==0?0:Math.round(score*100/scorecount)/100;
                        this.scores.push(score);
                    });
                }
            },
            error => {
              //console.log(error);
            });
          },err3=>{
            //console.log(err3);
          });

        }, error => {
            //console.log(error);// Error getting the data
    });
  }
/*Author:Anjali
   write into invite() ************ */
  //invite(){
    // this.share.share('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters','subject',null,null)
    // .then(response => {
    //   //console.log(response);
    // }).catch(err => {
    //   //console.log(err);
    // });
    invite(inx){
      switch(inx){
        case 0://email
   // console.log(this.platformType)
    if(this.platform.is('core') || this.platform.is('mobileweb')){
      console.log("yes");
      (<any>window).location.href=(<any>window).encodeURI("mailto:?subject=Check Out this new SportHitters app for Sports fans&body=Check Out this new SportHitters app for Sports fans https://app.sporthitters.com/")
  }else{
    console.log("no")
      this.share.canShareViaEmail().then(() => {
          this.share.shareViaEmail('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', 'Subject', ['recipient@example.org'],[],[]).then(() => {
          }).catch((err) => {
              alert(err)
          });
      }).catch((err1) => {
          alert(err1)
      });
  }
  break;
  case 1://SMS
            //canShareVia(appName, message, subject, image, url)
            console.log("SMS");
            if(this.platform.is('core') || this.platform.is('mobileweb')){
                if(this.platform.is('android')){
                    (<any>window).location.href=(<any>window).encodeURI("sms:?body=Check Out this new SportHitters app for Sports fans!\nhttps://app.sporthitters.com/")
                }else if(this.platform.is('ios')){
                    (<any>window).location.href=(<any>window).encodeURI("sms://+1/&body=Check Out this new SportHitters app for Sports fans!\nhttps://app.sporthitters.com/")
                }else{
                    // do nothing
                }
            }else{
                this.share.canShareVia("","","").then(() => {
                    // Sharing via email is possible
                    //console.log("Sharing via email is possible");
                }).catch(() => {
                    // Sharing via email is not possible
                    //console.log("Sharing via email is impossible");
                });
                // shareViaSMS(messge, phoneNumber)
                this.share.shareViaSMS('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '').then(() => {
                    // Success!
                }).catch(() => {
                // Error!
                });
            }
            break;

            // case 2://Facebook
            //     this.share.canShareVia("facebook","","").then(() => {
            //         // Sharing via email is possible
            //         //console.log("Sharing via email is possible");
            //         this.share.shareViaFacebook('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '','').then(() => {
            //             // Success!
            //         }).catch(() => {
            //         // Error!
            //         });
            //     }).catch(() => {
            //         // Sharing via email is not possible
            //         //console.log("Sharing via email is impossible");
            //         let msg = "Please install facebook app.";
            //         let toast = this.toast.create({
            //             message: msg,
            //             duration: 2000
            //         });
            //         toast.present();
            //         setTimeout(() => {
            //             if(this.platform.is('ios')){
            //                 (<any>window).open(this.facebookIOS, "_system");
            //             }else{
            //                 (<any>window).open(this.facebookANDROID, "_system");
            //             }
            //         },1000);
            //     });


            // break;

            // case 3://twitter
            //     //shareViaTwitter(message, image, url)
            //     this.share.canShareVia("twitter","","").then(() => {
            //         // Sharing via email is possible
            //         //console.log("Sharing via email is possible");
            //         this.share.shareViaTwitter('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', '', '').then(() => {
            //             // Success!
            //         }).catch(() => {
            //         // Error!
            //         });
            //     }).catch(() => {
            //         // Sharing via email is not possible
            //         let msg = "Please install twitter app.";
            //         let toast = this.toast.create({
            //             message: msg,
            //             duration: 2000
            //         });
            //         toast.present();
            //         setTimeout(() => {
            //             if(this.platform.is('ios')){
            //                 (<any>window).open(this.twitterIOS, "_system");
            //             }else{
            //                 (<any>window).open(this.twitterANDROID, "_system");
            //             }
            //         },1000);

            //     });

            //break;
            default:
                this.shareFlag = false;
            break;
     }
  }
/*Autor:Anjali
write this function*/
  shareOpen(){
    this.shareFlag = true;
  }
  sendInvite(){
    var emailArr = [];
    var idArr = [];
    for(var i=0;i < this.emails.length;i++){
      if(this.inviteArr[i]){
        emailArr.push(this.emails[i]);
        idArr.push(this.ids[i]);
      }
    }
    if(emailArr.length > 0){
      var loading = null;
      loading = this.loadingCtrl.create({
          content: 'Please Wait...'
        });
      loading.present();
      // let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
      // this.http.get(Details.URL+"/account_info/"+id,this.optionHeader).subscribe(res => {
      //     console.log("resssss",res)
      // if (res) {
      // this.fund = JSON.parse(res['_body']).accountBalance;
      // console.log(this.fund)
      // localStorage.setItem("fund", this.fund.toString());
      // this.event.publish('user:fund');
      // console.log(res);
      // }
      // });
      var user = localStorage.getItem("loggedUser");
      user = JSON.parse(user);
      //var headers = new Headers();
      //headers.append("Accept", 'application/json');
      //headers.append('Content-Type', 'application/json' );
      //let options = new RequestOptions({ headers: headers });
      let postParams = {
          contestid: this.contestid, invitearr:idArr, userid:user["_id"]
      }
      if(this.gameType == 'game1')
        this.http.post(Details.URL+"/contest/addinvite", postParams, this.optionHeader)
        .subscribe(data => {
          loading.dismiss();
          if(emailArr.length == 1){
            this.navCtrl.pop();
          }else{
            var arr = emailArr;
            arr.splice(0,1);
            this.navCtrl.pop();
          }
        }, error => {
            //console.log(error);// Error getting the data
            loading.dismiss();
        });
      else
        this.http.post(Details.URL+"/contest/addinvite_game2", postParams, this.optionHeader)
        .subscribe(data => {
          loading.dismiss();
          if(emailArr.length == 1){
            this.navCtrl.pop();
          }else{
            var arr = emailArr;
            arr.splice(0,1);
            this.navCtrl.pop();
          }
        }, error => {
            //console.log(error);// Error getting the data
            loading.dismiss();
        });
    }
  }

  godetail(inx){
    // if(this.favs.indexOf(this.ids[inx]) != -1){
    //   this.navCtrl.push(FavoriteDetailPage,{userid:this.ids[inx], username:this.items[inx], fav:1, score:this.scores[inx]});
    // }
    // else{
    //   this.navCtrl.push(FavoriteDetailPage,{userid:this.ids[inx], username:this.items[inx], fav:0, score:this.scores[inx]});
    // }
    this.navCtrl.push(FavoriteDetailPage,{userid:this.ids[inx], username:this.items[inx], fav:1, score:this.scores[inx],sarray:this.sarray});
  }

  deleteuser(inx){
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
        favid: this.ids[inx], favname:this.items[inx], userid:user['_id'], flag:0
    }
    this.http.post(Details.URL+"/fav/addfav", postParams, this.optionHeader)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1.message == 'ok'){
          this.getfavuserlist();
          this.showToast("Success remove favorite user.");
        }
    }, error => {
            //console.log(error);// Error getting the data
    });
  }

  // openDlgUpgrade(){
  //   this.showDlgUpgrade = true;
  // }

  getFreeUpgrade(){
    this.addupgrage(30);
    let toast = this.toast.create({
      message: "Congratulations you will receive a free upgrade to SportHitters Fanatics version",
      duration: 6000
    });
    toast.present();
  }

  getUserLength(){
    this.http.get(Details.URL+"/fav/getuserlist",this.optionHeader).subscribe(response => {
      if (response) {
          var response1 = JSON.parse(response['_body']);
          this.userlist = response1['userlist'];
          this.userlength =  this.userlist.length;
          //console.log(this.userlist);
      }
    },
    error => {
      //console.log(error);
    });
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
              // if(parseInt(this.fund)<=30){
                if(this.fund<=30){
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
              // if(parseInt(this.fund)<=3.95){
              if(this.fund<=3.95){
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
   // headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid:user['_id']
    }

    this.http.post(Details.URL+"/fav/addupgrade", postParams, this.optionHeader)
    .subscribe(data => {
          // var data1 = JSON.parse(data['_body']);
          // this.showDlgUpgrade = false;
          // this.showBtnUpgrade = false;
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
    ///headers.append('Content-Type', 'application/json' );

   // let options = new RequestOptions({ headers: headers });
    let postParams = {
      amount:amount,
      fundid:"upgrade",
      stripetoken:user['_id']
    }
    this.http.post(Details.URL+"/fund/postwithdraw", postParams, this.optionHeader)
    .subscribe(data => {
      var data1 = JSON.parse(data['_body']);
      if(data1.message=='ok'){
        /*Anjali:Commentout*/
        // var fund = parseInt(this.fund)-amount;
        // this.fund = fund.toString();
        // localStorage.setItem("fund",this.fund);
        // this.event.publish('user:fund');
        //this.addupgrage(amount);
      }
      else{
        //this.showDlgUpgrade = false;
        this.showToast("Add funds your account.");
      }
    }, error => {
      //console.log(error);// Error getting the data
    });
  }

  setfav(userobj){
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    this.hide();
    if(user['_id'] == userobj._id)
        return;
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
        favid: userobj._id, favname:userobj.username||userobj.displayname, userid:user['_id'], flag:1
    }
    this.http.post(Details.URL+"/fav/addfav", postParams, this.optionHeader)
    .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if(data1.message == 'ok'){
          this.getfavuserlist();
          this.onSearchCancel();
          this.hide();
          this.showToast("Success add favorite user.");
          this.event.publish('user:addfav');
          //console.log(this.scores);
        }
    }, error => {
          //console.log(error);// Error getting the data
    });
  }

  inviteSelect(i){;
    //if(this.inviteArr[i])

    if(this.inviteArr[i])
      this.inviteArr[i] = false;
    else{
      if(!(this.invitePickerNum < this.limit))
      return;
      this.inviteArr[i] = true;
    }
    this.invitePickerNum = 0;
    this.inviteArr.forEach(element => {
      if(element)
        this.invitePickerNum++;
    });
  }

}
