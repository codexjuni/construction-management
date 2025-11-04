# Database Schema Documentation

## Complete Field Reference

### Client Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ClientID | SERIAL | PRIMARY KEY | Unique identifier |
| ClientNo | VARCHAR(50) | UNIQUE, NOT NULL | Client number/code |
| ClientName | VARCHAR(200) | NOT NULL | Client company name |
| ContactPerson | VARCHAR(200) | | Primary contact name |
| Email | VARCHAR(100) | | Contact email |
| Phone | VARCHAR(20) | | Contact phone |
| Address | TEXT | | Street address |
| City | VARCHAR(100) | | City |
| State | VARCHAR(2) | | State abbreviation |
| ZipCode | VARCHAR(10) | | Postal code |
| Active | BOOLEAN | DEFAULT true | Active status |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### Contract Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ContractID | SERIAL | PRIMARY KEY | Unique identifier |
| ContractNo | VARCHAR(50) | UNIQUE, NOT NULL | Contract number |
| ClientID | INTEGER | FK → Client | Reference to client |
| Description | TEXT | NOT NULL | Contract description |
| ContractAmount | DECIMAL(15,2) | NOT NULL | Total contract value |
| ContractType | VARCHAR(50) | NOT NULL | Type of contract |
| StartDate | DATE | | Contract start date |
| EndDate | DATE | | Contract end date |
| SignedDate | DATE | | Date contract was signed |
| Status | VARCHAR(50) | | Current status |
| Notes | TEXT | | Additional notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### Project Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ProjectID | SERIAL | PRIMARY KEY | Unique identifier |
| ContractId | INTEGER | FK → Contract | Reference to contract |
| ProjectNumber | VARCHAR(50) | UNIQUE, NOT NULL | Project number |
| ProjectName | VARCHAR(200) | NOT NULL | Project name |
| ProjectAmt | DECIMAL(15,2) | NOT NULL | Project budget amount |
| ProjectAddress | TEXT | | Project site address |
| City | VARCHAR(100) | | Project city |
| State | VARCHAR(2) | | Project state |
| ZipCode | VARCHAR(10) | | Project postal code |
| StartDate | DATE | | Project start date |
| EstimatedCompletionDate | DATE | | Estimated completion |
| ActualCompletionDate | DATE | | Actual completion date |
| Status | VARCHAR(50) | | Current status |
| Description | TEXT | | Project description |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### CSLBLicense Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| LicenseID | SERIAL | PRIMARY KEY | Unique identifier |
| CSLBLicenseNumber | VARCHAR(50) | UNIQUE, NOT NULL | CSLB license number |
| ContractorName | VARCHAR(200) | NOT NULL | Contractor name |
| BusinessName | VARCHAR(200) | | Business/company name |
| LicenseType | VARCHAR(100) | | Type of license |
| Classification | VARCHAR(50) | | License classification |
| IssueDate | DATE | | License issue date |
| ExpirationDate | DATE | | License expiration date |
| Active | BOOLEAN | DEFAULT true | Active status |
| Address | TEXT | | Business address |
| City | VARCHAR(100) | | City |
| State | VARCHAR(2) | | State |
| ZipCode | VARCHAR(10) | | Postal code |
| Phone | VARCHAR(20) | | Contact phone |
| Email | VARCHAR(100) | | Contact email |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### Subcontract Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| SubcontractID | SERIAL | PRIMARY KEY | Unique identifier |
| ContractID | INTEGER | FK → Contract | Reference to main contract |
| ProjectID | INTEGER | FK → Project | Reference to project |
| CSLBLicenseNumber | VARCHAR(50) | FK → CSLBLicense | Contractor license |
| SubcontractNumber | VARCHAR(50) | UNIQUE, NOT NULL | Subcontract number |
| Description | TEXT | | Work description |
| SubcontractAmount | DECIMAL(15,2) | NOT NULL | Total subcontract value |
| AmountPaid | DECIMAL(15,2) | DEFAULT 0 | Total amount paid |
| RetentionAmount | DECIMAL(15,2) | DEFAULT 0 | Retention held |
| StartDate | DATE | | Work start date |
| EstimatedCompletionDate | DATE | | Estimated completion |
| ActualCompletionDate | DATE | | Actual completion date |
| SignedDate | DATE | | Agreement signed date |
| Status | VARCHAR(50) | | Current status |
| Notes | TEXT | | Additional notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### LaborCompliance Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| ComplianceID | SERIAL | PRIMARY KEY | Unique identifier |
| SubcontractID | INTEGER | FK → Subcontract | Reference to subcontract |
| ReportingPeriodStart | DATE | NOT NULL | Period start date |
| ReportingPeriodEnd | DATE | NOT NULL | Period end date |
| SubmissionDate | DATE | | Date submitted |
| ComplianceType | VARCHAR(50) | NOT NULL | Type of compliance |
| Status | VARCHAR(50) | | Compliance status |
| CertifiedPayrollSubmitted | BOOLEAN | DEFAULT false | Payroll submitted flag |
| PrevailingWageCompliant | BOOLEAN | DEFAULT false | Wage compliance flag |
| ApprenticeshipCompliant | BOOLEAN | DEFAULT false | Apprenticeship flag |
| Notes | TEXT | | Compliance notes |
| ReviewedBy | VARCHAR(200) | | Reviewer name |
| ReviewDate | DATE | | Review date |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### ProjectInvoice Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| InvoiceID | SERIAL | PRIMARY KEY | Unique identifier |
| ProjectID | INTEGER | FK → Project | Reference to project |
| InvoiceNumber | VARCHAR(50) | UNIQUE, NOT NULL | Invoice number |
| InvoiceDate | DATE | NOT NULL | Invoice date |
| DueDate | DATE | | Payment due date |
| InvoiceAmount | DECIMAL(15,2) | NOT NULL | Invoice total |
| AmountPaid | DECIMAL(15,2) | DEFAULT 0 | Amount paid |
| RetentionAmount | DECIMAL(15,2) | DEFAULT 0 | Retention amount |
| Description | TEXT | | Invoice description |
| Status | VARCHAR(50) | | Invoice status |
| PaidDate | DATE | | Date paid |
| Notes | TEXT | | Additional notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### ProjectPayment Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| PaymentID | SERIAL | PRIMARY KEY | Unique identifier |
| ProjectID | INTEGER | FK → Project | Reference to project |
| InvoiceID | INTEGER | FK → ProjectInvoice | Reference to invoice (optional) |
| PaymentNumber | VARCHAR(50) | | Payment reference number |
| PaymentDate | DATE | NOT NULL | Payment date |
| PaymentAmount | DECIMAL(15,2) | NOT NULL | Payment amount |
| PaymentMethod | VARCHAR(50) | NOT NULL | Payment method |
| CheckNumber | VARCHAR(100) | | Check number if applicable |
| ReferenceNumber | VARCHAR(100) | | Payment reference |
| Notes | TEXT | | Payment notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### SubcontractInvoice Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| InvoiceID | SERIAL | PRIMARY KEY | Unique identifier |
| SubcontractID | INTEGER | FK → Subcontract | Reference to subcontract |
| InvoiceNumber | VARCHAR(50) | UNIQUE, NOT NULL | Invoice number |
| InvoiceDate | DATE | NOT NULL | Invoice date |
| DueDate | DATE | | Payment due date |
| InvoiceAmount | DECIMAL(15,2) | NOT NULL | Invoice total |
| AmountPaid | DECIMAL(15,2) | DEFAULT 0 | Amount paid |
| RetentionAmount | DECIMAL(15,2) | DEFAULT 0 | Retention amount |
| Description | TEXT | | Invoice description |
| Status | VARCHAR(50) | | Invoice status |
| PaidDate | DATE | | Date paid |
| Notes | TEXT | | Additional notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

