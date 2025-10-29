import { container } from 'tsyringe'

import { AppDataSource } from './db/appDataSource'

container.register('AppDataSource', { useValue: AppDataSource })
