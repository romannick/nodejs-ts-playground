import { DataSource } from 'typeorm'
import { MixedList } from 'typeorm/common/MixedList'
import { EntitySchema } from 'typeorm/entity-schema/EntitySchema'

export const createAppDataSource = (
  host: string,
  port: number,
  username: string,
  password: string,
  database: string,
  entities: MixedList<Function | string | EntitySchema>,
): DataSource =>
  new DataSource({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    synchronize: true, // dev only
    logging: false,
    entities,
  })
