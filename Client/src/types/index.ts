export interface Run {
  id?: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  status: "failed" | "in progress" | "success";
  amount: number;
  is_notify: boolean;
}

export interface Screenshot {
  id?: number;
  run_id: number;
  url: string;
  is_error: boolean;
}

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  // iss: string;
  // azp: string;
  // aud: string;
  // sub: string;
  // email: string;
  // email_verified: boolean;
  // nbf: number;
  // name: string;
  // picture: string;
  // given_name: string;
  // family_name: string;
  // iat: number;
  // exp: number;
  // jti: string;
}