### SubcontractPayment Table
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| PaymentID | SERIAL | PRIMARY KEY | Unique identifier |
| SubcontractID | INTEGER | FK → Subcontract | Reference to subcontract |
| InvoiceID | INTEGER | FK → SubcontractInvoice | Reference to invoice (optional) |
| PaymentNumber | VARCHAR(50) | | Payment reference number |
| PaymentDate | DATE | NOT NULL | Payment date |
| PaymentAmount | DECIMAL(15,2) | NOT NULL | Payment amount |
| PaymentMethod | VARCHAR(50) | NOT NULL | Payment method |
| CheckNumber | VARCHAR(100) | | Check number if applicable |
| ReferenceNumber | VARCHAR(100) | | Payment reference |
| Notes | TEXT | | Payment notes |
| CreatedDate | TIMESTAMP | AUTO | Record creation timestamp |
| ModifiedDate | TIMESTAMP | AUTO | Last modification timestamp |

## Indexes

Performance indexes are created on all foreign key columns:
- Contract.ClientID
- Project.ContractId
- Subcontract.ContractID
- Subcontract.ProjectID
- Subcontract.CSLBLicenseNumber
- LaborCompliance.SubcontractID
- ProjectInvoice.ProjectID
- ProjectPayment.ProjectID
- ProjectPayment.InvoiceID
- SubcontractInvoice.SubcontractID
- SubcontractPayment.SubcontractID
- SubcontractPayment.InvoiceID

## Business Rules

1. **Deletion Protection**: Most foreign keys use RESTRICT to prevent accidental data loss
2. **Cascading Deletes**: LaborCompliance records are deleted when their Subcontract is deleted
3. **Retention Tracking**: Invoice and payment tables track retention amounts separately
4. **Audit Trail**: All tables include CreatedDate and ModifiedDate for tracking
5. **Unique Identifiers**: Each entity has a unique number/code field for business reference
6. **Status Tracking**: Most entities include a Status field for workflow management
