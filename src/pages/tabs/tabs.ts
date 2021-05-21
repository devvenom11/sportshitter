import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, Tabs } from 'ionic-angular';
import { HomePage } from './../home/home';
import { ContestMainPage } from './../contest-main/contest-main';
import { ChallengeHomePage } from './../challenge-home/challenge-home';
import { Global } from '../../services/Global';
import { Socket } from 'ng-socket-io';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FundObservable } from '../../services/fundObservable';
import { FavouritesPage } from '../favourites/favourites';
import { FundfirstPage } from '../fundfirst/fundfirst';
import { ChatGroupListPage } from '../chat-group-list/chat-group-list';
import { ChallengeSportListPage } from "../challenge-sport-list/challenge-sport-list";

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root = HomePage;
 // tab2Root = ChatfeedPage;
  tab2Root = localStorage.getItem("setflag") === 'true' ? ContestMainPage : ChallengeSportListPage;
  tab3Root = FavouritesPage;
  tab4Root = ChatGroupListPage;
  @ViewChild('myTabs') tabRef: Tabs

  badgeNum: any;
  status: boolean = false;

  mySelectedIndex: number;
  selected: boolean = false;
  headers = new Headers();
  optionHeader:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public event: Events,
    public socket: Socket,
    private global: Global,
    public http: Http,
    public fundObservable: FundObservable
  ) {

    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json' );
    this.headers.append("x-auth",localStorage.getItem("token"));
    this.optionHeader=new RequestOptions({ headers: this.headers });
    if (this.navParams.get('notification')) {
      this.mySelectedIndex = 1;
      console.log("index", this.mySelectedIndex);
      var data = this.navParams.get('data');
      this.global.notifiData = data;
    }
    if (localStorage.getItem("setflag") === 'true') {
      localStorage.setItem("setflag", "false");
      this.ionViewDidEnter();// = true;
      // this.event.publish('user:tab4',true);
    }
    this.getUserDetails();
  }

  /**GetUserData */
  getUserDetails() {
    let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    this.http.get(Details.URL + "/account_info/" + id,this.optionHeader).subscribe(response => {
      if (response) {
        localStorage.setItem("accountBalance", JSON.parse(response['_body']).accountBalance);
        localStorage.setItem("fund", JSON.parse(response['_body']).accountBalance);
        localStorage.setItem("pendingFunds", JSON.parse(response['_body']).pendingFunds);
        localStorage.setItem("possiblePrize", JSON.parse(response['_body']).possiblePrize);
        localStorage.setItem("yesterdaysChallenges", JSON.parse(response['_body']).yesterdaysChallenges);
        localStorage.setItem("yesterdaysPrize", JSON.parse(response['_body']).yesterdaysPrize);
        localStorage.setItem("userName", JSON.parse(response['_body']).user.username);

      }
    },
      error => {
        //console.log(error);
      });
  }

  ionViewDidLoad() {

  }
  ionViewDidEnter() {
    this.mySelectedIndex = 1;
  }
  ngOnInit() {
    console.log("Tabs Page");
    var user1 = localStorage.getItem("loggedUser");
    var user = JSON.parse(user1);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json');
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid: user['_id']
    }
    /** Get Unread Message(Prev Message) **/
    this.http.post(Details.URL + "/chat/getUnreadMessage", postParams, this.optionHeader)
      .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if (data1 != 'err') {
          if (data1) {
            this.badgeNum = Object.keys(data1).length;
            this.global.badge = data1;
          }
        }
      }, error => {
        //console.log(error);// Error getting the data
      });
    if (!localStorage.getItem("myInterval")) {
      let myInterval = setInterval(() => {

        //let headers = new Headers();
        //headers.append("Accept", 'application/json');
        //headers.append('Content-Type', 'application/json');
        //let options = new RequestOptions({ headers: headers });
        let postParams = {
          userid: user['_id'],
          gametype: this.global.gameType
        };
        // this.http.post(Details.URL + "/contest/getnotifibadget", postParams, this.optionHeader)
        this.http.post(Details.URL+"/contest/getnotifibadget_funds", postParams, this.optionHeader)
          .subscribe(data => {
            let data1 = JSON.parse(data['_body']);
            if (data1 != 'err') {
              if (data1) {
                // this.global.notifiBadget = [...data1];
                this.fundObservable.setFundNotification(Number(data1.balance))
                this.global.notifiBadget = [...data1.contestlist];
              }
            }
          }, error => {
            //console.log(error);// Error getting the data
          });
      }
        , 20000);
      localStorage.setItem("myInterval", myInterval.toString());
    }


    this.getNotifiBudget();

    /** Chat Online Check **/
    this.socket.on('disconnect-user', (data) => {
      for (var i = 0; i < this.global.statusList.length; i++) {
        if (this.global.statusList[i].socketId == data.socketId) {
          this.global.statusList.splice(i, 1);
          break;
        }
      }
    });
    /** Check Chat New Message (for badge) **/
    this.socket.on('message', (data) => {
      if (data.gameid == user['_id']) {
        if (!(data.userid in this.global.badge)) {
          this.global.badge[data.userid] = Array();
          this.global.badge[data.userid].push(data);
          if (!this.status)
            this.badgeNum = Object.keys(this.global.badge).length;
        } else {
          this.global.badge[data.userid].push(data);
        }
      }

    });

  }

  onHitter1() {
    if (localStorage.getItem("setflag") == 'true') {
      localStorage.setItem("setflag", "false");
      localStorage.setItem("setflag1", "true");

    }
    else if (localStorage.getItem("setflag1") === 'true') {
      localStorage.setItem("setflag1", "false");
      this.navCtrl.setRoot(TabsPage)
    }
    else {
      this.status = false;
      this.event.publish('user:tab3', true);
    }
  }

  onHitter2() {
    this.status = true;
    this.badgeNum = 0;
    this.event.publish('user:tab4', true);
  }

  onHitter4() {
    this.status = false;
    this.event.publish('user:tab3', true);
  }
  onHitter3() {
    this.status = false;
    this.event.publish('user:tab3', false);
  }
  /** Challenge Notification => Push Notification Integration **/
  getNotifiBudget() {
    var user1 = localStorage.getItem("loggedUser");
    var user = JSON.parse(user1);
    //var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json');
    //let options = new RequestOptions({ headers: headers });
    let postParams = {
      userid: user['_id']
    }
    // this.http.post(Details.URL + "/contest/getnotifibadget", postParams, this.optionHeader)
    this.http.post(Details.URL+"/contest/getnotifibadget_funds", postParams, this.optionHeader)
      .subscribe(data => {
        var data1 = JSON.parse(data['_body']);
        if (data1 != 'err') {
          if (data1) {
            // this.global.notifiBadget = data1;
            this.fundObservable.setFundNotification(Number(data1.balance))
            this.global.notifiBadget = [...data1.contestlist];
          }
        }
      }, error => {
        //console.log(error);// Error getting the data
      });
  }

  goFund(){
    this.navCtrl.push(FundfirstPage)
  }

  onFriendsClick() {
  }

}
