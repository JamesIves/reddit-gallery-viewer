/**
 * Contains all permutations of Reddit filtering options.
 */
export enum RedditFilter {
  HOT = 'hot',
  NEW = 'new',
  TOP = 'top',
  RISING = 'rising',
  ALL = 'all'
}

/**
 * Contains all permutations of Reddit sub filtering options.
 */
export enum RedditSubFilter {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all'
}

/**
 * Contains all of the request options for the Reddit API.
 */
export enum RedditRequestParameters {
  LIMIT = 'limit',
  AFTER = 'after',
  SORT = 'sort',
  TOP = 'top',
  T = 't'
}

/**
 * Contains the different post hint types from the Reddit API.
 * Used to identify content types which can be displayed or not.
 */
export enum RedditPostHint {
  LINK = 'link',
  IMAGE = 'image',
  RICH_VIDEO = 'rich:video'
}

/**
 * Contains the different page types from the Reddit API.
 */
export enum RedditPageType {
  SUBREDDIT = 'r',
  USER = 'user'
}

/**
 * Contains safe mode enable|disabled options.
 */
export enum SafeMode {
  ENABLED = 'enabled',
  DISABLED = 'disabled'
}

/**
 * Contains query results from the paginated API.
 */
export interface IRedditQuery {
  results: IRedditResult[]
  nextPage?: string
}

/**
 * Contains Reddit API request options.
 */
export interface IRedditRequestOptions {
  name: string
  filter: RedditFilter
  page?: string
  subFilter: RedditSubFilter
  safeMode: SafeMode
}

/**
 * Represents a single image resolution in media metadata.
 */
export interface IRedditImageResolution {
  /**
   * Height of the image
   */
  y: number

  /**
   * Width of the image
   */
  x: number

  /**
   * URL of the image
   */
  u: string
}

/**
 * Represents the media metadata for a single media item.
 */
export interface IRedditMediaMetadataItem {
  /**
   * Status of the media (e.g., "valid")
   */
  status: string

  /**
   * Type of the media (e.g., "Image")
   */
  e: string

  /**
   * MIME type of the media (e.g., "image/jpg")
   */
  m: string

  /**
   * Array of original resolutions
   */
  o: IRedditImageResolution[]

  /**
   * Array of preview resolutions
   */
  p: IRedditImageResolution[]

  /**
   * Source resolution
   */
  s: IRedditImageResolution

  /**
   * Unique ID of the media
   */
  id: string
}

/**
 * Represents the media metadata object containing multiple media items.
 */
export type IRedditMediaMetadata = Record<string, IRedditMediaMetadataItem>

/**
 * Represents a single item in the gallery data.
 */
export interface IRedditGalleryItem {
  /**
   * ID of the media item
   */
  media_id: string

  /**
   * Unique ID of the gallery item
   */
  id: number
}

/**
 * Represents the gallery data containing multiple items.
 */
export interface IRedditGalleryData {
  /**
   * Array of gallery items
   */
  items: IRedditGalleryItem[]
}

/**
 * Describes the content API response from Reddit.
 */
export interface IRedditResult {
  author: string
  url: string
  title: string
  id: string
  subreddit_type: 'user' | 'public'
  thumbnail?: string
  created_utc?: number
  is_gallery?: boolean

  /**
   * Media metadata for galleries
   */
  media_metadata?: IRedditMediaMetadata

  /**
   * Gallery data for posts with multiple images
   */
  gallery_data?: IRedditGalleryData

  /**
   * Content that is considered over_18 is usually NSFW.
   * This flag is used in the RedditService to filter our content
   * from the stream if safe mode is enabled.
   */
  over_18: boolean

  secure_media?: {
    oembed: {
      html: string
    }
  }

  secure_media_embed?: {
    media_domain_url: string
    content: string
  }

  preview?: {
    reddit_video_preview?: {
      fallback_url: string
    }
    images: {
      source: {
        url: string
        width: number
        height: number
      }
    }[]
  }

  post_hint: RedditPostHint
  subreddit: string
  num_comments: number
  ups?: number
  permalink: string
}

/**
 * Natural structure of data returned from Reddit API
 */
export interface IRedditResultNatural {
  data: {
    children: {
      data: IRedditResult
    }[]
  }
}
