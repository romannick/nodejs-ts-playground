import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { UserCredentials } from './userCredentials'

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true })
  email!: string

  @Column()
  name!: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role!: UserRole

  @OneToOne(() => UserCredentials, (credentials) => credentials.user, {
    cascade: true,
  })
  credentials!: UserCredentials
}