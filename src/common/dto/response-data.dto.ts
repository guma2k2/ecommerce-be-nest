export class ResponseData<T> {
    constructor(
        public status: string,
        public data: T,
    ) {}

    static success<T>(data: T) {
        return new ResponseData("success", data);
    }
}
