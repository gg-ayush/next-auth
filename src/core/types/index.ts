import { User } from "@prisma/client";

const responseStatus = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  203: "Non-Authoritative Information",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  402: "Payment Required",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  406: "Not Acceptable",
  408: "Request Timeout",
  410: "Gone",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
} as const;

const reason = {
  REQUIRED: "The requested resource is required",
  NOT_AVAILABLE: "The requested resource is not available",
  EXPIRED: "The requested resource is expired",
} as const;

type ResponseStatus = typeof responseStatus;
type ResponseCode = keyof ResponseStatus;

type ErrorType = keyof typeof reason;

export type ResponseError = {
  success: false;
  error: {
    code: ResponseCode;
    type?: ErrorType;
    message: string;
  };
};

export type ResponseWithMessage =
  | {
      twoFactor?: any;
      success: true;
      code: ResponseCode;
      message: string;
    }
  | ResponseError;

export type ResponseSuccess<T> =
  | {
      success: true;
      code: ResponseCode;
      message?: string;
      data: T;
    }
  | ResponseError;

export type Response<T = boolean> = T extends object
  ? ResponseSuccess<T>
  : ResponseWithMessage;


export interface ApplicationUser {
  id: string;
  user_id: string;
  application_id: string;
  created_at: Date;
  updated_at: Date;
  user: Pick<User, 'gg_id' | 'username' | 'first_name' | 'last_name' | 'email' | 'phone_number' | 'created_at' | 'updated_at'>;
}
  
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
  