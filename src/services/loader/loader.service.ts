import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

/**
 * Service which is used to inform loading states when data
 * is requested from services such as {@see RedditService}.
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public readonly loading$: Subject<boolean> = new BehaviorSubject(false);

  public start(): void {
    console.log('-LOADING STARTED');
    this.loading$.next(true);
  }

  public stop(): void {
    console.log('-LOADING STOPPED');
    this.loading$.next(false);
  }

  public getLoading(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
