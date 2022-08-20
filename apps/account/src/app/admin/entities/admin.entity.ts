import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { IAbstractUser } from '@book/interfaces';
import { Exclude } from 'class-transformer';

@Entity('admins')
export class AdminEntity implements IAbstractUser {
  @PrimaryGeneratedColumn('uuid')
  id_admin: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ default: false })
  confirmEmail: boolean;

  @Column('jsonb', { nullable: true })
  passwordReset: { token: string; expiration: Date };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  upatedAt: Date;

  constructor(partial: Partial<AdminEntity>) {
    Object.assign(this, partial);
  }
}
