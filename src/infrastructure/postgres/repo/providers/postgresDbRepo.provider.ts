import { PostgresUserDbRepo } from "../postgresUserDb.repo";

export const PostgresUserDbRepoProvider = {
    provide: 'PostgresUserDbRepo',
    useClass: PostgresUserDbRepo
}