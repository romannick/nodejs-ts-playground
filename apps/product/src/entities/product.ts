import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ unique: true, length: 256 })
  name!: string

  @Column({ length: 1024 })
  description!: string

  @Column('decimal', { precision: 4, scale: 2 })
  price!: number
}