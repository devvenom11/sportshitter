import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {TwitterConnect} from '@ionic-native/twitter-connect';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { Dialogs } from '@ionic-native/dialogs';

import { Global } from '../services/Global';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { ActivateCodePage } from '../pages/activatecode/activatecode';
import { ConfirmEmailPage } from '../pages/confirm-email/confirm-email'
import { ConsultantsPage } from '../pages/consultants/consultants';

import { TabsPage } from '../pages/tabs/tabs';
import { FavouritesPage } from '../pages/favourites/favourites';
import { ContestMainPage } from '../pages/contest-main/contest-main';
import { ContestSportPage } from '../pages/contest-sport/contest-sport';
import { ContestDetailPage } from '../pages/contest-detail/contest-detail';
import { ContestSelectPage } from '../pages/contest-select/contest-select';
import { CreateContestPage } from '../pages/create-contest/create-contest';
import { JoinContestPage } from '../pages/join-contest/join-contest';
import { ResponsiblePlayPage } from '../pages/responsible-play/responsible-play';
import { HowToPlayPage } from '../pages/how-to-play/how-to-play';
import { RulesPage } from '../pages/rules/rules';
import { JoinContestDetailPage } from '../pages/join-contest-detail/join-contest-detail';
import { ContestSinglePage } from '../pages/contest-single/contest-single';
import { ContestChatPage } from '../pages/contest-chat/contest-chat';
import { FavoriteDetailPage } from '../pages/favorite-detail/favorite-detail';
import { FundfirstPage } from '../pages/fundfirst/fundfirst';
import { AccountsettingPage } from '../pages/accountsetting/accountsetting';
import { PreferencePage } from '../pages/preference/preference';
import { ChatfeedPage } from '../pages/chatfeed/chatfeed';
import { NewPasswordPage } from '../pages/new-password/new-password';
import { invitePage } from '../pages/invitePage/invitepage';
import { NotificationPage } from '../pages/notification/notification';
import { ChallengeHomePage } from '../pages/challenge-home/challenge-home';
import { WithdrawPage } from '../pages/withdraw/withdraw';
import { RulePage } from '../pages/rule/rule';
//NewPasswordPage

import { PipesModule } from '../pipes/pipes.module';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SignUpProvider } from '../providers/sign-up/sign-up';
import { LoginProvider } from '../providers/login/login';
import { Stripe } from '@ionic-native/stripe';
import { PayPal } from '@ionic-native/paypal';
import { Keyboard } from '@ionic-native/keyboard';
import { EmailComposer } from '@ionic-native/email-composer';
import { SocialSharing } from '@ionic-native/social-sharing';
import { OneSignal } from '@ionic-native/onesignal';

// import { NgxStripeModule } from 'ngx-stripe';//  this module is not used in this application yet
import {environment} from '../environment';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';

// const config: SocketIoConfig = { url: 'https://app.sporthitter.test123.dev', options: { path:'/io/socket.io' } };
const config: SocketIoConfig = { url: environment.socketUrl, options: {
  query: {token: localStorage.getItem('token')},
  path: environment.socketPath,
}};

import { Network } from '@ionic-native/network';
import { SliderPage } from '../pages/slider/slider';
import { MyAccountPage } from '../pages/my-account/my-account';
import { HowToPlayMainPage } from '../pages/how-to-play-main/how-to-play-main';
import { TermsPage } from '../pages/terms/terms';

// import { ChallengeHomePageModule } from '../pages/challenge-home/challenge-home.module';

