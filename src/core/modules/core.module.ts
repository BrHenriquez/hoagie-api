import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "../config/configuration";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { TransformInterceptor } from "../interceptors/transform.interceptor";
import { ValidationPipe } from "../pipes/validation.pipe";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ".env",
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [ConfigModule],
})
export class CoreModule {}
