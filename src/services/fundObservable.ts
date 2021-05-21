import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FundObservable {
    public fund: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public funds: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public showEditAlert: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    // private fundObserver: any;
    // public fund: any;

    constructor() {
        // this.fundObserver= null;

        // this.fund= Observable.create(observer => {
        //     this.fundObserver= observer;
        // });
    }

    public setFund(val): void { 
        this.fund.next(val);
    }
    public setFundNotification(val):void{
        this.funds.next(val.toFixed(2))
    }
    public setEditAlert(val):void{
        this.showEditAlert.next(val)
    }
}