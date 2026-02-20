import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Response {
    success<T>(data: T): void;
    error(message: string, statusCode?: number): void;
  }
}
