/**
 * Contains all permutations of Reddit filtering options.
 */
export enum RedditFilter {
  HOT = 'hot',
  NEW = 'new',
  TOP = 'top',
  RISING = 'rising',
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
  ALL = 'all',
}

/**
 * Contains all of the request options for the Reddit API.
 */
export enum RedditRequestParameters {
  LIMIT = 'limit',
  AFTER = 'after',
  SORT = 'sort',
  TOP = 'top',
  T = 't',
}

/**
 * Contains the different post hint types from the Reddit API.
 * Used to identify content types which can be displayed or not.
 */
export enum RedditPostHint {
  LINK = 'link',
  IMAGE = 'image',
  RICH_VIDEO = 'rich:video',
}

/**
 * Contains safe mode enable|disabled options.
 */
export enum SafeMode {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

/**
 * Contains query results from the paginated API.
 */
export interface IRedditQuery {
  results: IRedditResult[];
  nextPage?: string;
}

/**
 * Contains Reddit API request options.
 */
export interface IRedditRequestOptions {
  name: string;
  filter: RedditFilter;
  page?: string;
  subFilter: RedditSubFilter;
  safeMode: SafeMode;
}

/**
 * Describes the content API response from Reddit.
 */
export interface IRedditResult {
  author: string;
  url: string;
  id: string;
  over_18: boolean;
  preview?: {
    reddit_video_preview?: {
      fallback_url: string;
    };
    images: {
      source: {
        url: string;
        width: number;
        height: number;
      };
    }[];
  };
  post_hint: RedditPostHint;
  subreddit: string;
}

export interface IRedditResultNatural {
  data: {
    children: {
      data: IRedditResult;
    }[];
  };
}
