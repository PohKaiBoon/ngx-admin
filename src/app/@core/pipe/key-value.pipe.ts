import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keyValuePairs' })

export class KeyValuePipe implements PipeTransform {
  transform(value: any): any[] {
    const keys = Object.keys(value);
    const pairs = [];
    for (let i = 0; i < keys.length; i += 2) {
      pairs.push({
        key: keys[i],
        value: value[keys[i]],
        nextKey: keys[i + 1] ? keys[i + 1] : null
      });
    }
    return pairs;
  }
}
