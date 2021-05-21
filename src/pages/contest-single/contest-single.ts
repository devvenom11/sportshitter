import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, ToastController, LoadingController, Navbar } from 'ionic-angular';
import { FavouritesPage } from './../favourites/favourites';
import { Http, Headers, RequestOptions } from '@angular/http';
import {environment as Details} from '../../environment';
import { FundfirstPage } from './../fundfirst/fundfirst';
import { invitePage } from './../invitePage/invitepage';
import { Global } from '../../services/Global';
import { ContestSelectPage } from './../contest-select/contest-select';
import { FundObservable } from '../../services/fundObservable';
import { ContestMainPage } from '../contest-main/contest-main';
import * as moment from 'moment-timezone';
import { ChatGroupPage } from '../chat-group/chat-group';

@Component({
    selector: 'page-contest-single',
    templateUrl: 'contest-single.html',
})
export class ContestSinglePage {
    @ViewChild(Navbar) navBar: Navbar;
    fund:number= 0;
    showpos = -1;
    loading: any;
    contestPrizeFraction = Details.contestPrizeFraction;
    headers = new Headers();
    optionHeader:any;
    showPossiblePrize:boolean=false;
    pickCurrentUser;
    resultByUser=[]
    currentUserIndex:number;
    data:any;
    userID;
    resultList;
    constestID
    showData:boolean=false;
    checkedgroup;
    currentContestID
    team;
    player
    name;
    game;
    isPending:boolean=true;
    details:boolean=true;
    scores:boolean=false;
    scoreList=[]
    showRealPrize:boolean=false;
    invitelimit:number;
    userDeclined:boolean=false;
    showInviteButton:boolean=false;
    totalUserInvited:number
    userOrderByRank=[];
    showposScore
    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public http: Http,
        public event: Events,
        public loadingCtrl: LoadingController,
        public toast: ToastController,
        public global: Global,
        public fundObservable: FundObservable) {
        this.headers.append("Accept", 'application/json');
        this.headers.append('Content-Type', 'application/json' );
        this.headers.append("x-auth",localStorage.getItem("token"));
        this.optionHeader=new RequestOptions({ headers: this.headers });
        this.userID = JSON.parse(localStorage.getItem("loggedUser"))._id;
        this.constestID=this.navParams.get('constestID');
        console.log(this.constestID)
        this.loading = loadingCtrl.create({
            content: 'Please Wait...'
        });
        this.loading.present();
    }
    getSingleChallenge(){
        this.http.get(`${Details.URL}/contest/singlegame_info/${this.constestID}/${this.userID}`,this.optionHeader).subscribe(
            res=>{
                let data=JSON.parse(res['_body'])
                this.data=data[0]
                this.isPending= (this.data.challengestatus=='pending') ? true : false
                console.log(this.data)
                this.currentContestID=this.data.challenge_id;
                this.team=this.data.challengedetails.team;
                this.name=this.data.challengedetails.sport;
                this.player= this.data.challengedetails.player;
                this.game=this.data.challengedetails.game
                this.pickCurrentUser=this.data.challengedetails.checkedgroup[this.data.challengedetails.userlist.indexOf(this.userID)]
                let resultList=[],checkedgroup=[],g2ValTotal=[]
                this.data.challengedetails.checkedgroup.forEach(res=>{
                    checkedgroup.push(JSON.parse(res))
                })
                this.data.challengedetails.resultlist.forEach(res=>{
                    resultList.push(JSON.parse(res))
                })
                // history challenge.
                if(!this.isPending){
                    this.data.challengedetails.userlistusername.forEach((element,index) => {
                        let prize= element.rank == 1 ? this.data.prizeamount : 0;
                        let currentscore=0;
                        let userlistIndex=this.data.challengedetails.userlist.indexOf(element.userid)
                        checkedgroup[userlistIndex].forEach(res=>{
                            resultList.forEach(res3=>{
                                if(res3[0].EventID==res.eventid){
                                    switch (res.type) {
                                        case "home":
                                            if(parseFloat(res3[0].HomeScore) > parseFloat(res3[0].AwayScore)){
                                                currentscore=Number(res.g2Val)+currentscore
                                            }
                                            else{
                                                currentscore=0+currentscore
                                            }
                                        break;
                                        case "away":
                                            if(parseFloat(res3[0].AwayScore) > parseFloat(res3[0].HomeScore)){
                                                currentscore=Number(res.g2Val)+currentscore
                                            }
                                            else{
                                                currentscore=0+currentscore
                                            }
                                        break;
                                    }
                                }
                            })
                        })
                        let data={
                            name:element.username,
                            rank: element.rank,
                            picks:checkedgroup[userlistIndex],
                            prize: prize,
                            point: currentscore,
                            userid:element.userid
                        }
                        this.userOrderByRank.push(data)
                    });
                    this.userOrderByRank=this.userOrderByRank.sort((a,b) => a.rank - b.rank)
                }
                console.log('order by rank',this.userOrderByRank)
                let totalUserInvited=0, totalPlayers=parseInt(this.data.challengedetails.player);
                this.data.challengedetails.invitearrayusername.forEach(res=>{
                    if(res.invitestatus=="Declined"){
                        this.userDeclined=true;
                    }
                    else{
                        totalUserInvited= totalUserInvited+1
                    }
                })
                this.totalUserInvited=totalUserInvited
                if(!this.userDeclined){
                    if(this.data.challengedetails.invitearray.length < totalPlayers && this.data.challengedetails.userid==this.userID){
                        this.invitelimit= totalPlayers - parseInt(this.data.challengedetails.sendinviteusers.length);
                        this.showInviteButton= this.invitelimit > 0 && this.data.challengedetails.directflag == true || this.invitelimit > 0 && this.data.challengedetails.inviteflag == true ? true : false;
                    }
                    else{
                        this.showInviteButton=false;
                        this.invitelimit=0
                    }
                }
                else{
                    if(this.totalUserInvited>0){
                        this.invitelimit=totalPlayers - this.totalUserInvited
                    }
                    else{
                        this.invitelimit=totalPlayers;
                    }
                    this.showInviteButton= this.invitelimit > 0 && this.data.challengedetails.userid==this.userID && this.data.challengedetails.directflag == true || this.invitelimit > 0 && this.data.challengedetails.userid==this.userID && this.data.challengedetails.inviteflag == true ? true : false
                }
                this.resultList=resultList;
                // this.resultList=[[{"ID":"6c7fd5d0-1fa2-4c21-a584-b4d60c51c2da","HomeScore":"3","AwayScore":"2","Final":true,"EventID":"6c7fd5d0-1fa2-4c21-a584-b4d60c51c2da","OddType":"Game","FinalType":"Finished","BinaryScore":"1-0"}],[{"ID":"d973acf8-93f3-48e4-a032-9ec48d71e1e2","HomeScore":"4","AwayScore":"1","Final":true,"EventID":"d973acf8-93f3-48e4-a032-9ec48d71e1e2","OddType":"Game","FinalType":"Finished","BinaryScore":"1-0"}]]
                this.checkedgroup=checkedgroup
                this.pickCurrentUser=JSON.parse(this.pickCurrentUser)
                this.currentUserIndex=this.data.challengedetails.userlist.indexOf(this.userID);
                let showPossiblePrize=true;
                let date=new Date().toISOString()
                let estDate=moment.tz(date,'America/New_York');
                let startDate=moment(estDate).format('YYYY-MM-DD');
                let convertDate,gameDate,month
                this.checkedgroup.forEach(res=>{
                    res.forEach(res2=>{
                        gameDate=new Date(res2.timeHours)
                        month=gameDate.getMonth()+1
                        convertDate=gameDate.getFullYear()+'-'+month+'-'+gameDate.getDate()
                        if(moment(startDate,'YYYY-MM-DD').isSame(moment(convertDate,'YYYY-MM-DD'))){
                            if(!this.checkTime(res2.timeHours)){
                                showPossiblePrize=false;
                            }
                        }
                    })
                })
                if(showPossiblePrize){
                    this.showPossiblePrize=true
                }
                else{
                    this.showPossiblePrize=false
                }
                console.log(this.pickCurrentUser)
                console.log(this.resultList)
                console.log(this.checkedgroup)
                console.log('resultlist length',this.resultList.length)
                // CHECK IF ITS A SP CHALLENGE. IF IT THEN CHECK THE CHALLENGE END TO KNOW IF WE HAVE TO REDIRECT OR NOT TO PICK PAGE.
                if(this.data.challengedetails.flag=='sp'){
                    this.http.get(`${Details.URL}/auth/single_specialpromolist/${this.data.challengedetails.promoid}`,this.optionHeader).subscribe(
                        res=>{
                            let data=JSON.parse(res['_body'])
                            let date=data.promo[0].challenge_end.split('.')[0]
                            date=moment(date).format('MM/DD/YYYY hh:mm A')
                            if(data.challenge.userlist.findIndex(x => x ===this.userID)!=-1){
                                if(data.challenge.checkedgroup[data.challenge.userlist.findIndex(x => x ===this.userID)]=='[]'){
                                    if(this.data.challengestatus!="finished"){
                                        if(this.checkTime(date)){
                                            this.makePick()
                                        }
                                    }
                                }
                            }
                        },
                        e=>{
                            console.log(e)
                        }
                    )
                }
                // OTHER CHALLENGES
                else{
                    // REDIRECT TO PICK PAGE IF THE CHALLENGE NOT STARTED.
                    if(this.pickCurrentUser.length < this.data.challengedetails.team && this.resultList.length==0){
                        let checkedgroupArry = this.checkedgroup.map((d) => {
                            if(d.length>0){
                                return moment(d[0].timeHours)
                            }
                        })
                        // remove empty data.
                        checkedgroupArry = checkedgroupArry.filter(function (el) {
                            return el != null;
                        });
                        // IF USER MAKE ITS PICKS
                        if(checkedgroupArry.length > 0){
                            let date = moment.min(checkedgroupArry)
                            if(moment(startDate,'YYYY-MM-DD').isSame(moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'))){
                                if(this.checkTime(date)){
                                    this.makePick()
                                }
                            }
                            else{
                                this.makePick()
                            }
                        }
                        // IF USER DIDNT MAKE ITS PICKS CHECK IF THE CHALLENGE STILL PENDING
                        else{
                            if(this.data.challengestatus='pending'){
                                this.makePick();
                            }
                        }
                    }
                }
                this.showData=true
                this.loading.dismiss()
                // get result by user
                    this.checkedgroup.forEach((res,index)=>{
                        let g2ValTemp=[];
                        res.forEach((res2,index2)=>{
                            this.resultList.forEach(res3=>{
                                if(res2.eventid==res3[0].EventID){
                                    switch (res2.type) {
                                        case "home":
                                            if(parseFloat(res3[0].HomeScore) > parseFloat(res3[0].AwayScore)){
                                                g2ValTemp[index2]=res2.g2Val
                                            }
                                            else{
                                                g2ValTemp[index2]=0
                                            }
                                        break;
                                        case "away":
                                            if(parseFloat(res3[0].AwayScore) > parseFloat(res3[0].HomeScore)){
                                                g2ValTemp[index2]=res2.g2Val
                                            }
                                            else{
                                                g2ValTemp[index2]=0
                                            }
                                        break;
                                    }
                                }
                            })
                        })
                        g2ValTotal[index]=g2ValTemp
                    })
                    this.resultByUser=g2ValTotal;
                    console.log(this.resultByUser)
                    if(this.isPending){
                        this.scoreView();
                    }
            },
            e=>{
                console.log(e)
            }
        )
    }
    inviteUser() {
        this.navCtrl.push(invitePage, {
            menu: false,
            contestid: this.data.challenge_id,
            gameType: "game2",
            invitelimit: this.invitelimit
        })
    }
    ngOnInit() {
        this.fundObservable.funds.subscribe(
            res=>{
              this.fund=res
            },
            e=>{
              console.log(e)
            }
          )
    }
    ionViewWillEnter() {
        this.getSingleChallenge();
    }
    ionViewDidEnter() {
        this.navBar.backButtonClick = () => {
            this.navCtrl.setRoot(ContestMainPage)
        };
    }
    makePick() {
        localStorage.setItem('comingfromnotification','true')
        if(this.data.challengedetails.flag=='sp'){
            this.navCtrl.push(ContestSelectPage, {
                sport: this.name,
                player: this.player,
                team: this.team,
                game: this.game,
                currentcontestid: this.data.challengedetails.promoid,
                create:this.data.challengedetails.flag
            });
        }
        else{
            this.navCtrl.push(ContestSelectPage, {
                sport: this.name,
                player: this.player,
                team: this.team,
                game: this.game,
                currentcontestid: this.currentContestID
            });
        }
        // this.http.get(`${Details.URL}/odds/getodds:${this.data.challengedetails.sport}`,this.optionHeader).subscribe(response => {
        //     response = JSON.parse(response['_body']);
        //     response= JSON.parse(response['data']);
        //     console.log(response)
        //     this.navCtrl.push(ContestSelectPage, {
        //         name: this.data.challengedetails.sport,
        //         player: this.data.challengedetails.player,
        //         team: this.data.challengedetails.team,
        //         game: this.data.challengedetails.game,
        //         sportinfo: response,
        //         joinflag: false,
        //         create: true,
        //         currentcontestid: this.data.challenge_id
        //     });
        // },
        // e=>{
        //     console.log(e)
        // })
    }
    calcTotal(i){
        return this.resultByUser[i].reduce((a,b)=>parseFloat(a)+parseFloat(b),0)
    }
    showPicks(i){
        if (i == this.showpos) {
            this.showpos = -1;
        }
        else {
            this.showpos = i;
        }
    }
    showPicksDcore(i){
        if (i == this.showposScore) {
            this.showposScore = -1;
        }
        else {
            this.showposScore = i;
        }
    }
    ifmakePick(id){
        let index=this.data.challengedetails.userlist.findIndex(x => x ===id);
        let checkedgroup
        if(index!=-1){
            checkedgroup=JSON.parse(this.data.challengedetails.checkedgroup[index])
            if(checkedgroup.length==0){
                return true
            }
        }
        else{
            return true
        }
    }
    getUsername(id){
        let index=this.data.challengedetails.invitearrayusername.findIndex(x => x.userid ===id)
        if(index!=-1){
            return this.data.challengedetails.invitearrayusername[index].username
        }
    }
    getUsernameUserAccept(id){
        let index=this.data.challengedetails.userlistusername.findIndex(x => x.userid ===id)
        if(index!=-1){
            return this.data.challengedetails.userlistusername[index].username
        }
        else{
            return id
        }
    }
    haveResultList(id){
        if(this.resultList.length>0){
            let isIn=this.resultList.findIndex(x => x[0].ID ===id)
            if(isIn==-1){
                return false
            }
            else{
                return true
            }
        }
        else{
            return false
        }
    }
    checkIfUserAcceptInv(id){

    }
    goFavourite() {
        this.navCtrl.push(FavouritesPage, { menu: false });
    }
    goFund() {
        this.navCtrl.push(FundfirstPage);
    }
    showDetails(){
        this.scores=false;
        this.details=true;
    }
    showScore(){
        this.details=false;
        this.scores=true;
    }
    scoreView(){
        this.data.challengedetails.userlist.forEach((res,index)=>{
            let array={name:'',score:0,pointPossible:0,gamesPlayer:'',index:index};
            let currentscore=0,pointPossible=0,counter=0;
            let checkedgroup=JSON.parse(this.data.challengedetails.checkedgroup[index]);
            array.name=this.data.challengedetails.userlistusername[this.data.challengedetails.userlistusername.findIndex(x => x.userid ===res)].username
            // array.name=this.data.challengedetails.userlistusername[index].username;
            checkedgroup.forEach((res2,index)=>{
                pointPossible=Number(res2.g2Val)+pointPossible;
                if(this.data.challengedetails.resultlist.length>0){
                    let resultList=[]
                    this.data.challengedetails.resultlist.forEach(res=>{
                        resultList.push(JSON.parse(res))
                    })
                    resultList.forEach(res3=>{
                        if(res3[0].EventID==res2.eventid){
                            counter++;
                            switch (res2.type) {
                                case "home":
                                    if(parseFloat(res3[0].HomeScore) > parseFloat(res3[0].AwayScore)){
                                        currentscore=Number(res2.g2Val)+currentscore
                                    }
                                    else{
                                        pointPossible=pointPossible-Number(res2.g2Val)
                                        currentscore=0+currentscore
                                    }
                                break;
                                case "away":
                                    if(parseFloat(res3[0].AwayScore) > parseFloat(res3[0].HomeScore)){
                                        currentscore=Number(res2.g2Val)+currentscore
                                    }
                                    else{
                                        pointPossible=pointPossible-Number(res2.g2Val)
                                        currentscore=0+currentscore
                                    }
                                break;
                            }
                        }
                    })
                }
            })
            array.score=currentscore;
            array.pointPossible=pointPossible
            array.gamesPlayer=counter+'/'+this.data.challengedetails.team;
            this.scoreList[index]=array;
            let sortByCurrent=false
            this.scoreList.forEach(res=>{
                if(res.score>0){
                    sortByCurrent=true;
                }
            })
            if(sortByCurrent){
                this.scoreList.sort((a,b) => a.score - b.score).reverse()
            }
            else{
                this.scoreList.sort((a,b) => a.pointPossible - b.pointPossible).reverse()
            }
        })
    }
    checkTime(timeString){
        let time=new Date(timeString).getHours()+':'+new Date(timeString).getMinutes();
        let nowTime=new Date().toISOString()
        let estDate=moment.tz(nowTime,'America/New_York');
        let ESTTime=moment(estDate).format('HH:mm');
        let diff=moment.duration(moment(ESTTime,'HH:mm').diff(moment(time,'HH:mm')));
        if(Math.sign(diff.asMinutes())==-1){
            if((diff.asMinutes()*-1)>2){
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
      }
    toNumber(val){
        return Number(val)
    }
    goToChat(){
      this.navCtrl.push(ChatGroupPage, {
        chatType: 'challenge',
        legacyChallengeId: this.data.challengedetails._id,
      });
    }
}
