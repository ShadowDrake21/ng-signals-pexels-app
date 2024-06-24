import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
  User,
  user,
  UserCredential,
} from '@angular/fire/auth';
import { IAuthentication, IUserDataToLC } from '../../shared/models/auth.model';
import {
  catchError,
  from,
  map,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { setItemInLC } from '../../shared/utils/localStorage.utils';
import { DEFAULT_USER_IMG } from '../constants/firebase.constants';
import { formAuthLocalStorageObj } from '../utils/auth.utils';
import { FirebaseError } from '@angular/fire/app';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private auth = inject(Auth);

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
      tap(({ user }) => setItemInLC('user', formAuthLocalStorageObj(user))),
      catchError((error) => throwError(() => error))
    );
  }
}
