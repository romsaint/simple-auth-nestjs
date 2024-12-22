import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/domain/user/entities/user.entity";
import { PostgresUserDbRepoProvider } from "./repo/providers/postgresDbRepo.provider";
import { CONFIG } from '../../config'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
        TypeOrmModule.forRoot({
            port: 5432,
            type: 'postgres',
            username: CONFIG.POSTGRE_NAME,
            password: CONFIG.POSTGRE_PASSWORD,
            host: CONFIG.ENVIRONMENT == 'dev' ? 'localhost' : CONFIG.POSTGRE_HOST,
            database: CONFIG.POSTGRE_DBNAME,
            entities: [User],
            synchronize: CONFIG.ENVIRONMENT === 'dev' ? true : false,
            logger: 'file',
            logging: true,
        }),
        TypeOrmModule.forFeature([User])
    ],
    providers: [PostgresUserDbRepoProvider],
    exports: [PostgresUserDbRepoProvider]
})

export class PostgreTypeOrmModule { }