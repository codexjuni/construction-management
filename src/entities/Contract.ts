import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client';
import { Project } from './Project';
import { Subcontract } from './Subcontract';

@Entity('Contract')
export class Contract {
  @PrimaryGeneratedColumn()
  ContractID: number;

  @Column({ unique: true, length: 50 })
  ContractNo: string;

  @Column()
  ClientID: number;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  ContractAmount: number;

  @Column({ length: 50 })
  ContractType: string;

  @Column({ type: 'date', nullable: true })
  StartDate: Date;

  @Column({ type: 'date', nullable: true })
  EndDate: Date;

  @Column({ type: 'date', nullable: true })
  SignedDate: Date;

  @Column({ length: 50, nullable: true })
  Status: string;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @ManyToOne(() => Client, client => client.Contracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ClientID' })
  Client: Client;

  @OneToMany(() => Project, project => project.Contract)
  Projects: Project[];

  @OneToMany(() => Subcontract, subcontract => subcontract.Contract)
  Subcontracts: Subcontract[];
}
