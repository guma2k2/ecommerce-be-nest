import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { ZodValidationException } from "nestjs-zod";
import { ZodError } from "zod";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const headersSent = typeof response?.headersSent !== "undefined" ? response.headersSent : false;

    if (headersSent) return;

    let message: any;
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception instanceof ZodValidationException) {
      const error = exception.getZodError();
      console.log(typeof error, error);
      if (error instanceof ZodError) {
        console.log("Zod error:", error.issues);
        message = {
          code: "bad_parameter",
          errorMsg: error.issues.map((err) => err.message).join(", "),
        };
      }
    } else if (exception instanceof HttpException) {
      message = exception.getResponse();
    } else {
      message = "Internal server error";
    }
    // console.error("Unhandled exception:", exception);
    httpAdapter.reply(response, message, status);
  }
}
