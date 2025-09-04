export enum ResponseCodeEnum {
  // 2xx
  SUCCESS = 200,


  // 4xx
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NONE_SUBSCRIBED = 402,
  FORBIDDEN = 403,

  // 520
  CREDIT_NOT_INITED = 520,

  // 5xx
  NOT_IMPLEMENTED = 501,
}
