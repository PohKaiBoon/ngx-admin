import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "capitalise",
})
export class CapitalisePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    return value.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
      return str.toUpperCase();
    });
  }
}
