export interface I_BaseResponseAuth {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export interface I_ResponseLogin extends I_BaseResponseAuth {
  accessToken: string;
}
