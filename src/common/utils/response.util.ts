export class ResponseUtil {
  static successResponse(data: any) {
    return {
      status: "success",
      data,
    };
  }
}
