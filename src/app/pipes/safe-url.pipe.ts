import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from "@angular/platform-browser";


@Pipe({
  name: 'safeUrl',
  standalone: true
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  public transform(value: any, type: string): SafeHtml | SafeResourceUrl | SafeScript | SafeStyle | SafeUrl {

    switch(type) {
      case 'html':
        return this.sanitizer.bypassSecurityTrustHtml(value);
        case 'style':
        return this.sanitizer.bypassSecurityTrustStyle(value);
        case 'script' :
        return this.sanitizer.bypassSecurityTrustScript(value);
        case 'url' :
        return this.sanitizer.bypassSecurityTrustUrl(value);
        case 'resourceurl':
        return this.sanitizer.bypassSecurityTrustResourceUrl(value);
        default: throw new Error(`invalid safe type specified: ${type}`);
    }
  }
}
