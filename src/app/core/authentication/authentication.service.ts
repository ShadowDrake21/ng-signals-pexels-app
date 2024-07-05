// angular stuff
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
} from '@angular/fire/auth';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { FirebaseError } from '@angular/fire/app';

// utils
import {
  removeItemFromLC,
  retrieveItemFromLC,
  setItemInLC,
} from '../../shared/utils/localStorage.utils';
import { formAuthLocalStorageObj } from '../utils/auth.utils';

// models
import { IAuthentication } from '../../shared/models/auth.model';

// constants
import { DEFAULT_USER_IMG } from '../constants/firebase.constants';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private auth = inject(Auth);
  isUserAuth = new BehaviorSubject<boolean>(false);

  constructor() {
    this.setupAuthListener();
  }

  private setupAuthListener() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.isUserAuth.next(true);
        setItemInLC('user', formAuthLocalStorageObj(user));
      } else {
        this.isUserAuth.next(false);
        removeItemFromLC('user');
      }
    });
  }

  signUp(data: IAuthentication): Observable<UserCredential> {
    return from(
      createUserWithEmailAndPassword(this.auth, data.email, data.password)
    ).pipe(
      switchMap((userCredential) => {
        if (this.auth.currentUser) {
          return from(
            updateProfile(this.auth.currentUser, {
              displayName: data.name,
              photoURL: DEFAULT_USER_IMG,
            })
          ).pipe(
            tap(() => {
              const updatedUser = {
                ...this.auth.currentUser,
                displayName: data.name!,
              };
              setItemInLC('user', formAuthLocalStorageObj(updatedUser as User));
              this.isUserAuth.next(true);
            }),
            map(() => userCredential)
          );
        } else {
          return throwError(
            () => new Error('Error after sign up: user is not authenticated.')
          );
        }
      }),
      catchError((error: FirebaseError) => throwError(() => error))
    );
  }

  signIn(data: IAuthentication): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, data.email, data.password)
    ).pipe(
      tap(({ user }) => {
        setItemInLC('user', formAuthLocalStorageObj(user));
        this.isUserAuth.next(true);
      }),
      catchError((error) => throwError(() => error))
    );
  }

  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        this.isUserAuth.next(false);
        removeItemFromLC('user');
      })
    );
  }
}
