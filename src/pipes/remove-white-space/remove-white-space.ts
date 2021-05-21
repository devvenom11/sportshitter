import { Pipe, PipeTransform } from '@angular/core';
 
@Pipe({
  name: 'removewhitespaces'
})
export class RemovewhitespacesPipe implements PipeTransform {
 
  transform(value: any, args?: any): any {
    return value.replace(/ /g, '');
  }
 
}