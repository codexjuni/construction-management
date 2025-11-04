import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Import all entities
import { Client } from './entities/Client';
import { Contract } from './entities/Contract';
import { Project } from './entities/Project';
import { CSLBLicense } from './entities/CSLBLicense';
import { Subcontract } from './entities/Subcontract';
import { LaborCompliance } from './entities/LaborCompliance';
import { ProjectInvoice } from './entities/ProjectInvoice';
import { ProjectPayment } from './entities/ProjectPayment';
import { SubcontractInvoice } from './entities/SubcontractInvoice';
import { SubcontractPayment } from './entities/SubcontractPayment';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'construction_management',
  synchronize: false, // Set to false in production, use migrations instead
  logging: process.env.NODE_ENV === 'development',
  entities: [
    Client,
    Contract,
    Project,
    CSLBLicense,
    Subcontract,
    LaborCompliance,
    ProjectInvoice,
    ProjectPayment,
    SubcontractInvoice,
    SubcontractPayment,
  ],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
});
