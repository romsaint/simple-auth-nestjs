import { Module } from '@nestjs/common';
import { services } from './api/services';
import { controllers } from './api/controllers';
import { DomainModule } from './domain/domain.module';


@Module({
  imports: [
    DomainModule
  ],
  controllers: [...controllers],
})

export class AppModule {}