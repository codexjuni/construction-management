import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from './Contract';
import { Subcontract } from './Subcontract';
import { ProjectInvoice } from './ProjectInvoice';
import { ProjectPayment } from './ProjectPayment';

@Entity('Project')
export class Project {
  @PrimaryGeneratedColumn()
  ProjectID: number;

  @Column()
  ContractId: number;

  @Column({ unique: true, length: 50 })
  ProjectNumber: string;

  @Column({ length: 200 })
  ProjectName: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  ProjectAmt: number;

  @Column({ type: 'text', nullable: true })
  ProjectAddress: string;

  @Column({ length: 100, nullable: true })
  City: string;

  @Column({ length: 2, nullable: true })
  State: string;

  @Column({ length: 10, nullable: true })
  ZipCode: string;

  @Column({ type: 'date', nullable: true })
  StartDate: Date;

  @Column({ type: 'date', nullable: true })
  EstimatedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  ActualCompletionDate: Date;

  @Column({ length: 50, nullable: true })
  Status: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @ManyToOne(() => Contract, contract => contract.Projects, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ContractId' })
  Contract: Contract;

  @OneToMany(() => Subcontract, subcontract => subcontract.Project)
  Subcontracts: Subcontract[];

  @OneToMany(() => ProjectInvoice, invoice => invoice.Project)
  Invoices: ProjectInvoice[];

  @OneToMany(() => ProjectPayment, payment => payment.Project)
  Payments: ProjectPayment[];
}
