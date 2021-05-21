import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import {environment as Details} from '../../environment';
import { ChatGroupPage } from '../chat-group/chat-group';
import { ActionSheetController } from 'ionic-angular'
import { SocialSharing } from '@ionic-native/social-sharing';
import { FundObservable } from '../../services/fundObservable';
import { Global } from '../../services/Global';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { HomePage } from '../home/home';

@Component({
  selector: "page-favourites",
  templateUrl: "favourites.html",
})
export class FavouritesPage {
  friends = [];
  requests = [];
  users = [];
  requestSentTo;
  search: string;
  headers = new Headers();
  optionHeader: any;
  funds = 0;
  showList: boolean = true;
  showResult: boolean = false;
  showSuccess: boolean = false;
  showBtnUpgrade = false;

  fund = "";
  userlength = 0;
  searchWord = "";
  userlist = [];

  constructor(
    public share: SocialSharing,
    public sheetCtrl: ActionSheetController,
    public event: Events,
    public navCtrl: NavController,
    public navParams: NavParams,
    public toast: ToastController,
    public http: Http,
    public fundObservable: FundObservable,
    public global: Global
  ) {
    /*Author:Anjali
        Call API for Account Balance*/
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.headers.append(
      "Authorization",
      `Bearer ${localStorage.getItem("token")}`
    );

    this.optionHeader = new RequestOptions({
      headers: this.headers,
      responseType: ResponseContentType.Json,
    });

    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.http
      .get(Details.URL + "/account_info/" + id, this.optionHeader)
      .subscribe(
        (res: any) => {
          this.fund = res._body.accountBalance;
          localStorage.setItem("fund", this.fund.toString());
          this.event.publish("user:fund");
        },
        (error) => {
          console.log(error);
        }
      );

    this.getUsersNetwork();

    this.fund = localStorage.getItem("fund");
    var a = parseFloat(this.fund);
    a = Math.floor(a);
    this.fund = this.fund == null ? "0" : a.toString();
    event.subscribe("user:fund", () => {
      this.fund = localStorage.getItem("fund");
      // this.fund = this.fund==null?"0":this.fund;
      var a = parseFloat(this.fund);
      a = Math.floor(a);
      this.fund = this.fund == null ? "0" : a.toString();
    });

    event.subscribe("user:upgrade", () => {
      this.showBtnUpgrade =
        localStorage.getItem("upgrade") == "1" ? false : true;
    });
    this.search = "hide";
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FavouritesPage');
    this.fundObservable.funds.subscribe(
      (res) => {
        this.funds = res;
      },
      (e) => {
        console.log(e);
      }
    );
  }

  showToast(msg) {
    this.toast.create({
      message: msg,
      duration: 2000,
    }).present();
  }

  onSearch() {
    this.showList = false;
    this.users = [];
    const search = this.searchWord.trim();
    if (!(search || search.length < 3)) {
      return;
    }
    this.searchUsers(search)
  }

  showLists() {
    this.showResult = false;
    this.showList = true;
    this.showSuccess = false;
  }

  onSearchCancel() {
    this.search = "hide";
    this.searchWord = "";
    this.users = [];
  }

  onSearchShow() {
    this.search = "show";
  }

  getUsersNetwork() {
    this.http
      .get(`${Details.baseUrl}/v2/network/list`, this.optionHeader)
      .subscribe((data: any) => {
        this.friends = data._body.accepted;
        this.requests = data._body.pending;
        this.global.badgeFriendCount = data._body.pending.length;
      });
  }

  searchUsers(term: string) {
    this.http
      .get(`${Details.baseUrl}/v2/network/search?term=${term}`, this.optionHeader)
      .subscribe((data: any) => {
        this.users = data._body;
        this.showSuccess = false;
        this.showResult = true;
      });
  }

  // godetail(inx) {
  //   this.navCtrl.push(FavoriteDetailPage, {
  //     userid: this.ids[inx],
  //     username: this.items[inx],
  //     fav: 1,
  //     score: this.scores[inx],
  //     sarray: this.sarray,
  //   });
  // }

  goToChat(user) {

    this.navCtrl.push(ChatGroupPage, {
      chatType: 'user',
      userId: user._id,
    });
  }

  removeFriend(user) {

  }

  acceptRequest(user) {
    this.http
      .post(
        `${Details.baseUrl}/v2/network/request/accepted`,
        {
          userId: user._id,
        },
        this.optionHeader
      )
      .subscribe((data: any) => {
        if(data._body) {
          this.getUsersNetwork()
          this.requestSentTo = user;
          this.event.publish('user:addfav');
        }
      });
  }

  declineRequest(user) {
    this.http
      .post(
        `${Details.baseUrl}/v2/network/request/declined`,
        {
          userId: user._id,
        },
        this.optionHeader
      )
      .subscribe((data: any) => {
        if(data._body) {
          this.getUsersNetwork()
          this.showToast("Successfully delcined the user.");
        }
      });

  }

  pendingRequest(user) {
    this.http
      .post(
        `${Details.baseUrl}/v2/network/request/pending`,
        {
          userId: user._id,
        },
        this.optionHeader
      )
      .subscribe((data: any) => {
        if(data._body) {
          this.getUsersNetwork()
          this.searchWord = "";
          this.users = [];
          this.showSuccess = true;
          this.requestSentTo = user;
          this.event.publish('user:addfav');
        }
      });
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
