// angular stuff
import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  where,
  query,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import { doc } from '@firebase/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

// utils
import { retrieveItemFromLC } from '../../shared/utils/localStorage.utils';

// models
import { IUserDataToLC } from '../../shared/models/auth.model';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private firestore = inject(Firestore);

  addToFavourites(
    type: 'photos' | 'videos',
    id: number
  ): Observable<string | null> {
    const userInLC: IUserDataToLC | null = retrieveItemFromLC('user');

    if (userInLC) {
      return from(
        addDoc(collection(this.firestore, 'users', userInLC.uid, type), {
          id,
        })
      ).pipe(map((value) => value.id));
    }

    return of(null);
  }

  deleteFromFavourites(
    type: 'photos' | 'videos',
    id: number
  ): Observable<boolean> {
    const userInLC: IUserDataToLC | null = retrieveItemFromLC('user');

    if (userInLC) {
      const q = query(
        collection(this.firestore, 'users', userInLC.uid, type),
        where('id', '==', id)
      );

      return from(getDocs(q)).pipe(
        switchMap((querySnapshot) => {
          if (!querySnapshot.empty) {
            const docSnapshot = querySnapshot.docs[0];

            return from(
              deleteDoc(
                doc(this.firestore, 'users', userInLC.uid, type, docSnapshot.id)
              )
            ).pipe(
              map(() => true),
              catchError(() => of(false))
            );
          } else {
            return of(false);
          }
        }),
        catchError(() => of(false))
      );
    }
    return of(false);
  }

  checkInFavourites(
    type: 'photos' | 'videos',
    id: number
  ): Observable<boolean> {
    const userInLC: IUserDataToLC | null = retrieveItemFromLC('user');
    if (userInLC) {
      const q = query(
        collection(this.firestore, 'users', userInLC.uid, type),
        where('id', '==', id)
      );

      const querySnapshot$ = from(getDocs(q));
      return querySnapshot$.pipe(map((res) => !!res.size));
    }

    return of(false);
  }

  getSubcollectionFromDB(type: 'photos' | 'videos'): Observable<number[]> {
    const userInLC: IUserDataToLC | null = retrieveItemFromLC('user');

    if (userInLC) {
      return from(
        getDocs(collection(this.firestore, 'users', userInLC.uid, type))
      ).pipe(
        switchMap((queryShapshot) => {
          let resultArray: Array<any> = [];

          queryShapshot.forEach((item) => {
            resultArray.push(Object.values(item.data())[0]);
          });

          return of(resultArray);
        }),
        catchError((error) => of([]))
      );
    } else {
      return of([]);
    }
  }
}
