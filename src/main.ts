import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "src/common/exception/AllException";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const httpAdapterHost = app.get(HttpAdapterHost);

    app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

    await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
