import { Pipe, PipeTransform } from '@angular/core';

/**
 * Determines if the content rendered is a video or not.
 * Used to determine which HTML element to render based on
 * the preview.
 */
@Pipe({ name: 'isVideo', standalone: true })
export class IsVideoPipe implements PipeTransform {
  transform(value: string): boolean {
    return (
      value.endsWith('mp4') || value.endsWith('mov') || value.endsWith('webm')
    );
  }
}
