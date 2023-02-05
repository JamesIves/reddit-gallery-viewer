import {Injectable} from '@angular/core'
import {BehaviorSubject, Observable, Subject} from 'rxjs'

/**
 * Service which is used to inform loading states when data
 * is requested from services such as {@see RedditService}.
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public readonly loading$: Subject<boolean> = new BehaviorSubject(false)

  /**
   * Informs loading$ when loading has started.
   */
  public start(): void {
    this.loading$.next(true)
  }

  /**
   * Informs loading$ when loading has stopped.
   */
  public stop(): void {
    this.loading$.next(false)
  }

  /**
   * Utility method to get loading$ as an observable for template subscription.
   */
  public getLoading(): Observable<boolean> {
    return this.loading$.asObservable()
  }
}
