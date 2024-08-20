import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cacheBuster',
  standalone: true
})
export class CacheBusterPipe implements PipeTransform {

  transform(url: string): string {
    return `${url}?cb=${Date.now()}`;
  }

}
