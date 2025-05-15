const ResponseResult = {
  success: (data: unknown, code = 200, message = "success") => {
    return {
      code,
      data,
      message,
    };
  },
  fail: (data: unknown, code = 500, message = "fail") => {
    if (typeof data === "string") {
      return {
        code,
        data: null,
        message: data,
      };
    }
    return { code, data, message };
  },
};

export default ResponseResult;

export interface ResponseResultType<T> {
  code: number;
  data: T;
  message: string;
}
