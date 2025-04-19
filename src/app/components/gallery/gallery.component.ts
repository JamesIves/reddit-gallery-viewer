import {CommonModule} from '@angular/common'
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core'
import {
  IRedditMediaMetadata,
  IRedditGalleryData
} from 'src/app/models/reddit.model'
import {Subject, fromEvent} from 'rxjs'
import {debounceTime, takeUntil} from 'rxjs/operators'
import {DeviceService} from 'src/services/device/device.service'

/**
 * Component for displaying a gallery of media items.
 * Leverages native scrolling for navigation.
 */
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  imports: [CommonModule],
  standalone: true
})
export class GalleryComponent implements AfterViewInit, OnDestroy {
  /**
   * The metadata for the media items in the gallery.
   */
  @Input()
  public metaData?: IRedditMediaMetadata = {}

  /**
   * The gallery data containing multiple items.
   */
  @Input()
  public galleryData?: IRedditGalleryData = {
    items: []
  }

  /**
   * The currently active slide index
   */
  public activeIndex = 0

  /**
   * A reference to the device service for checking if the device is mobile.
   */
  public isMobile = false

  /**
   * Subject to handle un-subscription on destroy
   */
  private destroy$ = new Subject<void>()

  /**
   * A reference to the scroll container element.
   * This is used to programmatically scroll the gallery.
   */
  @ViewChild('scrollContainer', {static: true})
  public scrollContainer!: ElementRef<HTMLDivElement>

  /**
   * @inheritdoc
   * @param cdr ChangeDetectorRef for change detection
   *
   */
  constructor(
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceService
  ) {
    this.isMobile = this.deviceService.isMobileDevice()
  }

  /**
   * Set up scroll event listener after view is initialized
   */
  public ngAfterViewInit(): void {
    if (this.scrollContainer) {
      /**
       * Listen for scroll events to update active index
       */
      fromEvent(this.scrollContainer.nativeElement, 'scroll')
        .pipe(debounceTime(50), takeUntil(this.destroy$))
        .subscribe(() => this.updateActiveIndex())
    }
  }

  /**
   * Clean up subscriptions
   */
  public ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  /**
   * Updates the active index based on current scroll position
   */
  private updateActiveIndex(): void {
    if (!this.scrollContainer || !this.galleryData?.items?.length) return

    const container = this.scrollContainer.nativeElement
    const itemWidth = container.offsetWidth
    const scrollPos = container.scrollLeft

    // Calculate the active index based on scroll position
    const newIndex = Math.round(scrollPos / itemWidth)

    if (
      newIndex >= 0 &&
      newIndex < this.galleryData.items.length &&
      newIndex !== this.activeIndex
    ) {
      this.activeIndex = newIndex
      this.cdr.detectChanges()
    }
  }

  /**
   * Scrolls the gallery to the next item.
   * This method calculates the scroll amount based on the container's width
   */
  public scrollNext(): void {
    const container = this.scrollContainer.nativeElement
    const scrollAmount = container.offsetWidth
    container.scrollBy({left: scrollAmount, behavior: 'smooth'})
  }

  /**
   * Scrolls the gallery to the previous item.
   * This method calculates the scroll amount based on the container's width
   */
  public scrollPrev(): void {
    const container = this.scrollContainer.nativeElement
    const scrollAmount = container.offsetWidth
    container.scrollBy({left: -scrollAmount, behavior: 'smooth'})
  }

  /**
   * Scroll to a specific item by index
   */
  public scrollToIndex(index: number): void {
    if (!this.scrollContainer) return

    const container = this.scrollContainer.nativeElement
    const scrollAmount = container.offsetWidth * index

    container.scrollTo({
      left: scrollAmount,
      behavior: 'smooth'
    })

    this.activeIndex = index
    this.cdr.detectChanges()
  }

  /**
   * Helper method to decode HTML entities in URLs
   */
  public getImageUrl(mediaId: string): string {
    if (
      !this.metaData ||
      !this.metaData[mediaId] ||
      !this.metaData[mediaId].s ||
      !this.metaData[mediaId].s.u
    ) {
      return ''
    }

    const url = this.metaData[mediaId].s.u
    return url.replace(/&amp;/g, '&')
  }

  /**
   * Get valid gallery items (ones with metadata)
   */
  public get validItems(): unknown[] {
    if (!this.galleryData?.items || !this.metaData) return []

    return this.galleryData.items.filter(
      item =>
        this.metaData &&
        this.metaData[item.media_id] &&
        this.metaData[item.media_id].s
    )
  }
}
