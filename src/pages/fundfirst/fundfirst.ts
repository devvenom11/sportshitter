import { Component, ElementRef } from "@angular/core";
import {
  NavController,
  NavParams,
  ToastController,
  Events,
  LoadingController,
} from "ionic-angular";
import { Stripe } from "@ionic-native/stripe";
import { Http, Headers, RequestOptions } from "@angular/http";
import {environment as Details} from '../../environment';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ViewChild } from "@angular/core";
// import { StripeService, Elements, Element as StripeElement, ElementsOptions , StripeCardComponent} from "ngx-stripe";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration,
  PayPalPaymentDetails,
} from "@ionic-native/paypal";
import { HomePage } from "../home/home";
import { CameraOptions, Camera } from "@ionic-native/camera";
import { TabsPage } from "../tabs/tabs";
import { SocialSharing } from "@ionic-native/social-sharing";
import { FundObservable } from "../../services/fundObservable";
import { Global } from "../../services/Global";

@Component({
  selector: "page-fundfirst",
  templateUrl: "fundfirst.html",
})
export class FundfirstPage {
  // @ViewChild(StripeCardComponent) card: StripeCardComponent;
  // @ViewChild('card') cardRef: ElementRef;
  // elements: Elements;
  // card: StripeElement;
  // // cardOptions: ElementOptions = {
  // //   style: {
  // //     base: {
  // //       iconColor: '#2c5766',
  // //       color: '#2c5766',
  // //       fontSize: '15px',
  // //       '::placeholder': {
  // //         color: '#5c8b9b'
  // //       }
  // //     }
  // //   }
  // // };

  // elementsOptions: ElementsOptions = {
  //   locale: 'en'
  // };

  stripeTest: FormGroup;

  icons = "";
  amount = "";

  paymenttype = "";
  repaymenttype = "";
  prevpaylist = [];
  fundid = 0;
  wamount = "";
  fund: number = 0;
  showpaybtn = false;

  userid = "";
  deposit = false;

