export interface IRun {
  id?: number;
  user_id: string;
  created_at?: Date;
  updated_at?: Date;
  status: "failed" | "in progress" | "success";
  stage:
    | "triggered"
    | "refreshing tokens"
    | "buying gift"
    | "getting code from mail"
    | "applying gift"
    | "done";
  amount: number;
  is_notify: boolean;
}

export interface IScreenshot {
  id?: number;
  run_id: number;
  url: string;
  is_error: boolean;
}
