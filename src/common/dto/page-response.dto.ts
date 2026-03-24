export class PageResponse<T> {
    page: number;
    size: number;
    total: number;
    items: T;

    static builder<T>() {
        return new ResponseBuilder<T>();
    }
}

class ResponseBuilder<T> {
    private response = new PageResponse<T>();

    page(page: number) {
        this.response.page = page;
    }

    size(size: number) {
        this.response.size = size;
    }

    total(total: number) {
        this.response.total = total;
    }

    items(items: T) {
        this.response.items = items;
    }

    build() {
        return this.response;
    }
}
