import { HttpException, HttpStatus } from "@nestjs/common";

export class ApplicationException extends HttpException {
  public readonly code: string;
  public readonly errorMsg: string;

  constructor(httpStatus: HttpStatus, restAPIStatus: { code: string; message: string }) {
    super(
      {
        status: restAPIStatus.code,
        error_msg: restAPIStatus.message,
      },
      httpStatus,
    );
    this.code = restAPIStatus.code;
    this.errorMsg = restAPIStatus.message;
  }
}