  loading: any;
  cardNumber: string;
  cardMonth: number;
  cardYear: number;
  cardCVV: string;
  public firstLogin: any;
  public platformType: string = "BROWSER";
  addBonus: any = false;
  headers = new Headers();
  optionHeader: any;
  title: string;
  description: string;
  showpopup: boolean = false;
  returnHome: boolean = false;
  // formBuilder = new FormBuilder();
  constructor(
    private payPal: PayPal,
    private fb: FormBuilder,
    private camera: Camera,
    private share: SocialSharing,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stripe: Stripe,
    public http: Http,
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public event: Events,
    private fundObservable: FundObservable,
    public global: Global
  ) {
    /*Author:Anjali
        Sets API for Account Balance*/
    this.headers.append("Accept", "application/json");
    this.headers.append("Content-Type", "application/json");
    this.headers.append("x-auth", localStorage.getItem("token"));
    this.optionHeader = new RequestOptions({ headers: this.headers });

    // let id = JSON.parse(localStorage.getItem("loggedUser"))._id;
    // this.http.get(Details.URL+"/account_info/"+id,this.optionHeader).subscribe(res => {
    //   console.log(res)
    // if (res) {
    // this.fund = JSON.parse(res['_body']).accountBalance;
    // console.log("responseeeeeeeeeee", this.fund)
    // localStorage.setItem("fund", this.fund.toString());
    // this.event.publish('user:fund');
    // }
    // },
    // error => {
    // //console.log(error);
    // });

    this.icons = "deposit";
    this.amount = "100";
    this.getfundinfo();
    this.firstLogin = localStorage.getItem("firstLogin");
    // this.fund = localStorage.getItem("fund");
    // this.fund = this.fund==null?"0":this.fund;
    // keyboard.onKeyboardShow()
    // .subscribe(data => {
    //    //console.log('keyboard is shown');
    //    var s = document.getElementById("triggerkeyboard");
    //    s.removeAttribute('style');
    //    var css = 'margin-top: -13vw';
    //    s.setAttribute(
    //         'style', css
    //     );
    //    //    margin-bottom: 49px;margin-top: 44px;
    //    //your code goes here
    // });
    // keyboard.onKeyboardHide()
    // .subscribe(data => {
    //    //console.log('keyboard is hide');
    //    //your code goes here
    //    var s = document.getElementById("triggerkeyboard");
    //    s.removeAttribute('style');
    // });
    if (
      (<any>window).location.hostname == "localhost" ||
      (<any>window).location.hostname == "app.sporthitter.test123.dev"
    ) {
      if ((<any>window).Stripe) {
        (<any>window).Stripe.setPublishableKey(
          "pk_test_ihso9TATKU8jgyor5Lhj9LAw"
        );
      }
      this.stripe.setPublishableKey("pk_test_ihso9TATKU8jgyor5Lhj9LAw");
    } else if ((<any>window).location.hostname == "stageapp.testshiapp.com") {
      if ((<any>window).Stripe) {
        (<any>window).Stripe.setPublishableKey(
          "pk_test_ihso9TATKU8jgyor5Lhj9LAw"
        );
      }
      this.stripe.setPublishableKey("pk_test_ihso9TATKU8jgyor5Lhj9LAw");
    } else {
      if ((<any>window).Stripe) {
        (<any>window).Stripe.setPublishableKey(
          "pk_live_BrDSDfM5DuTxg7xZSizJBOmQ"
        );
      }
      this.stripe.setPublishableKey("pk_live_BrDSDfM5DuTxg7xZSizJBOmQ");
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    this.userid = user["_id"];
    // this.formGroup = fb.group({
    //   cardNumber: ['', [CreditCardValidator.validateCardNumber]],
    //   cardExpDate: ['', [CreditCardValidator.validateCardExpiry]],
    //   cardCvv: ['', [CreditCardValidator.validateCardCvc]],
    //   cardName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
    // });
  }

  closeModal1() {
    if (this.addBonus === true) {
      localStorage.setItem("firstLogin", "false");
      let email = localStorage.getItem("email");
      let username = localStorage.getItem("username");
      let postParams = {
        username: username,
        email: email,
        signupbonus: true,
      };
      //var headers = new Headers();
      //headers.append("Accept", 'application/json');
      //headers.append('Content-Type', 'application/json' );
      //let options = new RequestOptions({ headers: headers });
      this.http
        .post(
          Details.URL + "/fund/addfundspromoemail",
          postParams,
          this.optionHeader
        )
        .subscribe((response) => {});
    }
    this.navCtrl.setRoot(TabsPage);
  }
  ionChecked(data: any) {
    data === true ? (this.addBonus = true) : (this.addBonus = false);

    //   if(this.platformType==='BROWSER'){
    //     (<any>window).location.href=(<any>window).encodeURI("mailto:support@sporthitters.com?subject=Check Out this new SportHitters app for Sports fans&body=Check Out this new SportHitters app for Sports fans https://app.sporthitters.com/")
    // }else{
    //     this.share.canShareViaEmail().then(() => {
    //         this.share.shareViaEmail('Check Out this new SportHitters app for Sports fans!\n https://play.google.com/store/apps/details?id=com.sporthitters', 'Subject', ['support@sporthitters.com'],[],[]).then(() => {
    //         }).catch((err) => {
    //             alert(err)
    //         });
    //     }).catch((err1) => {
    //         alert(err1)
    //     });
  }
  validateCard() {
    let card = {
      number: this.cardNumber,
      expMonth: this.cardMonth,
      expYear: this.cardYear,
      cvc: this.cardCVV,
    };

    // Run card validation here and then attempt to tokenise
    this.loading = this.loadingCtrl.create({
      content: "Please Wait...",
    });
    this.loading.present();
    this.createCardToken(card)
      .then((token: any) => {
        if (token) {
          this.createCardToken(card)
            .then((token1: any) => {
              if (token1) {
                var user: any = JSON.parse(localStorage.getItem("loggedUser"));
                let postParams = {
                  amount: this.amount,
                  userid: user["_id"],
                  type: "card",
                  useremail: user["email"],
                  token1: token.id,
                  token2: token1.id,
                };
                //var headers = new Headers();
                //headers.append("Accept", 'application/json');
                //headers.append('Content-Type', 'application/json' );
                //let options = new RequestOptions({ headers: headers });
                this.http
                  .post(
                    Details.URL + "/fund/postpay",
                    postParams,
                    this.optionHeader
                  )
                  .subscribe(
                    (data) => {
                      var data1 = JSON.parse(data["_body"]);
                      this.paymenttype = "";
                      // console.log(data);
                      // document.getElementById('otherpayment').style.display = 'none';
                      if (data1.message && data1.message == "ok") {
                        /*Author:Anjali*/
                        // var fund = Math.round(parseFloat(this.fund)*100)/100+Math.round(parseFloat(this.amount)*100)/100;
                        // localStorage.removeItem("fund");
                        // localStorage.setItem('fund', fund.toString());
                        // this.fund = fund.toString();
                        // this.event.publish('user:fund');
                        this.prevpaylist = [];
                        this.getfundinfo();
                        this.loading.dismiss();
                        this.showToast(
                          "Well Done",
                          "Your deposit has been processed",
                          true
                        );
                      } else {
                        console.log(data1);
                        this.loading.dismiss();
                        this.showToast("Error", data1.err.message, false);
                      }
                    },
                    (err) => {
                      // console.log("****3");
                      // console.log(err);
                      this.loading.dismiss();
                      // this.showToast(err.message);
                      console.log(err);
                      this.showToast("Error", "Please check your card", false);
                    }
                  );
              } else {
                // console.log("****2");
                this.loading.dismiss();
              }
            })
            .catch((error1) => {
              // console.log("****4");
              // console.log(error1);
              this.loading.dismiss();
              this.showToast("Error", error1, false);
              console.log(error1);
            });
        } else {
          // console.log("****1");
          this.loading.dismiss();
          this.showToast("Error", "Please check your card", false);
        }
      })
      .catch((error) => {
        // console.log("****5");
        this.loading.dismiss();
        console.log(error);
        this.showToast("Error", error, false);
        // console.log(error);
      });
  }
  createCardToken(card) {
    const stripe = (<any>window).Stripe;
    if (stripe) {
      return new Promise((resolve, reject) => {
        stripe.card.createToken(card, (status, response) => {
          if (response.error) {
            reject(response.error.message);
          } else {
            resolve(response);
          }
        });
      });
    } else {
      return this.stripe.createCardToken(card);
    }
  }
  closeModal() {
    this.navCtrl.setRoot(TabsPage);
  }
  ngOnInit() {
    this.fundObservable.funds.subscribe(
      (res) => {
        this.fund = res;
      },
      (e) => {
        console.log(e);
      }
    );
    // this.stripeTest = this.fb.group({
    //   name: ['', [Validators.required]]
    // });
    // this.stripeService.elements(this.elementsOptions)
    //   .subscribe(elements => {
    //     this.elements = elements;
    //     // Only mount the element the first time
    //     if (!this.card) {
    //       this.card = this.elements.create('card', {
    //         style: {
    //           base: {
    //             iconColor: '#666EE8',
    //             color: '#31325F',
    //             lineHeight: '40px',
    //             fontWeight: 300,
    //             fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    //             fontSize: '18px',
    //             '::placeholder': {
    //               color: '#CFD7E0'
    //             }
    //           }
    //         }
    //       });
    //       this.card.mount(this.cardRef.nativeElement);
    //     }
    //   });
  }

  segmentChanged($e) {
    this.paymenttype = "";
    this.repaymenttype = "";
  }

  buy() {
    //4259072034985480 10/19 384 98121
    // const name = this.stripeTest.get('name').value;
    // const name = "sporthitters user";
    // if(this.stripeService != undefined){
    //   this.loading = this.loadingCtrl.create({
    //     content: 'Please Wait...'
    //   });
    //   this.loading.present();
    //   this.stripeService
    //   .createToken(this.card.getCard(), { name })
    //   .subscribe(result => {
    //     if (result.token) {
    //       this.stripeService
    //       .createToken(this.card.getCard(), { name })
    //       .subscribe(result1 => {
    //         if (result1.token) {
    //           var user = localStorage.getItem("loggedUser");
    //           user = JSON.parse(user);
    //           let postParams = {
    //             amount: this.amount,
    //             userid: user['_id'],
    //             type:'card',
    //             useremail:user['email'],
    //             token1:result.token.id,
    //             token2:result1.token.id
    //           }
    //           var headers = new Headers();
    //           headers.append("Accept", 'application/json');
    //           headers.append('Content-Type', 'application/json' );
    //           let options = new RequestOptions({ headers: headers });
    //           this.http.post(Details.URL+"/fund/postpay", postParams, options)
    //           .subscribe(data => {
    //             var data1 = JSON.parse(data['_body']);
    //             this.paymenttype = "";
    //             // document.getElementById('otherpayment').style.display = 'none';
    //             if(data1.message && data1.message == 'ok'){
    //               var fund = Math.round(parseFloat(this.fund)*100)/100+Math.round(parseFloat(this.amount)*100)/100;
    //               localStorage.removeItem("fund");
    //               localStorage.setItem('fund', fund.toString());
    //               this.fund = fund.toString();
    //               this.event.publish('user:fund');
    //               this.prevpaylist = [];
    //               this.getfundinfo();
    //               this.loading.dismiss();
    //           }else {
    //             this.loading.dismiss();
    //             this.showToast(data1.err.message);
    //           }
    //         }, err => {
    //           this.loading.dismiss();
    //           //this.showToast(err.message);
    //         });
    //       } else if (result1.error) {
    //           // Error creating the token
    //           this.loading.dismiss();
    //           this.showToast("Please check your card");
    //       } else {
    //         this.loading.dismiss();
    //       }
    //     }, err1 => {
    //       this.loading.dismiss();
    //     });
    //   } else if (result.error) {
    //     this.loading.dismiss();
    //     this.showToast("Please check your card");
    //   } else {
    //     this.loading.dismiss();
    //   }
    // }, err2 => {
    //   this.loading.dismiss();
    // });
    // }
  }

  btnaddfundExistCard() {
    if (Number(this.amount) < 10 || Number(this.amount) > 1000) {
      this.showToast(
        "Error",
        "Invalid amount! Please enter minimum $10, max $1000",
        false
      );
      return;
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    let postParams = {
      amount: this.amount,
      userid: user["_id"],
      type: "existcard",
      useremail: user["email"],
      token1: this.prevpaylist[this.fundid].cusid,
      token2: this.prevpaylist[this.fundid]._id,
    };
    // var headers = new Headers();
    //headers.append("Accept", 'application/json');
    //headers.append('Content-Type', 'application/json' );
    //let options = new RequestOptions({ headers: headers });
    this.http
      .post(Details.URL + "/fund/postpay", postParams, this.optionHeader)
      .subscribe((data) => {
        var data1 = JSON.parse(data["_body"]);
        this.paymenttype = "";

        document.getElementById("otherpayment").style.display = "none";
        if (data1.message == "ok") {
          /*Author:Anjali,Commmentout*/
          // var fund = Math.round(parseFloat(this.fund)*100)/100+Math.round(parseFloat(this.amount)*100)/100;
          // localStorage.removeItem("fund");
          // localStorage.setItem('fund', fund.toString());
          // this.fund = fund.toString();
          // this.event.publish('user:fund');
          this.prevpaylist = [];
          this.getfundinfo();
        }
      });
  }

  btnaddfundPP() {
    if (Number(this.amount) < 10 || Number(this.amount) > 1000) {
      this.showToast(
        "Error",
        "Invalid amount! Please enter minimum $10, max $1000",
        false
      );
      return;
    }

    this.payPal
      .init({
        PayPalEnvironmentProduction:
          "AU8CECZTngH_dW6-kfSJl_gmJW__Z5qv1Sfo4Hg9sSfodQKTAoUZJ-GO0Ujh1LThhP2X6fFxs6X828QL",
        // PayPalEnvironmentProduction: 'Ae3NICPGcGTp6nYprIX3VfPXG52DeSdKfXNzs_OgJNou8L26q7kZfe9Ud6DGK913_P62X-kSP56oQ-xj',
        PayPalEnvironmentSandbox:
          "Afs1y4Bs2QIwCdIu4fgQA2Ir-hj6d9YHacF7SwAnOlAHPjN6W9wNtkveQRVUnFL7l9HjaUAVr9APRo5F",
      })
      .then(
        (res1) => {
          // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
          this.payPal
            .prepareToRender(
              "PayPalEnvironmentProduction",
              new PayPalConfiguration({})
            )
            .then(
              (res) => {
                let detail = new PayPalPaymentDetails(
                  this.amount,
                  "0.00",
                  "0.00"
                );
                let payment = new PayPalPayment(
                  this.amount,
                  "USD",
                  "Description",
                  "sale",
                  detail
                );
                this.payPal.renderSinglePaymentUI(payment).then(
                  (res2) => {
                    // Successfully paid
                    var user = localStorage.getItem("loggedUser");
                    user = JSON.parse(user);
                    let postParams = {
                      amount: this.amount,
                      userid: user["_id"],
                      type: "paypal",
                      //cardinfo:card,
                      token: "",
                    };
                    //var headers = new Headers();
                    ///headers.append("Accept", 'application/json');
                    //headers.append('Content-Type', 'application/json' );
                    //let options = new RequestOptions({ headers: headers });
                    this.http
                      .post(
                        Details.URL + "/fund/postpay",
                        postParams,
                        this.optionHeader
                      )
                      .subscribe(
                        (data) => {
                          var data1 = JSON.parse(data["_body"]);
                          this.paymenttype = "";

                          document.getElementById(
                            "otherpayment"
                          ).style.display = "none";
                          if (data1) {
                            /*author:Anjali,Commentout*/
                            // var fund = Math.round(parseFloat(this.fund)*100)/100+Math.round(parseFloat(this.amount)*100)/100;
                            // localStorage.removeItem("fund");
                            // localStorage.setItem('fund', fund.toString());
                            // this.fund = fund.toString();
                            // this.event.publish('user:fund');
                            this.prevpaylist = [];
                            this.getfundinfo();
                          }
                        },
                        (error) => {
                          //console.log(error);
                        }
                      );
                  },
                  (error) => {
                    //console.log("!!!1");
                    //console.log(error);
                    // Error or render dialog closed without being successful
                  }
                );
              },
              () => {
                //console.log("!!!2");
                // Error in configuration
              }
            );
        },
        () => {
          //console.log("!!!3");
          // Error in initialization, maybe PayPal isn't supported or something else
        }
      );
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad FundfirstPage');
  }

  checkitem() {}

  getfundinfo() {
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    // let postParams = {
    //     userid: user['_id']
    // }
    let postParams = {
      userid: user["_id"],
      gametype: user["gameType"],
    };
    this.http
      .post(
        Details.URL + "/contest/getnotifibadget_funds",
        postParams,
        this.optionHeader
      )
      .subscribe(
        (data) => {
          var data1 = JSON.parse(data["_body"]);
          if (data1 != "err") {
            if (data1) {
              this.fundObservable.setFundNotification(Number(data1.balance));
            }
          }
        },
        (error) => {
          console.log(error); // Error getting the data
        }
      );
    // this.http.post(Details.URL+"/fund/getfundinfo", postParams, this.optionHeader)
    // .subscribe(data => {
    //   var data1 = JSON.parse(data['_body']);//console.log(data1.fund);
    //   data1.fund.forEach(element => {
    //     if(element.type == "card"){
    //       this.prevpaylist.push(element);
    //     }
    //   });
    // }, error => {
    //   //console.log(error);// Error getting the data
    // });
  }

  selectPayment(type, id, inx) {
    if (type == 2) {
      document.getElementById("otherpayment").style.display = "block";
      this.showpaybtn = false;
    } else {
      // document.getElementById('otherpayment').style.display = 'none';
      this.showpaybtn = true;
    }
    //this.fundid = id;
    this.fundid = inx;
  }

  reselectPayment(type, id, inx) {
    document.getElementById("game_btn1").style.opacity = "1";
    this.fundid = inx;
  }

  selectAmountOther(val) {
    // if(val == -1){
    //   document.getElementById('otheramount').style.display = 'flex';
    // }
    // else{
    //   document.getElementById('otheramount').style.display = 'none';
    // }
    if (val == -1)
      this.showToast(
        "For security reasons, deposits over $250 need to be confirmed.",
        " Please email <a href='mailto:support@sporthitters.com'>support@sporthitters.com</a> with your username and the amount you want to deposit. We will quickly reply with a digital deposit form and process the transaction within 15 minutes. Thank you for your patience.",
        false
      );
    // alert("For Security measures on deposits over $250 please email support@sporthitters.com with your username and deposit desired. We will quickly email you a digital deposit form and process the transaction within15 minutes. Thank you and Challenge On");
  }

  btnwithdrawfund() {
    if (this.repaymenttype == "") {
      return;
    }
    this.withdraw();
  }

  withdraw() {
    if (this.wamount == "") {
      this.showToast("Error", "Invalid amount!", false);
      return;
    }
    var user = localStorage.getItem("loggedUser");
    user = JSON.parse(user);
    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json' );

    // let options = new RequestOptions({ headers: headers });
    let postParams = {
      stripetoken: this.prevpaylist[this.fundid].chargeid,
      amount: this.wamount,
      fundid: this.prevpaylist[this.fundid]._id,
    };
    this.http
      .post(Details.URL + "/fund/postwithdraw", postParams, this.optionHeader)
      .subscribe(
        (data) => {
          var data1 = JSON.parse(data["_body"]);
          if (data1.message == "ok") {
            this.showToast("Well Done", "Withdraw success!", true);
            this.repaymenttype = "";
            document.getElementById("game_btn1").style.opacity = "0.5";
            /**Author:Anjali,Commenout */
            // var fund = Math.round(parseFloat(this.fund)*100)/100-Math.round(parseFloat(this.wamount)*100)/100;
            // localStorage.removeItem("fund");
            // localStorage.setItem('fund', fund.toString());
            // this.fund = fund.toString();
            // this.event.publish('user:fund');
          } else {
            this.showToast("Error", "Amount is not available!", false);
            this.wamount = "";
          }
        },
        (error) => {
          //console.log(error);// Error getting the data
        }
      );
  }

  showToast(title, description, returnHome) {
    // let toast = this.toast.create({
    //   message: msg,
    //   duration: 3000
    // });
    // toast.present();
    this.title = title;
    this.description = description;
    this.showpopup = true;
    this.returnHome = returnHome;
  }
  closePopup() {
    this.showpopup = false;
    this.title = "";
    this.description = "";
    if (this.returnHome) {
      this.navCtrl.setRoot(HomePage);
    }
  }
  paywithprev() {
    if (
      (<any>window).location.hostname == "localhost" ||
      (<any>window).location.hostname == "app.sporthitter.test123.dev"
    ) {
      this.stripe.setPublishableKey("pk_test_ihso9TATKU8jgyor5Lhj9LAw");
    } else if ((<any>window).location.hostname == "stageapp.testshiapp.com") {
      this.stripe.setPublishableKey("pk_test_ihso9TATKU8jgyor5Lhj9LAw");
    } else {
      this.stripe.setPublishableKey("pk_live_BrDSDfM5DuTxg7xZSizJBOmQ");
    }
    // this.stripe.createCardToken(card)
    // .then(token => console.log(token.id))
    // .catch(error => console.error(error));

    // var user = localStorage.getItem("loggedUser");
    // user = JSON.parse(user);
    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json' );

    // let options = new RequestOptions({ headers: headers });
    // let postParams = {
    //   //stripetoken: token,
    //   amount: this.amount,
    //   fundid:this.fundid
    // }
    // this.http.post(Details.URL+"/fund/postpayprev", postParams, options)
    // .subscribe(data => {
    //   var data1 = JSON.parse(data['_body']);
    //   if(data1.message){
    //     this.showToast('Deposit success!');
    //     this.paymenttype = "";

    //     var fund = Math.round(parseFloat(this.fund)*100)/100 + Math.round(parseFloat(this.amount)*100)/100;
    //     localStorage.removeItem("fund");
    //     localStorage.setItem('fund', fund.toString());
    //     this.fund = fund.toString();
    //     this.event.publish('user:fund');
    //   }
    // }, error => {
    //   //console.log(error);// Error getting the data
    // });
  }

  btnaddfund() {
    //console.log(this.stripeTest);
    if (this.paymenttype == "") {
      return;
    }

    if (Number(this.amount) < 10 || Number(this.amount) > 1000) {
      this.showToast(
        "Error",
        "Invalid amount! Please enter minimum $10, max $1000",
        false
      );
      return;
    }

    if (document.getElementById("otherpayment").style.display == "block") {
    } else {
      this.paywithprev();
    }
  }

  goFund() {
    this.navCtrl.push(FundfirstPage);
  }
}
