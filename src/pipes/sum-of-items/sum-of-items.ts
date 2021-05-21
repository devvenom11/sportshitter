import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sum'
})
export class SumPipe implements PipeTransform {
    transform(items: any[], attr: string): any {
        if(Array.isArray(items)){
            return (items.reduce((a, b) => (parseFloat(a.toFixed(2)) + parseFloat(attr ? b[attr] : b)),0)).toFixed(2);
        }else{
            return 0;
        }
    }
}


