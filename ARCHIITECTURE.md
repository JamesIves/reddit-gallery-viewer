# Architecture

## Overview

Reddit Gallery Viewer is a standalone Angular application that renders an infinite, media-focused feed from the Reddit API. The app is client-side only and uses reactive streams to drive UI updates.

## Technology Stack

- **Framework:** Angular 21 (standalone components, OnPush change detection)
- **State/Async:** RxJS (`BehaviorSubject`, `Observable`, stream composition)
- **UI/Styling:** Tailwind CSS + Angular CDK virtual scrolling
- **HTTP:** Angular `HttpClient` with a global loading interceptor
- **Testing:** Karma + Jasmine

## High-Level Structure

- `/src/main.ts` bootstraps `AppComponent`, registers HTTP client, and wires `LoaderInterceptorService`.
- `/src/app/app.component.*` composes the shell:
  - `NavbarComponent`
  - `SearchComponent`
  - `SafeModeComponent`
  - `FilterComponent`
  - `SearchResultsComponent`
- `/src/services/reddit/reddit.service.ts` is the core domain service and single source of query state.
- `/src/services/loader/*` manages loading state globally.
- `/src/services/device/device.service.ts` provides device capability detection used by media gallery UX.

## Data Flow

1. UI components update query controls (subreddit/user, filter, sub-filter, safe mode, page type).
2. `RedditService` stores each control in `BehaviorSubject`s.
3. `RedditService` combines these streams into a single `query$` pipeline:
   - triggers API fetches
   - filters unsupported/unsafe content
   - appends unique results for infinite scrolling
4. `SearchResultsComponent` subscribes to `query$` and renders results using `cdk-virtual-scroll-viewport`.
5. Scroll threshold events request the next page through `setSubRedditPage`.

## Rendering Model

- **Virtualized list:** only visible items are rendered for performance.
- **Media dispatch:** `MediaComponent` decides how to render each post:
  - image
  - Reddit-hosted video
  - external embed (YouTube/Twitch/other iframe)
  - gallery carousel via `GalleryComponent`
- **Responsive sizing:** result item height adapts to viewport breakpoints.

## Cross-Cutting Concerns

- **Loading state:** `LoaderInterceptorService` tracks active HTTP requests and toggles `LoaderService`.
- **Safe mode:** NSFW content is filtered by `RedditService` unless explicitly disabled.
- **Error handling:** request failures are converted to empty result sets to keep UI responsive.

## External Integration

- The app consumes the public Reddit JSON endpoints under `https://old.reddit.com/...json`.
- Query parameters are used for pagination and top-time filters (`after`, `limit`, `sort`, `t`).
