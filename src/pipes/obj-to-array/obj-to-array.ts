import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objToArray',
})
export class ObjToArrayPipe implements PipeTransform {
  transform(object:any) {
    var result = [];
    for(var i in object){
    	result.push(object[i]);
    }
    return result;
  }
}
