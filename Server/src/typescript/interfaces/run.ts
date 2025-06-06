export interface IRun {
  id?: number;
  user_id: number;
  created_at: Date;
  updated_at: Date;
  status: "failed" | "in progress" | "success";
  amount: number;
  is_notify: boolean;
}

export interface IScreenshot {
  id?: number;
  run_id: number;
  url: string;
  is_error: boolean;
}
