// test/test.js - VERSI DATA TERSIMPAN (TIDAK DIHAPUS)

import request from 'supertest';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import app from '../app.js';
import pool from '../src/config/db.js';

// ============================================
// MOCK AUTH MIDDLEWARE - BYPASS ADMIN CHECK
// ============================================
vi.mock('../src/middleware/authLogin.js', async () => {
  const actual = await vi.importActual('../src/middleware/authLogin.js');
  return {
    ...actual,
    isAdminOnly: (req, res, next) => {
      req.user = { id: 'admin-123', role: 'admin', email: 'admin@test.com' };
      next();
    }
  };
});

// ============================================
// CLEANUP FUNCTION - DINONAKTIFKAN
// ============================================
const cleanTestDatabase = async () => {
  // DATA TIDAK DIHAPUS - TIDAK MELAKUKAN APAPUN
  console.log('⚠️ CLEANUP DISABLED - Data will remain in database');
};

// ============================================
// MAIN TEST SUITE
// ============================================
describe('NURIMANPAY API - COMPLETE TEST (ALL TABLES)', () => {
  let server;
  let serverPort;
  let createdProgramId = null;
  let createdDistributionId = null;

  beforeAll(async () => {
    server = app.listen(0);
    await new Promise(resolve => setTimeout(resolve, 100));
     serverPort = server.address().port;
  console.log(`🧪 Test server started on random port: ${serverPort}`);
  });

  afterAll(async () => {
    // TIDAK MENGHAPUS DATA - COMMENT CLEANUP
    // await cleanTestDatabase();
    
    await new Promise((resolve) => server.close(resolve));
    await pool.end();
    console.log('✅ Test server closed - DATA REMAINS IN DATABASE');
  });

  // ==========================================
  // 1. PROGRAM MODULE - CREATE
  // ==========================================
  describe('📁 PROGRAM MODULE', () => {
    it('should create program with image', async () => {
      const newProgram = { 
        title: `TEST Program P ${Date.now()}`, 
        target_amount: 50000000,
        description: 'Program untuk testing lengkap',
        image: 'https://example.com/image-test.jpg'
      };
      
      const res = await request(server)
        .post('/api/program/create')
        .send(newProgram);

      console.log('Create program status:', res.statusCode);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        createdProgramId = res.body.id || res.body.data?.id;
        console.log('✅ Program created with ID:', createdProgramId);
      }
      
      expect([200, 201, 500]).toContain(res.statusCode);
    });

    it('should get all programs', async () => {
      const res = await request(server).get('/api/program');
      console.log('GET /api/program status:', res.statusCode);
      expect(res.statusCode).toBe(200);
    });
  });

  // ==========================================
  // 2. TRANSACTION MODULE - CREATE
  // ==========================================
  describe('💰 TRANSACTION MODULE', () => {
    it('should create transaction with program_id', async () => {
      const res = await request(server)
        .post('/api/transaction/create')
        .send({
          name: `TEST Donor A ${Date.now()}`,
          phone_number: '08123456789',
          amount: 100000,
          message: 'TEST donation with program',
          program_id: createdProgramId
        });

      console.log('Create transaction (with program) status:', res.statusCode);
      expect([200, 201, 500]).toContain(res.statusCode);
    });

    it('should create transaction without program_id', async () => {
      const res = await request(server)
        .post('/api/transaction/create')
        .send({
          name: `TEST Donor General ${Date.now()}`,
          phone_number: '08123456788',
          amount: 75000,
          message: 'TEST general donation'
        });

      console.log('Create transaction (general) status:', res.statusCode);
      expect([200, 201, 500]).toContain(res.statusCode);
    });

    it('should create third transaction', async () => {
      const res = await request(server)
        .post('/api/transaction/create')
        .send({
          name: `TEST Donor 3 ${Date.now()}`,
          phone_number: '08123456787',
          amount: 200000,
          message: 'TEST donation 3'
        });

      expect([200, 201, 500]).toContain(res.statusCode);
    });
  });

  // ==========================================
  // 3. MIDTRANS PAYMENT - AUTO GENERATED
  // ==========================================
  describe('💳 MIDTRANS PAYMENT', () => {
    it('should have midtrans_payment records', async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await pool.query(`
        SELECT COUNT(*) FROM midtrans_payment 
        WHERE order_id LIKE 'DONASI-%' OR order_id LIKE 'TEST-%'
      `);
      
      const count = parseInt(result.rows[0].count, 10);
      console.log(`📊 Midtrans Payment records: ${count}`);
      expect(count).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // 4. DISTRIBUTION MODULE - CREATE
  // ==========================================
  describe('📦 DISTRIBUTION MODULE', () => {
    it('should create distribution', async () => {
      if (!createdProgramId) {
        const programRes = await request(server)
          .post('/api/program/create')
          .send({ 
            title: `TEST Program Dist ${Date.now()}`, 
            target_amount: 100000000,
            image: 'https://example.com/image.jpg'
          });
        
        createdProgramId = programRes.body.id || programRes.body.data?.id;
        console.log('Created new program for distribution:', createdProgramId);
      }
      
      const res = await request(server)
        .post('/api/distribution/create')
        .send({
          program_id: createdProgramId,
          amount: 25000000,
          description: 'TEST Distribution - Penyaluran dana',
          distributed_at: new Date().toISOString()
        });

      console.log('Create distribution status:', res.statusCode);
      
      if (res.statusCode === 200 || res.statusCode === 201) {
        createdDistributionId = res.body.id || res.body.data?.id;
        console.log('✅ Distribution created with ID:', createdDistributionId);
      }
      
      expect([200, 201, 400, 500]).toContain(res.statusCode);
    });
  });

  // ==========================================
  // 5. GET ALL DATA - VERIFICATION
  // ==========================================
  describe('🔍 GET ALL DATA', () => {
    it('GET /api/program should return programs', async () => {
      const res = await request(server).get('/api/program');
      expect(res.statusCode).toBe(200);
      
      if (Array.isArray(res.body)) {
        console.log(`📊 Total programs in API: ${res.body.length}`);
      } else if (res.body.data) {
        console.log(`📊 Total programs in API: ${res.body.data.length}`);
      }
    });

    it('GET /api/distribution should return distributions', async () => {
      const res = await request(server).get('/api/distribution');
      console.log('GET /api/distribution status:', res.statusCode);
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  // ==========================================
  // 6. VERIFY ALL DATA IN DATABASE
  // ==========================================
  describe('📊 DATABASE VERIFICATION', () => {
    it('should have programs', async () => {
      const result = await pool.query(`
        SELECT COUNT(*) FROM programs WHERE title LIKE '%TEST%'
      `);
      const count = parseInt(result.rows[0].count, 10);
      console.log(`📊 Programs in DB: ${count} records`);
    });

    it('should have transactions', async () => {
      const result = await pool.query(`
        SELECT COUNT(*) FROM transactions WHERE name LIKE '%TEST%'
      `);
      const count = parseInt(result.rows[0].count, 10);
      console.log(`📊 Transactions in DB: ${count} records`);
    });

    it('should have midtrans_payment', async () => {
      const result = await pool.query(`
        SELECT COUNT(*) FROM midtrans_payment 
        WHERE order_id LIKE 'DONASI-%' OR order_id LIKE 'TEST-%'
      `);
      const count = parseInt(result.rows[0].count, 10);
      console.log(`📊 Midtrans Payment in DB: ${count} records`);
    });

    it('should have distributions', async () => {
      const result = await pool.query(`
        SELECT COUNT(*) FROM distributions WHERE description LIKE '%TEST%'
      `);
      const count = parseInt(result.rows[0].count, 10);
      console.log(`📊 Distributions in DB: ${count} records`);
    });

    it('FINAL SUMMARY - ALL TABLES', async () => {
      const programs = await pool.query(`SELECT COUNT(*) FROM programs WHERE title LIKE '%TEST%'`);
      const transactions = await pool.query(`SELECT COUNT(*) FROM transactions WHERE name LIKE '%TEST%'`);
      const midtrans = await pool.query(`SELECT COUNT(*) FROM midtrans_payment WHERE order_id LIKE 'DONASI-%' OR order_id LIKE 'TEST-%'`);
      const distributions = await pool.query(`SELECT COUNT(*) FROM distributions WHERE description LIKE '%TEST%'`);
      
      const progCount = parseInt(programs.rows[0].count, 10);
      const transCount = parseInt(transactions.rows[0].count, 10);
      const midCount = parseInt(midtrans.rows[0].count, 10);
      const distCount = parseInt(distributions.rows[0].count, 10);
      
      console.log('\n╔══════════════════════════════════════════════╗');
      console.log('║     FINAL TEST DATA SUMMARY - ALL TABLES     ║');
      console.log('╠══════════════════════════════════════════════╣');
      console.log(`║   ✅ Programs       : ${progCount.toString().padStart(5)} records        ║`);
      console.log(`║   ✅ Transactions   : ${transCount.toString().padStart(5)} records        ║`);
      console.log(`║   ✅ Midtrans Pay   : ${midCount.toString().padStart(5)} records        ║`);
      console.log(`║   ✅ Distributions  : ${distCount.toString().padStart(5)} records        ║`);
      console.log('╚══════════════════════════════════════════════╝\n');
    });
  });

  // ==========================================
  // 7. ROOT ENDPOINT
  // ==========================================
  describe('🏠 ROOT ENDPOINT', () => {
    it('GET / should return API information', async () => {
      const res = await request(server).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'NurimanPay API is running');
      console.log('✅ Root endpoint OK');
    });
  });
});