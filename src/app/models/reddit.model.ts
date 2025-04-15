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
  pageType: RedditPageType
}

/**
 * Describes the content API response from Reddit.
 */
export interface IRedditResult {
  author: string
  url: string
  title: string
  id: string
  thumbnail?: string
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
  permalink: string
}

export interface IRedditResultNatural {
  data: {
    children: {
      data: IRedditResult
    }[]
  }
}
