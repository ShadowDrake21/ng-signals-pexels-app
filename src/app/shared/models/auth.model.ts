export interface IAuthentication {
  name?: string;
  email: string;
  password: string;
}

export interface IUserDataToLC {
  name: string;
  email: string;
  uid: string;
  expireTime: string;
}
