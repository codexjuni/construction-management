import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './data-source';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Construction Management API is running' });
});

// Database info endpoint
app.get('/api/info', async (req, res) => {
  try {
    const isConnected = AppDataSource.isInitialized;
    res.json({
      status: 'OK',
      database: {
        connected: isConnected,
        type: 'PostgreSQL',
        database: process.env.DB_DATABASE || 'construction_management',
      },
      entities: [
        'Client',
        'Contract',
        'Project',
        'CSLBLicense',
        'Subcontract',
        'LaborCompliance',
        'ProjectInvoice',
        'ProjectPayment',
        'SubcontractInvoice',
        'SubcontractPayment',
      ],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get database info' });
  }
});

// Example endpoints for each entity
app.get('/api/clients', async (req, res) => {
  try {
    const clientRepo = AppDataSource.getRepository('Client');
    const clients = await clientRepo.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

app.get('/api/contracts', async (req, res) => {
  try {
    const contractRepo = AppDataSource.getRepository('Contract');
    const contracts = await contractRepo.find({ relations: ['Client'] });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projectRepo = AppDataSource.getRepository('Project');
    const projects = await projectRepo.find({ relations: ['Contract', 'Contract.Client'] });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`API Info: http://localhost:${PORT}/api/info`);
    });
  })
  .catch((error) => {
    console.error('Error during Data Source initialization:', error);
  });
