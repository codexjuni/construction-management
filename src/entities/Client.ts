import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from './Contract';

@Entity('Client')
export class Client {
  @PrimaryGeneratedColumn()
  ClientID: number;

  @Column({ unique: true, length: 50 })
  ClientNo: string;

  @Column({ length: 200 })
  ClientName: string;

  @Column({ length: 200, nullable: true })
  ContactPerson: string;

  @Column({ length: 100, nullable: true })
  Email: string;

  @Column({ length: 20, nullable: true })
  Phone: string;

  @Column({ type: 'text', nullable: true })
  Address: string;

  @Column({ length: 100, nullable: true })
  City: string;

  @Column({ length: 2, nullable: true })
  State: string;

  @Column({ length: 10, nullable: true })
  ZipCode: string;

  @Column({ type: 'boolean', default: true })
  Active: boolean;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @OneToMany(() => Contract, contract => contract.Client)
  Contracts: Contract[];
}
