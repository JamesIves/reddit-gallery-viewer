import {Pipe, PipeTransform, inject} from '@angular/core'
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'

/**
 * Bypasses security in order to trust the resource url.
 * This is primarily used to embed gifv resources on the page
 * as they are essentially iframes in disguise.
 */
@Pipe({name: 'trustResource', standalone: true})
export class TrustResourcePipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer)

  public transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
