import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subcontract } from './Subcontract';
import { SubcontractInvoice } from './SubcontractInvoice';

@Entity('SubcontractPayment')
export class SubcontractPayment {
  @PrimaryGeneratedColumn()
  PaymentID: number;

  @Column()
  SubcontractID: number;

  @Column({ nullable: true })
  InvoiceID: number;

  @Column({ length: 50, nullable: true })
  PaymentNumber: string;

  @Column({ type: 'date' })
  PaymentDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  PaymentAmount: number;

  @Column({ length: 50 })
  PaymentMethod: string;

  @Column({ length: 100, nullable: true })
  CheckNumber: string;

  @Column({ length: 100, nullable: true })
  ReferenceNumber: string;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @ManyToOne(() => Subcontract, subcontract => subcontract.Payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'SubcontractID' })
  Subcontract: Subcontract;

  @ManyToOne(() => SubcontractInvoice, invoice => invoice.Payments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'InvoiceID' })
  Invoice: SubcontractInvoice;
}
