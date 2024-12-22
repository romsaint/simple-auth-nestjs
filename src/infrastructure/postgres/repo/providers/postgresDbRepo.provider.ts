import { PostgresUserDbRepo } from "../postgresDb.repo";

export const PostgresUserDbRepoProvider = {
    provide: 'PostgresUserDbRepo',
    useClass: PostgresUserDbRepo
}