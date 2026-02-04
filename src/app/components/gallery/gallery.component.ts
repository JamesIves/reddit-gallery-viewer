import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  SimpleChanges,
  OnChanges,
  inject
} from '@angular/core'
import {
  IRedditMediaMetadata,
  IRedditGalleryData,
  IRedditGalleryItem
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
  imports: [],
  standalone: true
})
export class GalleryComponent implements AfterViewInit, OnDestroy, OnChanges {
  /**
   * Injected ChangeDetectorRef for manually triggering change detection when needed.
   */
  private cdr = inject(ChangeDetectorRef)

  /**
   * Injected DeviceService for checking if the device is mobile.
   */
  private deviceService = inject(DeviceService)

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
   * Flags to indicate if the gallery is transitioning.
   * This is used to prevent visual jank during scroll events.
   */
  private isTransitioning = false

  /**
   * The duration of the transition effect in milliseconds.
   */
  private readonly transitionDuration = 200

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
   */
  constructor() {
    this.isMobile = this.deviceService.isMobileDevice()
  }

  /**
   * Set up scroll event listener after view is initialized
   */
  public ngAfterViewInit(): void {
    /**
     * Force scroll to start position and set active index
     */
    this.activeIndex = 0

    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.scrollLeft = 0

      /**
       * Listen for scroll events
       */
      fromEvent(this.scrollContainer.nativeElement, 'scroll')
        .pipe(debounceTime(50), takeUntil(this.destroy$))
        .subscribe(() => this.updateActiveIndex())

      /**
       * Set a timeout to ensure the scroll position is set correctly
       */
      setTimeout(() => {
        this.updateActiveIndex()
        this.cdr.detectChanges()
      }, 50)
    }
  }

  /**
   * If gallery data or metadata changes, reset the gallery
   */
  public ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['galleryData'] || changes['metaData']) &&
      this.scrollContainer
    ) {
      this.activeIndex = 0

      /**
       * Schedule a micro-task to ensure DOM has updated
       */
      Promise.resolve().then(() => {
        if (this.scrollContainer?.nativeElement) {
          this.scrollContainer.nativeElement.scrollLeft = 0
          this.cdr.detectChanges()
        }
      })
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
    if (!this.scrollContainer?.nativeElement || !this.validItems.length) return

    const container = this.scrollContainer.nativeElement
    const itemWidth = container.offsetWidth
    const scrollPos = container.scrollLeft

    /**
     * More precise calculation with clamp to valid range
     */
    const calculatedIndex = Math.round(scrollPos / itemWidth)
    const newIndex = Math.max(
      0,
      Math.min(calculatedIndex, this.validItems.length - 1)
    )

    if (newIndex !== this.activeIndex) {
      this.activeIndex = newIndex
      this.cdr.detectChanges()
    }
  }

  /**
   * Scrolls the gallery to the next item.
   * This method calculates the scroll amount based on the container's width
   */
  public scrollNext(): void {
    if (this.isTransitioning) return
    this.isTransitioning = true

    const container = this.scrollContainer.nativeElement
    const scrollAmount = container.offsetWidth
    container.scrollBy({left: scrollAmount, behavior: 'smooth'})

    setTimeout(() => {
      this.isTransitioning = false
    }, this.transitionDuration)
  }

  /**
   * Scrolls the gallery to the previous item.
   * This method calculates the scroll amount based on the container's width
   */
  public scrollPrev(): void {
    if (this.isTransitioning) return
    this.isTransitioning = true

    const container = this.scrollContainer.nativeElement
    const scrollAmount = container.offsetWidth
    container.scrollBy({left: -scrollAmount, behavior: 'smooth'})

    setTimeout(() => {
      this.isTransitioning = false
    }, this.transitionDuration)
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
  public get validItems(): IRedditGalleryItem[] {
    if (!this.galleryData?.items || !this.metaData) return []

    return this.galleryData.items.filter(
      item =>
        this.metaData &&
        this.metaData[item.media_id] &&
        this.metaData[item.media_id].s
    )
  }
}
