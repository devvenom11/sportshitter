import { Component } from "@angular/core";
import {
  NavController,
  ModalController,
  Events,
  ToastController,
  NavParams,
} from "ionic-angular";
import { LoginPage } from "./../login/login";
import { Http, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { environment } from "../../environment";
import { Socket } from "ng-socket-io";
import { Global } from "../../services/Global";

@Component({
  selector: "page-chat-group",
  templateUrl: "chat-group.html",
})
export class ChatGroupPage {

  loading = true;
  headers = new Headers();
  optionHeader: any;
  user: any;
  message: String;
  chatGroup: any;
  messagesEl: any;

  constructor(
    public toast: ToastController,
    public http: Http,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public event: Events,
    public socket: Socket,
    private global: Global,
    public navParams: NavParams,
  ) {
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    // this.headers.append("x-auth", localStorage.getItem("token"));
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

    this.socket.on("message:received", (event) => {
      if(event.chatGroup._id === this.chatGroup._id && event.message.author._id !== this.user._id) {
        this.chatGroup.messages.push(event.message);
        this.scrollToBottom();
      }
    });

    this.socket.on("connect-user", (data) => {

    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.scrollToBottom();
  }

  createUserChat(userId) {
    this.http
      .get(`${environment.baseUrl}/v2/chat/user/${userId}`, this.optionHeader)
      .subscribe(
        (response: any) => {
          this.chatGroup = response._body;
        },
        (err) => {
          console.error(err)
        }
      );
  }

  createChallengeChat(challengeId) {
    this.http
      .get(`${environment.baseUrl}/v2/chat/challenge/${challengeId}`, this.optionHeader)
      .subscribe(
        (response: any) => {
          this.chatGroup = response._body;
        },
        (err) => {
          console.error(err)
        }
      );
  }

  ionViewWillEnter() {
    const userId = this.navParams.get('userId');
    const legacyChallengeId = this.navParams.get('legacyChallengeId');
    if(userId)  {
      this.createUserChat(userId);
    } else if (legacyChallengeId) {
      this.createChallengeChat(legacyChallengeId);
    }
  }

  sendMessage() {
    if(!(this.message && this.message.trim())) {
      return;
    }

    this.http
      .post(`${environment.baseUrl}/v2/chat/${this.chatGroup._id}/message`, {
        body: this.message,
      }, this.optionHeader)
      .subscribe(
        (response: any) => {
          this.message = '';
          this.chatGroup.messages = [...this.chatGroup.messages, response._body];
          this.socket.emit('message:sent', {
            chatGroupId: this.chatGroup._id,
            chatMessageId: response._body._id,
          });
          this.scrollToBottom();
        },
        (err) => {
          console.error(err)
        }
      );
  }

  chatGroupTitle() {
    if(this.chatGroup.chatType === 'user') {
      const otherUser = this.chatGroup.users.find((user) => user._id !== this.user._id);
      return `Chat with ${otherUser.username}`;
    } else if(this.chatGroup.chatType === 'challenge') {
      return `${this.chatGroup.legacyChallenge.sport.toUpperCase()} - ${this.chatGroup.legacyChallenge.game_id}`;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEl = document.querySelector('#messagesEl');
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
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
