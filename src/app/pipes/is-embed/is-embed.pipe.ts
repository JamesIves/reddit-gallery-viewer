import { Pipe, PipeTransform } from '@angular/core';

/**
 * Determines if the content rendered is a video or not.
 * Used to determine which HTML element to render based on
 * the preview.
 */
@Pipe({ name: 'isEmbed', standalone: true })
export class IsEmbedPipe implements PipeTransform {
  transform(value: string): boolean {
    return value.endsWith('gifv');
  }
}
