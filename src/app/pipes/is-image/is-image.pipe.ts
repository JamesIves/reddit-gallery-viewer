import {Pipe, PipeTransform} from '@angular/core'

/**
 * Determines if the content rendered is an image or not.
 * Used to determine which HTML element to render based on
 * the preview.
 */
@Pipe({name: 'isImage', standalone: true})
export class IsImagePipe implements PipeTransform {
  public transform(value: string): boolean {
    return (
      value.endsWith('png') ||
      value.endsWith('jpg') ||
      value.endsWith('jpeg') ||
      value.endsWith('gif')
    )
  }
}
