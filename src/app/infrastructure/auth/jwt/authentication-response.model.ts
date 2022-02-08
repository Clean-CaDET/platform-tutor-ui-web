export class AuthenticationResponse {
  id: number;
  accessToken: string;
  refreshToken: string;

  constructor(obj?: any) {
    if (obj) {
      this.id = obj.id;
      this.accessToken = obj.accessToken;
      this.refreshToken = obj.redirectUri;
    }
  }
}
