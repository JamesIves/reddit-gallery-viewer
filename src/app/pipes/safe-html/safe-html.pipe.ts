import {inject, Pipe, PipeTransform} from '@angular/core'
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'

/**
 * Bypasses security in order to trust the resource url.
 * This is primarily used to embed gifv resources on the page
 * as they are essentially iframes in disguise.
 */
@Pipe({name: 'safeHtml', standalone: true})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer)

  public transform(src: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustHtml(src)
  }
}
