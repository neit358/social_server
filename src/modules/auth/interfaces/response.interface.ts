import { Role } from 'src/guards/role/role.enum';

export interface I_BaseResponseAuth {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: Role;
}

export interface I_ResponseLogin extends I_BaseResponseAuth {
  accessToken: string;
}
