// angular stuff
import { User } from '@angular/fire/auth';

// models
import { IUserDataToLC } from '../../shared/models/auth.model';

export const formAuthLocalStorageObj = (user: User): IUserDataToLC => {
  const dataToLC: IUserDataToLC = {
    name: user.displayName!,
    email: user.email!,
    uid: user.uid,
    expireTime: new Date(
      new Date(user.metadata.lastSignInTime!).getTime() + 24 * 60 * 60 * 1000
    ).toUTCString(),
  };

  return dataToLC;
};
