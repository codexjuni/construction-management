import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Contract } from './Contract';
import { Project } from './Project';
import { CSLBLicense } from './CSLBLicense';
import { LaborCompliance } from './LaborCompliance';
import { SubcontractInvoice } from './SubcontractInvoice';
import { SubcontractPayment } from './SubcontractPayment';

@Entity('Subcontract')
export class Subcontract {
  @PrimaryGeneratedColumn()
  SubcontractID: number;

  @Column()
  ContractID: number;

  @Column()
  ProjectID: number;

  @Column({ length: 50 })
  CSLBLicenseNumber: string;

  @Column({ unique: true, length: 50 })
  SubcontractNumber: string;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  SubcontractAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  AmountPaid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  RetentionAmount: number;

  @Column({ type: 'date', nullable: true })
  StartDate: Date;

  @Column({ type: 'date', nullable: true })
  EstimatedCompletionDate: Date;

  @Column({ type: 'date', nullable: true })
  ActualCompletionDate: Date;

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

  @ManyToOne(() => Contract, contract => contract.Subcontracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ContractID' })
  Contract: Contract;

  @ManyToOne(() => Project, project => project.Subcontracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ProjectID' })
  Project: Project;

  @ManyToOne(() => CSLBLicense, license => license.Subcontracts, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'CSLBLicenseNumber', referencedColumnName: 'CSLBLicenseNumber' })
  CSLBLicense: CSLBLicense;

  @OneToMany(() => LaborCompliance, compliance => compliance.Subcontract)
  LaborCompliances: LaborCompliance[];

  @OneToMany(() => SubcontractInvoice, invoice => invoice.Subcontract)
  Invoices: SubcontractInvoice[];

  @OneToMany(() => SubcontractPayment, payment => payment.Subcontract)
  Payments: SubcontractPayment[];
}
