import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730736000000 implements MigrationInterface {
  name = 'InitialSchema1730736000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Client table
    await queryRunner.query(`
      CREATE TABLE "Client" (
        "ClientID" SERIAL PRIMARY KEY,
        "ClientNo" VARCHAR(50) UNIQUE NOT NULL,
        "ClientName" VARCHAR(200) NOT NULL,
        "ContactPerson" VARCHAR(200),
        "Email" VARCHAR(100),
        "Phone" VARCHAR(20),
        "Address" TEXT,
        "City" VARCHAR(100),
        "State" VARCHAR(2),
        "ZipCode" VARCHAR(10),
        "Active" BOOLEAN DEFAULT true,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create Contract table
    await queryRunner.query(`
      CREATE TABLE "Contract" (
        "ContractID" SERIAL PRIMARY KEY,
        "ContractNo" VARCHAR(50) UNIQUE NOT NULL,
        "ClientID" INTEGER NOT NULL,
        "Description" TEXT NOT NULL,
        "ContractAmount" DECIMAL(15,2) NOT NULL,
        "ContractType" VARCHAR(50) NOT NULL,
        "StartDate" DATE,
        "EndDate" DATE,
        "SignedDate" DATE,
        "Status" VARCHAR(50),
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_Contract_Client" FOREIGN KEY ("ClientID")
          REFERENCES "Client"("ClientID") ON DELETE RESTRICT
      )
    `);

    // Create Project table
    await queryRunner.query(`
      CREATE TABLE "Project" (
        "ProjectID" SERIAL PRIMARY KEY,
        "ContractId" INTEGER NOT NULL,
        "ProjectNumber" VARCHAR(50) UNIQUE NOT NULL,
        "ProjectName" VARCHAR(200) NOT NULL,
        "ProjectAmt" DECIMAL(15,2) NOT NULL,
        "ProjectAddress" TEXT,
        "City" VARCHAR(100),
        "State" VARCHAR(2),
        "ZipCode" VARCHAR(10),
        "StartDate" DATE,
        "EstimatedCompletionDate" DATE,
        "ActualCompletionDate" DATE,
        "Status" VARCHAR(50),
        "Description" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_Project_Contract" FOREIGN KEY ("ContractId")
          REFERENCES "Contract"("ContractID") ON DELETE RESTRICT
      )
    `);

    // Create CSLBLicense table
    await queryRunner.query(`
      CREATE TABLE "CSLBLicense" (
        "LicenseID" SERIAL PRIMARY KEY,
        "CSLBLicenseNumber" VARCHAR(50) UNIQUE NOT NULL,
        "ContractorName" VARCHAR(200) NOT NULL,
        "BusinessName" VARCHAR(200),
        "LicenseType" VARCHAR(100),
        "Classification" VARCHAR(50),
        "IssueDate" DATE,
        "ExpirationDate" DATE,
        "Active" BOOLEAN DEFAULT true,
        "Address" TEXT,
        "City" VARCHAR(100),
        "State" VARCHAR(2),
        "ZipCode" VARCHAR(10),
        "Phone" VARCHAR(20),
        "Email" VARCHAR(100),
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW()
      )
    `);

    // Create Subcontract table
    await queryRunner.query(`
      CREATE TABLE "Subcontract" (
        "SubcontractID" SERIAL PRIMARY KEY,
        "ContractID" INTEGER NOT NULL,
        "ProjectID" INTEGER NOT NULL,
        "CSLBLicenseNumber" VARCHAR(50) NOT NULL,
        "SubcontractNumber" VARCHAR(50) UNIQUE NOT NULL,
        "Description" TEXT,
        "SubcontractAmount" DECIMAL(15,2) NOT NULL,
        "AmountPaid" DECIMAL(15,2) DEFAULT 0,
        "RetentionAmount" DECIMAL(15,2) DEFAULT 0,
        "StartDate" DATE,
        "EstimatedCompletionDate" DATE,
        "ActualCompletionDate" DATE,
        "SignedDate" DATE,
        "Status" VARCHAR(50),
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_Subcontract_Contract" FOREIGN KEY ("ContractID")
          REFERENCES "Contract"("ContractID") ON DELETE RESTRICT,
        CONSTRAINT "FK_Subcontract_Project" FOREIGN KEY ("ProjectID")
          REFERENCES "Project"("ProjectID") ON DELETE RESTRICT,
        CONSTRAINT "FK_Subcontract_CSLBLicense" FOREIGN KEY ("CSLBLicenseNumber")
          REFERENCES "CSLBLicense"("CSLBLicenseNumber") ON DELETE RESTRICT
      )
    `);

    // Create LaborCompliance table
    await queryRunner.query(`
      CREATE TABLE "LaborCompliance" (
        "ComplianceID" SERIAL PRIMARY KEY,
        "SubcontractID" INTEGER NOT NULL,
        "ReportingPeriodStart" DATE NOT NULL,
        "ReportingPeriodEnd" DATE NOT NULL,
        "SubmissionDate" DATE,
        "ComplianceType" VARCHAR(50) NOT NULL,
        "Status" VARCHAR(50),
        "CertifiedPayrollSubmitted" BOOLEAN DEFAULT false,
        "PrevailingWageCompliant" BOOLEAN DEFAULT false,
        "ApprenticeshipCompliant" BOOLEAN DEFAULT false,
        "Notes" TEXT,
        "ReviewedBy" VARCHAR(200),
        "ReviewDate" DATE,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_LaborCompliance_Subcontract" FOREIGN KEY ("SubcontractID")
          REFERENCES "Subcontract"("SubcontractID") ON DELETE CASCADE
      )
    `);

    // Create ProjectInvoice table
    await queryRunner.query(`
      CREATE TABLE "ProjectInvoice" (
        "InvoiceID" SERIAL PRIMARY KEY,
        "ProjectID" INTEGER NOT NULL,
        "InvoiceNumber" VARCHAR(50) UNIQUE NOT NULL,
        "InvoiceDate" DATE NOT NULL,
        "DueDate" DATE,
        "InvoiceAmount" DECIMAL(15,2) NOT NULL,
        "AmountPaid" DECIMAL(15,2) DEFAULT 0,
        "RetentionAmount" DECIMAL(15,2) DEFAULT 0,
        "Description" TEXT,
        "Status" VARCHAR(50),
        "PaidDate" DATE,
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_ProjectInvoice_Project" FOREIGN KEY ("ProjectID")
          REFERENCES "Project"("ProjectID") ON DELETE RESTRICT
      )
    `);

    // Create ProjectPayment table
    await queryRunner.query(`
      CREATE TABLE "ProjectPayment" (
        "PaymentID" SERIAL PRIMARY KEY,
        "ProjectID" INTEGER NOT NULL,
        "InvoiceID" INTEGER,
        "PaymentNumber" VARCHAR(50),
        "PaymentDate" DATE NOT NULL,
        "PaymentAmount" DECIMAL(15,2) NOT NULL,
        "PaymentMethod" VARCHAR(50) NOT NULL,
        "CheckNumber" VARCHAR(100),
        "ReferenceNumber" VARCHAR(100),
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_ProjectPayment_Project" FOREIGN KEY ("ProjectID")
          REFERENCES "Project"("ProjectID") ON DELETE RESTRICT,
        CONSTRAINT "FK_ProjectPayment_Invoice" FOREIGN KEY ("InvoiceID")
          REFERENCES "ProjectInvoice"("InvoiceID") ON DELETE SET NULL
      )
    `);

    // Create SubcontractInvoice table
    await queryRunner.query(`
      CREATE TABLE "SubcontractInvoice" (
        "InvoiceID" SERIAL PRIMARY KEY,
        "SubcontractID" INTEGER NOT NULL,
        "InvoiceNumber" VARCHAR(50) UNIQUE NOT NULL,
        "InvoiceDate" DATE NOT NULL,
        "DueDate" DATE,
        "InvoiceAmount" DECIMAL(15,2) NOT NULL,
        "AmountPaid" DECIMAL(15,2) DEFAULT 0,
        "RetentionAmount" DECIMAL(15,2) DEFAULT 0,
        "Description" TEXT,
        "Status" VARCHAR(50),
        "PaidDate" DATE,
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_SubcontractInvoice_Subcontract" FOREIGN KEY ("SubcontractID")
          REFERENCES "Subcontract"("SubcontractID") ON DELETE RESTRICT
      )
    `);

    // Create SubcontractPayment table
    await queryRunner.query(`
      CREATE TABLE "SubcontractPayment" (
        "PaymentID" SERIAL PRIMARY KEY,
        "SubcontractID" INTEGER NOT NULL,
        "InvoiceID" INTEGER,
        "PaymentNumber" VARCHAR(50),
        "PaymentDate" DATE NOT NULL,
        "PaymentAmount" DECIMAL(15,2) NOT NULL,
        "PaymentMethod" VARCHAR(50) NOT NULL,
        "CheckNumber" VARCHAR(100),
        "ReferenceNumber" VARCHAR(100),
        "Notes" TEXT,
        "CreatedDate" TIMESTAMP DEFAULT NOW(),
        "ModifiedDate" TIMESTAMP DEFAULT NOW(),
        CONSTRAINT "FK_SubcontractPayment_Subcontract" FOREIGN KEY ("SubcontractID")
          REFERENCES "Subcontract"("SubcontractID") ON DELETE RESTRICT,
        CONSTRAINT "FK_SubcontractPayment_Invoice" FOREIGN KEY ("InvoiceID")
          REFERENCES "SubcontractInvoice"("InvoiceID") ON DELETE SET NULL
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`CREATE INDEX "IDX_Contract_ClientID" ON "Contract"("ClientID")`);
    await queryRunner.query(`CREATE INDEX "IDX_Project_ContractId" ON "Project"("ContractId")`);
    await queryRunner.query(`CREATE INDEX "IDX_Subcontract_ContractID" ON "Subcontract"("ContractID")`);
    await queryRunner.query(`CREATE INDEX "IDX_Subcontract_ProjectID" ON "Subcontract"("ProjectID")`);
    await queryRunner.query(`CREATE INDEX "IDX_Subcontract_CSLBLicenseNumber" ON "Subcontract"("CSLBLicenseNumber")`);
    await queryRunner.query(`CREATE INDEX "IDX_LaborCompliance_SubcontractID" ON "LaborCompliance"("SubcontractID")`);
    await queryRunner.query(`CREATE INDEX "IDX_ProjectInvoice_ProjectID" ON "ProjectInvoice"("ProjectID")`);
    await queryRunner.query(`CREATE INDEX "IDX_ProjectPayment_ProjectID" ON "ProjectPayment"("ProjectID")`);
    await queryRunner.query(`CREATE INDEX "IDX_ProjectPayment_InvoiceID" ON "ProjectPayment"("InvoiceID")`);
    await queryRunner.query(`CREATE INDEX "IDX_SubcontractInvoice_SubcontractID" ON "SubcontractInvoice"("SubcontractID")`);
    await queryRunner.query(`CREATE INDEX "IDX_SubcontractPayment_SubcontractID" ON "SubcontractPayment"("SubcontractID")`);
    await queryRunner.query(`CREATE INDEX "IDX_SubcontractPayment_InvoiceID" ON "SubcontractPayment"("InvoiceID")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order to handle foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "SubcontractPayment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "SubcontractInvoice"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ProjectPayment"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ProjectInvoice"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "LaborCompliance"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Subcontract"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "CSLBLicense"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Project"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Contract"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "Client"`);
  }
}
