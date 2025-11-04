import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Subcontract } from './Subcontract';

@Entity('CSLBLicense')
export class CSLBLicense {
  @PrimaryGeneratedColumn()
  LicenseID: number;

  @Column({ unique: true, length: 50 })
  CSLBLicenseNumber: string;

  @Column({ length: 200 })
  ContractorName: string;

  @Column({ length: 200, nullable: true })
  BusinessName: string;

  @Column({ length: 100, nullable: true })
  LicenseType: string;

  @Column({ length: 50, nullable: true })
  Classification: string;

  @Column({ type: 'date', nullable: true })
  IssueDate: Date;

  @Column({ type: 'date', nullable: true })
  ExpirationDate: Date;

  @Column({ type: 'boolean', default: true })
  Active: boolean;

  @Column({ type: 'text', nullable: true })
  Address: string;

  @Column({ length: 100, nullable: true })
  City: string;

  @Column({ length: 2, nullable: true })
  State: string;

  @Column({ length: 10, nullable: true })
  ZipCode: string;

  @Column({ length: 20, nullable: true })
  Phone: string;

  @Column({ length: 100, nullable: true })
  Email: string;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  ModifiedDate: Date;

  @OneToMany(() => Subcontract, subcontract => subcontract.CSLBLicense)
  Subcontracts: Subcontract[];
}
