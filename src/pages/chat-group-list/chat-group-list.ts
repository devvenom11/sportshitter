import { Component } from "@angular/core";
import {
  NavController,
  ModalController,
  Events,
  ToastController,
  NavParams,
} from "ionic-angular";
import { LoginPage } from "./../login/login";
import { ChatGroupPage } from "./../chat-group/chat-group";
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from "../../environment";
import { Socket } from "ng-socket-io";
import { Global } from "../../services/Global";

@Component({
  selector: "page-chat-group-list",
  templateUrl: "chat-group-list.html",
})
export class ChatGroupListPage {

  loading = true;
  headers = new Headers();
  optionHeader: any;
  user: any;
  chatType = "user";
  chatGroups = [];

  constructor(
    public toast: ToastController,
    public http: Http,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public event: Events,
    public socket: Socket,
    public global: Global,
    public navParams: NavParams,
  ) {
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

    this.user = JSON.parse(localStorage.getItem("loggedUser"));

    event.subscribe("user:profile", () => {
      this.user;
    });

    if (this.user == null) {
      this.navCtrl.setRoot(LoginPage);
    }

    this.socket.on("message", (data) => {

    });

    this.socket.on("connect-user", (data) => {

    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {

  }

  ionViewWillEnter() {
    this.http
      .get(`${environment.baseUrl}/v2/chat`, this.optionHeader)
      .subscribe(
        (response) => {
          console.log(response);
        },
        (err) => {
          console.error(err)
        }
      );
  }

  getChatGroupsPaged(take, skip) {

  }

  showChatGroupById(chatGroupId) {
    this.navCtrl.push(ChatGroupPage, {
      chatGroupId,
    });
  }

  showToast(msg) {
    let toast = this.toast.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
