import {ChangeDetectionStrategy} from '@angular/core'
import {ComponentFixture, TestBed} from '@angular/core/testing'
import {HttpClientTestingModule} from '@angular/common/http/testing'
import {ClipboardModule} from '@angular/cdk/clipboard'
import {RedditPostHint} from 'src/app/models/reddit.model'
import {MediaComponent} from './media.component'
import {findEl} from 'src/app/util/spec'

describe('MediaComponent', () => {
  let component: MediaComponent
  let fixture: ComponentFixture<MediaComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MediaComponent,
        HttpClientTestingModule, // Mock HttpClient
        ClipboardModule // Mock Clipboard
      ]
    })
      .overrideComponent(MediaComponent, {
        set: {
          changeDetection: ChangeDetectionStrategy.Default
        }
      })
      .compileComponents()

    fixture = TestBed.createComponent(MediaComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('renders image content', () => {
    component.content = {
      id: '1337',
      over_18: false,
      title: 'Cool image',
      num_comments: 1337,
      subreddit: 'cats',
      subreddit_type: 'public',
      post_hint: RedditPostHint.IMAGE,
      permalink: '/r/cats/1337',
      author: 'not a real author',
      url: 'https://jamesiv.es/logo.gif',
      preview: {
        images: [
          {
            source: {
              url: 'https://jamesiv.es/logo.gif',
              width: 1337,
              height: 1337
            }
          }
        ]
      }
    }

    fixture.detectChanges()

    expect(findEl(fixture, 'media-image')).toBeTruthy()
  })

  it('renders video content', () => {
    component.content = {
      id: '1337',
      over_18: false,
      title: 'Cool video',
      num_comments: 1337,
      subreddit: 'cats',
      subreddit_type: 'public',
      post_hint: RedditPostHint.LINK,
      author: 'not a real author',
      url: 'https://jamesiv.es/logo.gif',
      permalink: '/r/cats/1337',
      preview: {
        images: [
          {
            source: {
              url: 'https://jamesiv.es/logo.gif',
              width: 1337,
              height: 1337
            }
          }
        ],
        reddit_video_preview: {
          fallback_url: 'https://jamesiv.es/logo.gif'
        }
      }
    }

    fixture.detectChanges()

    expect(findEl(fixture, 'media-video')).toBeTruthy()
  })

  it('renders iframe content', () => {
    component.content = {
      id: '1337',
      over_18: false,
      title: 'Cool iframe',
      num_comments: 1337,
      subreddit: 'cats',
      subreddit_type: 'public',
      post_hint: RedditPostHint.RICH_VIDEO,
      author: 'not a real author',
      permalink: '/r/cats/1337',
      secure_media_embed: {
        media_domain_url: 'https://jamesiv.es',
        content: 'https://jamesiv.es'
      },
      url: 'https://jamesiv.es/logo.gif',
      preview: {
        images: [
          {
            source: {
              url: 'https://jamesiv.es/logo.gif',
              width: 1337,
              height: 1337
            }
          }
        ],
        reddit_video_preview: {
          fallback_url: 'https://jamesiv.es/logo.gif'
        }
      }
    }

    fixture.detectChanges()

    expect(findEl(fixture, 'media-iframe')).toBeTruthy()
  })
})
