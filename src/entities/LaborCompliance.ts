import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subcontract } from './Subcontract';

@Entity('LaborCompliance')
export class LaborCompliance {
  @PrimaryGeneratedColumn()
  ComplianceID: number;

  @Column()
  SubcontractID: number;

  @Column({ type: 'date' })
  ReportingPeriodStart: Date;

  @Column({ type: 'date' })
  ReportingPeriodEnd: Date;

  @Column({ type: 'date', nullable: true })
  SubmissionDate: Date;

  @Column({ length: 50 })
  ComplianceType: string;

  @Column({ length: 50, nullable: true })
  Status: string;

  @Column({ type: 'boolean', default: false })
  CertifiedPayrollSubmitted: boolean;

  @Column({ type: 'boolean', default: false })
  PrevailingWageCompliant: boolean;

  @Column({ type: 'boolean', default: false })
  ApprenticeshipCompliant: boolean;

  @Column({ type: 'text', nullable: true })
  Notes: string;

  @Column({ length: 200, nullable: true })
  ReviewedBy: string;

  @Column({ type: 'date', nullable: true })
  ReviewDate: Date;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @ManyToOne(() => Subcontract, subcontract => subcontract.LaborCompliances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'SubcontractID' })
  Subcontract: Subcontract;
}
