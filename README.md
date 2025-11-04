# Construction Management System

A modern construction management system built with Node.js, TypeScript, and PostgreSQL, designed to migrate and enhance data from Microsoft Access databases.

## Database Schema

This system implements a comprehensive construction management schema with the following tables and relationships:

### Core Entities

#### 1. Client
- **Primary Key**: ClientID
- **Unique Fields**: ClientNo
- **Purpose**: Stores client/customer information
- **Key Fields**: ClientName, ContactPerson, Email, Phone, Address

#### 2. Contract
- **Primary Key**: ContractID
- **Foreign Keys**: ClientID → Client
- **Unique Fields**: ContractNo
- **Purpose**: Manages contracts with clients
- **Key Fields**: ContractAmount, ContractType, Description, Status
- **Relationships**: One Client has many Contracts

#### 3. Project
- **Primary Key**: ProjectID
- **Foreign Keys**: ContractId → Contract
- **Unique Fields**: ProjectNumber
- **Purpose**: Tracks individual projects under contracts
- **Key Fields**: ProjectName, ProjectAmt, ProjectAddress, Dates
- **Relationships**: One Contract has many Projects

#### 4. CSLBLicense
- **Primary Key**: LicenseID
- **Unique Fields**: CSLBLicenseNumber
- **Purpose**: Stores California State License Board contractor license information
- **Key Fields**: ContractorName, BusinessName, LicenseType, ExpirationDate

#### 5. Subcontract
- **Primary Key**: SubcontractID
- **Foreign Keys**:
  - ContractID → Contract
  - ProjectID → Project
  - CSLBLicenseNumber → CSLBLicense
- **Unique Fields**: SubcontractNumber
- **Purpose**: Manages subcontractor agreements
- **Key Fields**: SubcontractAmount, AmountPaid, RetentionAmount, Status
- **Relationships**:
  - Belongs to one Contract
  - Belongs to one Project
  - References one CSLBLicense

#### 6. LaborCompliance
- **Primary Key**: ComplianceID
- **Foreign Keys**: SubcontractID → Subcontract (CASCADE DELETE)
- **Purpose**: Tracks labor compliance requirements per subcontract
- **Key Fields**: ReportingPeriod, ComplianceType, CertifiedPayrollSubmitted, PrevailingWageCompliant

### Financial Entities

#### 7. ProjectInvoice
- **Primary Key**: InvoiceID
- **Foreign Keys**: ProjectID → Project
- **Unique Fields**: InvoiceNumber
- **Purpose**: Invoices issued for project work
- **Key Fields**: InvoiceAmount, AmountPaid, RetentionAmount, Status

#### 8. ProjectPayment
- **Primary Key**: PaymentID
- **Foreign Keys**:
  - ProjectID → Project
  - InvoiceID → ProjectInvoice (optional)
- **Purpose**: Payments received for projects
- **Key Fields**: PaymentAmount, PaymentMethod, PaymentDate, CheckNumber

#### 9. SubcontractInvoice
- **Primary Key**: InvoiceID
- **Foreign Keys**: SubcontractID → Subcontract
- **Unique Fields**: InvoiceNumber
- **Purpose**: Invoices from subcontractors
- **Key Fields**: InvoiceAmount, AmountPaid, RetentionAmount, Status

#### 10. SubcontractPayment
- **Primary Key**: PaymentID
- **Foreign Keys**:
  - SubcontractID → Subcontract
  - InvoiceID → SubcontractInvoice (optional)
- **Purpose**: Payments made to subcontractors
- **Key Fields**: PaymentAmount, PaymentMethod, PaymentDate, CheckNumber

## Entity Relationship Diagram

```
Client (1) ──────< (N) Contract (1) ──────< (N) Project
                         │                        │
                         │                        │
                         └────< (N) Subcontract <─┘
                                     │
                                     │ (N)
                                     ├──────< LaborCompliance
                                     │
                                     ├──────< SubcontractInvoice ──────< SubcontractPayment
                                     │
                                     └────> (1) CSLBLicense

                         Project (1) ──────< (N) ProjectInvoice ──────< (N) ProjectPayment
                                 │
                                 └──────< (N) ProjectPayment
```

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM with decorators
- **Migration**: TypeORM migrations

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd construction-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your database connection:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=construction_management
PORT=3000
NODE_ENV=development
```

4. Create the PostgreSQL database:
```bash
psql -U postgres
CREATE DATABASE construction_management;
\q
```

5. Run migrations to create tables:
```bash
npm run migration:run
```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
npm start
```

## Database Operations

### Running Migrations
```bash
npm run migration:run
```

### Reverting Migrations
```bash
npm run migration:revert
```

### Generating New Migrations
After modifying entities, generate a new migration:
```bash
npm run migration:generate -- src/migrations/MigrationName
```

### Schema Sync (Development Only)
```bash
npm run schema:sync
```

**Warning**: `schema:sync` should only be used in development. Use migrations in production.

## API Endpoints

### Health Check
- `GET /health` - Check if the API is running

### Database Info
- `GET /api/info` - Get database connection and entity information

### Entities
- `GET /api/clients` - List all clients
- `GET /api/contracts` - List all contracts with client information
- `GET /api/projects` - List all projects with contract and client information

## Migrating from Access Database

To migrate data from your existing Access database:

1. Export data from Access to CSV files for each table
2. Create a data import script using TypeORM repositories
3. Import data in the correct order to maintain referential integrity:
   - Client
   - Contract
   - Project
   - CSLBLicense
   - Subcontract
   - LaborCompliance
   - ProjectInvoice
   - SubcontractInvoice
   - ProjectPayment
   - SubcontractPayment

Example import script structure:
```typescript
import { AppDataSource } from './data-source';
import { Client } from './entities/Client';

async function importClients() {
  const clientRepo = AppDataSource.getRepository(Client);
  // Read CSV and insert data
  await clientRepo.save(clientData);
}
```

## Foreign Key Constraints

The schema implements the following referential integrity rules:

- **RESTRICT**: Prevents deletion if related records exist
  - Client → Contract
  - Contract → Project
  - Contract → Subcontract
  - Project → Subcontract
  - CSLBLicense → Subcontract
  - Project → ProjectInvoice
  - Subcontract → SubcontractInvoice

- **CASCADE**: Automatically deletes related records
  - Subcontract → LaborCompliance

- **SET NULL**: Sets foreign key to NULL when parent is deleted
  - ProjectInvoice → ProjectPayment
  - SubcontractInvoice → SubcontractPayment

## Project Structure

```
construction-management/
├── src/
│   ├── entities/          # TypeORM entity definitions
│   │   ├── Client.ts
│   │   ├── Contract.ts
│   │   ├── Project.ts
│   │   ├── CSLBLicense.ts
│   │   ├── Subcontract.ts
│   │   ├── LaborCompliance.ts
│   │   ├── ProjectInvoice.ts
│   │   ├── ProjectPayment.ts
│   │   ├── SubcontractInvoice.ts
│   │   └── SubcontractPayment.ts
│   ├── migrations/        # Database migration files
│   │   └── 1730736000000-InitialSchema.ts
│   ├── data-source.ts     # TypeORM configuration
│   └── index.ts           # Application entry point
├── dist/                  # Compiled JavaScript (generated)
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Environment template
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## License

MIT