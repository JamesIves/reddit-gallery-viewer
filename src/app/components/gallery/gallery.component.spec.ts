import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing'
import {DebugElement, ElementRef} from '@angular/core'
import {By} from '@angular/platform-browser'
import {GalleryComponent} from './gallery.component'
import {
  IRedditMediaMetadata,
  IRedditGalleryData
} from 'src/app/models/reddit.model'

describe('GalleryComponent', () => {
  let component: GalleryComponent
  let fixture: ComponentFixture<GalleryComponent>
  let debugElement: DebugElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(GalleryComponent)
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should render navigation buttons', () => {
    // Add gallery data to make buttons appear
    component.galleryData = {
      items: [
        {media_id: 'image1', id: 1},
        {media_id: 'image2', id: 2}
      ]
    }
    fixture.detectChanges()

    const prevButton = debugElement.query(
      By.css('button[aria-label="Previous Image"]')
    )
    const nextButton = debugElement.query(
      By.css('button[aria-label="Next Image"]')
    )

    expect(prevButton).toBeTruthy()
    expect(nextButton).toBeTruthy()
  })

  it('should not render images when no data is provided', () => {
    component.metaData = {} as IRedditMediaMetadata
    component.galleryData = undefined
    fixture.detectChanges()

    const images = debugElement.queryAll(By.css('img'))
    expect(images.length).toBe(0)
  })

  // Use waitForAsync to handle async rendering
  it('should render images when valid gallery data is provided', waitForAsync(() => {
    // Mock data
    const mockGalleryData: IRedditGalleryData = {
      items: [
        {media_id: 'image1', id: 1},
        {media_id: 'image2', id: 2}
      ]
    }

    const mockMetaData: IRedditMediaMetadata = {
      image1: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image1',
        s: {
          y: 100,
          x: 100,
          u: 'https://example.com/image1.jpg'
        },
        p: [],
        o: []
      },
      image2: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image2',
        s: {
          y: 100,
          x: 100,
          u: 'https://example.com/image2.jpg'
        },
        p: [],
        o: []
      }
    }

    component.galleryData = mockGalleryData
    component.metaData = mockMetaData

    // Use detectChanges after setting properties
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      // Log what's in the DOM for debugging
      console.log(
        'Gallery items:',
        debugElement.queryAll(By.css('[data-testid="gallery-item"]')).length
      )
      console.log(
        'Gallery images:',
        debugElement.queryAll(By.css('[data-testid="gallery-image"]')).length
      )

      const images = debugElement.queryAll(
        By.css('[data-testid="gallery-image"]')
      )
      expect(images.length).toBe(2)

      if (images.length >= 2) {
        expect(images[0].nativeElement.src).toContain(
          'https://example.com/image1.jpg'
        )
        expect(images[1].nativeElement.src).toContain(
          'https://example.com/image2.jpg'
        )
      }
    })
  }))

  it('should not render images with missing metadata', waitForAsync(() => {
    // Gallery data with IDs that don't exist in metadata
    const mockGalleryData: IRedditGalleryData = {
      items: [
        {media_id: 'image1', id: 1},
        {media_id: 'missing', id: 2}
      ]
    }

    const mockMetaData: IRedditMediaMetadata = {
      image1: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image1',
        s: {
          y: 100,
          x: 100,
          u: 'https://example.com/image1.jpg'
        },
        p: [],
        o: []
      }
    }

    component.galleryData = mockGalleryData
    component.metaData = mockMetaData
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      // Use the test id for more reliable selection
      const images = debugElement.queryAll(
        By.css('[data-testid="gallery-image"]')
      )
      expect(images.length).toBe(1) // Only the valid image
    })
  }))

  it('should call scrollNext method when next button is clicked', () => {
    spyOn(component, 'scrollNext')

    // Need to add gallery data to make button visible
    component.galleryData = {
      items: [
        {media_id: 'image1', id: 1},
        {media_id: 'image2', id: 2}
      ]
    }
    fixture.detectChanges()

    const nextButton = debugElement.query(
      By.css('button[aria-label="Next Image"]')
    )
    nextButton.nativeElement.click()

    expect(component.scrollNext).toHaveBeenCalled()
  })

  it('should call scrollPrev method when previous button is clicked', () => {
    spyOn(component, 'scrollPrev')

    // Setup gallery data
    component.galleryData = {
      items: [
        {media_id: 'image1', id: 1},
        {media_id: 'image2', id: 2}
      ]
    }

    // Set up metadata to match the items
    component.metaData = {
      image1: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image1',
        s: {y: 100, x: 100, u: 'https://example.com/image1.jpg'},
        p: [],
        o: []
      },
      image2: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image2',
        s: {y: 100, x: 100, u: 'https://example.com/image2.jpg'},
        p: [],
        o: []
      }
    }

    // Important: Set activeIndex to 1 so the previous button is enabled
    component.activeIndex = 1

    // Set up validItems if it's a getter
    spyOnProperty(component, 'validItems', 'get').and.returnValue([
      {media_id: 'image1', id: 1},
      {media_id: 'image2', id: 2}
    ])

    fixture.detectChanges()

    const prevButton = debugElement.query(
      By.css('button[aria-label="Previous Image"]')
    )

    expect(prevButton).toBeTruthy()
    expect(prevButton.nativeElement.disabled).toBeFalsy()

    prevButton.nativeElement.click()
    expect(component.scrollPrev).toHaveBeenCalled()
  })

  it('should scroll the container when scrollNext is called', () => {
    // Mock the scrollContainer
    component.scrollContainer = {
      nativeElement: {
        offsetWidth: 500,
        scrollBy: jasmine.createSpy('scrollBy')
      }
    } as unknown as ElementRef<HTMLDivElement>

    component.scrollNext()

    expect(component.scrollContainer.nativeElement.scrollBy).toHaveBeenCalled()
  })

  it('should scroll the container when scrollPrev is called', () => {
    // Mock the scrollContainer
    component.scrollContainer = {
      nativeElement: {
        offsetWidth: 500,
        scrollBy: jasmine.createSpy('scrollBy')
      }
    } as unknown as ElementRef<HTMLDivElement>

    component.scrollPrev()

    expect(component.scrollContainer.nativeElement.scrollBy).toHaveBeenCalled()
  })

  it('should not render images if only one of galleryData or metaData is provided', () => {
    // Only gallery data, no metadata
    component.galleryData = {
      items: [{media_id: 'image1', id: 1}]
    }
    component.metaData = {} as IRedditMediaMetadata
    fixture.detectChanges()

    const images = debugElement.queryAll(By.css('img'))
    expect(images.length).toBe(0)

    // Only metadata, no gallery data
    component.galleryData = undefined
    component.metaData = {
      image1: {
        status: 'valid',
        e: 'Image',
        m: 'image/jpg',
        id: 'image1',
        s: {y: 100, x: 100, u: 'https://example.com/image1.jpg'},
        p: [],
        o: []
      }
    }
    fixture.detectChanges()

    const imagesAfterUpdate = debugElement.queryAll(By.css('img'))
    expect(imagesAfterUpdate.length).toBe(0)
  })
})
