import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Project } from './Project';
import { ProjectPayment } from './ProjectPayment';

@Entity('ProjectInvoice')
export class ProjectInvoice {
  @PrimaryGeneratedColumn()
  InvoiceID: number;

  @Column()
  ProjectID: number;

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

  @ManyToOne(() => Project, project => project.Invoices, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ProjectID' })
  Project: Project;

  @OneToMany(() => ProjectPayment, payment => payment.Invoice)
  Payments: ProjectPayment[];
}
