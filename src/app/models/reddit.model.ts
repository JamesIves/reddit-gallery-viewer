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
  items?: IRedditGalleryItem[]
}

/**
 * Describes the content API response from Reddit.
 */
export interface IRedditResult {
  domain?: string
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

  /**
   * Contains secure media embed information including oembed data
   */
  secure_media?: {
    /**
     * Oembed data containing HTML embed code
     */
    oembed: {
      /**
       * HTML embed code provided by the platform
       */
      html: string
      /**
       * Provider URL (e.g., youtube.com)
       */
      provider_url?: string
      /**
       * Title of the embedded content
       */
      title?: string
      /**
       * Width of thumbnail
       */
      thumbnail_width?: number
      /**
       * Height of the embedded content
       */
      height?: number
      /**
       * Width of the embedded content
       */
      width?: number
      /**
       * Version of the oembed specification
       */
      version?: string
      /**
       * Author name
       */
      author_name?: string
      /**
       * Provider name (e.g., YouTube)
       */
      provider_name?: string
      /**
       * Thumbnail URL
       */
      thumbnail_url?: string
      /**
       * Type of the content (e.g., video)
       */
      type?: string
      /**
       * Thumbnail height
       */
      thumbnail_height?: number
      /**
       * Author URL
       */
      author_url?: string
    }
    /**
     * Type of the secure media (e.g., 'youtube.com')
     */
    type?: string
  }

  /**
   * Contains secure media embed information
   */
  secure_media_embed?: {
    /**
     * URL for the media domain
     */
    media_domain_url: string
    /**
     * HTML content of the embed
     */
    content: string
    /**
     * Width of the embed
     */
    width?: number
    /**
     * Whether scrolling is enabled
     */
    scrolling?: boolean
    /**
     * Height of the embed
     */
    height?: number
  }

  /**
   * Contains preview information
   */
  preview?: {
    /**
     * Reddit video preview information
     */
    reddit_video_preview?: {
      /**
       * Fallback URL for the video
       */
      fallback_url: string
      /**
       * Whether the video has audio
       */
      has_audio?: boolean
      /**
       * Height of the video
       */
      height?: number
      /**
       * Width of the video
       */
      width?: number
      /**
       * Duration of the video in seconds
       */
      duration?: number
    }
    /**
     * Preview images
     */
    images: {
      /**
       * Source image information
       */
      source: {
        /**
         * URL of the image
         */
        url: string
        /**
         * Width of the image
         */
        width: number
        /**
         * Height of the image
         */
        height: number
      }
      /**
       * Image resolutions
       */
      resolutions?: {
        /**
         * URL of the resolution
         */
        url: string
        /**
         * Width of the resolution
         */
        width: number
        /**
         * Height of the resolution
         */
        height: number
      }[]
      /**
       * Image variants
       */
      variants?: Record<string, unknown>
      /**
       * ID of the image
       */
      id?: string
    }[]
    /**
     * Whether preview is enabled
     */
    enabled?: boolean
  }

  /**
   * Complete media object that includes oembed data
   */
  media?: {
    /**
     * Oembed data
     */
    oembed: {
      /**
       * HTML embed code
       */
      html: string
      /**
       * Provider URL
       */
      provider_url?: string
      /**
       * Title of the content
       */
      title?: string
      /**
       * Width of thumbnail
       */
      thumbnail_width?: number
      /**
       * Height of the embed
       */
      height?: number
      /**
       * Width of the embed
       */
      width?: number
      /**
       * Version of oembed
       */
      version?: string
      /**
       * Author name
       */
      author_name?: string
      /**
       * Provider name
       */
      provider_name?: string
      /**
       * Thumbnail URL
       */
      thumbnail_url?: string
      /**
       * Type of content
       */
      type?: string
      /**
       * Thumbnail height
       */
      thumbnail_height?: number
      /**
       * Author URL
       */
      author_url?: string
    }
    /**
     * Type of media (e.g., 'youtube.com')
     */
    type?: string
  }

  /**
   * Hint about the type of post
   */
  post_hint: RedditPostHint

  /**
   * Name of the subreddit
   */
  subreddit: string

  /**
   * Number of comments
   */
  num_comments: number

  /**
   * Number of upvotes
   */
  ups?: number

  /**
   * Permalink to the post
   */
  permalink: string

  /**
   * Whether the post is a video
   */
  is_video?: boolean

  /**
   * Media embed information
   */
  media_embed?: {
    /**
     * HTML content of the embed
     */
    content?: string
    /**
     * Width of the embed
     */
    width?: number
    /**
     * Whether scrolling is enabled
     */
    scrolling?: boolean
    /**
     * Height of the embed
     */
    height?: number
  }
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

/**
 * Video platform types
 */
export enum VideoPlatform {
  YOUTUBE = 'youtube',
  TWITCH = 'twitch',
  OTHER = 'other'
}
