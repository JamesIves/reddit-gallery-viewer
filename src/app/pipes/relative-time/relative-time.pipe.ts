import {Pipe, PipeTransform} from '@angular/core'

/**
 * Converts a timestamp to a human-readable relative time format.
 * For example, it converts 1672531199 to "2h ago".
 * This is useful for displaying how long ago a post was made.
 */
@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {
  public transform(value: number): string {
    if (!value) return 'Just now'

    const now = Date.now()
    const diffInSeconds = Math.floor((now - value * 1000) / 1000)

    const minutes = Math.floor(diffInSeconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) return `${years}y ago`
    if (months > 0) return `${months}mo ago`
    if (weeks > 0) return `${weeks}w ago`
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`

    return 'Just now'
  }
}
