import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subcontract } from './Subcontract';
import { SubcontractPayment } from './SubcontractPayment';

@Entity('SubcontractInvoice')
export class SubcontractInvoice {
  @PrimaryGeneratedColumn()
  InvoiceID: number;

  @Column()
  SubcontractID: number;

  @Column({ unique: true, length: 50 })
  InvoiceNumber: string;

  @Column({ type: 'date' })
  InvoiceDate: Date;

  @Column({ type: 'date', nullable: true })
  DueDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  InvoiceAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  AmountPaid: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  RetentionAmount: number;

  @Column({ type: 'text', nullable: true })
  Description: string;

  @Column({ length: 50, nullable: true })
  Status: string;

  @Column({ type: 'date', nullable: true })
  PaidDate: Date;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @ManyToOne(() => Subcontract, subcontract => subcontract.Invoices, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'SubcontractID' })
  Subcontract: Subcontract;

  @OneToMany(() => SubcontractPayment, payment => payment.Invoice)
  Payments: SubcontractPayment[];
}
