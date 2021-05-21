import { Injectable } from '@angular/core';

@Injectable()
export class Global {
  /** Messages in Chat **/
  public badge:any = Array();
  /** Online Status in Chatfeed **/
  public statusList:any = Array();
  /** Calculate Percentage in Chatfeed **/
  public scorePerSport = { "nfl":0, "mlb":0, "nhl":0, "nba":0, "golf":0, "ncaab":0, "ncaaf":0, "nascar":0 };
  /** Invite Challenge Notification **/
  public notifiBadget:any=Array();
  /** GameType : game1 & game2, default : game1 */
  public gameType:any = "game2";

  public badgeChatCount: number;

  public badgeFriendCount: number;

  /** Notification Accept */
  public notifiData:any = null;
  public sportsImageURL = {
    SX:'./assets/img/sx.png',
    NHL : './assets/img/nhl.png',
    NFL : './assets/img/nfl.png',
    NBA : './assets/img/nba.png',
    NCAAF : './assets/img/col-football.png',
    GOLF : './assets/img/golf.png',
    NCAAB : './assets/img/col-basket.png',
    NASCAR : './assets/img/nascar.png',
    MLB : './assets/img/mlb.png'
  }

  public newSportsImageURL = {
    sx: './assets/img/icons-sports/Path 522.svg',
    nhl: './assets/img/icons-sports/Group 151.svg',
    nfl: './assets/img/icons-sports/Group 154.svg',
    nba: './assets/img/icons-sports/Path 543.svg',
    ncaaf: './assets/img/icons-sports/Group 158.svg',
    golf: './assets/img/icons-sports/Group 156.svg',
    ncaab: './assets/img/icons-sports/Group 159.svg',
    nascar: './assets/img/icons-sports/Group 162.svg',
    mlb: './assets/img/icons-sports/Path 544.svg'
  }
  public newSportsImageURLOtherColor = {
    nhl: './assets/img/icons-sports/Group 100.svg',
    nfl: './assets/img/icons-sports/Group 120.svg',
    nba: './assets/img/icons-sports/Path 316.svg',
    ncaaf: './assets/img/icons-sports/Group 121.svg',
    golf: './assets/img/icons-sports/Group 135.svg',
    ncaab: './assets/img/icons-sports/Group 123.svg',
    nascar: './assets/img/icons-sports/Group 138.svg',
    mlb: './assets/img/icons-sports/Path 535.svg'
  }
}