import { Geolocation } from  '@ionic-native/geolocation';
import { FundObservable } from '../services/fundObservable';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { BonusFundPage } from '../pages/bonus-fund/bonus-fund';
import { ChallengePicksPage } from '../pages/challenge-picks/challenge-picks';
import { ChallengeAmountPage } from '../pages/challenge-amount/challenge-amount';
import { ReferFriendPage } from '../pages/refer-friend/refer-friend';
import { PlayPointsPage } from '../pages/play-points/play-points';
import { PointsActivityPage } from '../pages/points-activity/points-activity';
import { PromoHomePage } from '../pages/promo-home/promo-home';
import { SpecialPromoAuthPage } from '../pages/special-promo-auth/special-promo-auth';
import { SingleSpecialPromoPage } from '../pages/single-special-promo/single-special-promo';
import { PagesOddsPage } from '../pages/pages-odds/pages-odds';
import { ChatGroupListPage } from '../pages/chat-group-list/chat-group-list';
import { ChatGroupPage } from '../pages/chat-group/chat-group';
import { NotificationSettingsPage } from "../pages/notification-settings/notification-settings";
import { ChallengeSportListPage } from '../pages/challenge-sport-list/challenge-sport-list';
import { ChallengeLobbyPage } from "../pages/challenge-lobby/challenge-lobby";
import { JoinTournamentPage } from "../pages/join-tournament/join-tournament";
import { MyChallengesPage } from "../pages/my-challenges/my-challenges";
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignUpPage,
    FavouritesPage,
    TabsPage,
    ContestMainPage,
    CreateContestPage,
    JoinContestPage,
    ResponsiblePlayPage,
    ForgotPasswordPage,
    HowToPlayPage,
    RulesPage,
    ContestSportPage,
    ContestDetailPage,
    ContestSelectPage,
    JoinContestDetailPage,
    ContestSinglePage,
    ContestChatPage,
    FavoriteDetailPage,
    FundfirstPage,
    ActivateCodePage,
    ConsultantsPage,
    AccountsettingPage,
    PreferencePage,
    ChatfeedPage,
    ChallengeSportListPage,
    NewPasswordPage,
    invitePage,
    NotificationPage,
    ChallengeHomePage,
    WithdrawPage,
    RulePage,
    ConfirmEmailPage,
    SliderPage,
    MyAccountPage,
    HowToPlayMainPage,
    TermsPage,
    EditProfilePage,
    BonusFundPage,
    ChallengeAmountPage,
    ChallengePicksPage,
    ReferFriendPage,
    PlayPointsPage,
    PointsActivityPage,
    PromoHomePage,
    SpecialPromoAuthPage,
    SingleSpecialPromoPage,
    PagesOddsPage,
    ChatGroupPage,
    ChatGroupListPage,
    NotificationSettingsPage,
    ChallengeLobbyPage,
    JoinTournamentPage,
    MyChallengesPage
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp,{
      rippleEffect: false,
      mode: 'md'
    }),
    SocketIoModule.forRoot(config),
    HttpModule,
    // NgxStripeModule.forRoot('pk_live_BrDSDfM5DuTxg7xZSizJBOmQ'),
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    SignUpPage,
    FavouritesPage,
    TabsPage,
    ContestMainPage,
    CreateContestPage,
    JoinContestPage,
    ForgotPasswordPage,
    ResponsiblePlayPage,
    HowToPlayPage,
    RulesPage,
    ContestSportPage,
    ContestDetailPage,
    ContestSelectPage,
    JoinContestDetailPage,
    ChallengeSportListPage,
    ContestSinglePage,
    ContestChatPage,
    FavoriteDetailPage,
    FundfirstPage,
    ActivateCodePage,
    ConsultantsPage,
    AccountsettingPage,
    PreferencePage,
    ChatfeedPage,
    NewPasswordPage,
    invitePage,
    NotificationPage,
    ChallengeHomePage,
    WithdrawPage,
    RulePage,
    ConfirmEmailPage,
    SliderPage,
    MyAccountPage,
    HowToPlayMainPage,
    TermsPage,
    EditProfilePage,
    BonusFundPage,
    ChallengeAmountPage,
    ChallengePicksPage,
    ReferFriendPage,
    PlayPointsPage,
    PointsActivityPage,
    PromoHomePage,
    SpecialPromoAuthPage,
    SingleSpecialPromoPage,
    PagesOddsPage,
    ChatGroupPage,
    ChatGroupListPage,
    NotificationSettingsPage,
    ChallengeLobbyPage,
    JoinTournamentPage,
    MyChallengesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SignUpProvider,
    LoginProvider,
    Camera,
    InAppBrowser,
    TwitterConnect,
    GooglePlus,
    Facebook,
    Dialogs,
    Stripe,
    PayPal,
    Keyboard,
    EmailComposer,
    SocialSharing,
    Global,
    Network,
    OneSignal,
    Geolocation,
    FundObservable
  ]
})
export class AppModule {}
