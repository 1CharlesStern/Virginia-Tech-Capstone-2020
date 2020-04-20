import { Pipe, PipeTransform } from '@angular/core';
/*
  Given a string, Truncate returns the truncated original string up to 25 characters.
  Argument: change truncate length
*/
@Pipe({name: 'truncate'})
export class TruncatePipe implements PipeTransform {
  transform(value: String, length?: number): String {
    let len = isNaN(length) ? 25 : length
    if (value.length <= len){
      return value
    }
    else {
      return value.substring(0, len)+"..."
    }
  }
}
