import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from './user'

@Entity()
export class UserCredentials {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  userId!: number;

  @Column()
  password!: string

  @Column()
  passwordSeed!: string

  @OneToOne(() => User, (user) => user.credentials, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user!: User;
}
