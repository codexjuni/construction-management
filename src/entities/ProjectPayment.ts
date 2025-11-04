import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project';
import { ProjectInvoice } from './ProjectInvoice';

@Entity('ProjectPayment')
export class ProjectPayment {
  @PrimaryGeneratedColumn()
  PaymentID: number;

  @Column()
  ProjectID: number;

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

  @ManyToOne(() => Project, project => project.Payments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ProjectID' })
  Project: Project;

  @ManyToOne(() => ProjectInvoice, invoice => invoice.Payments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'InvoiceID' })
  Invoice: ProjectInvoice;
}
