import express from "express";
import cors from "cors";
import "dotenv/config";
import pool from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import transactionRoutes from "./src/routes/transactionRoutes.js";
import notificationRoutes from "./src/routes/notificationRoutes.js";
import programRoutes from "./src/routes/programRoutes.js";
import distributionRoutes from "./src/routes/distributionRoutes.js";

const app = express();
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("✅ Connected to Supabase DB");
  release();
});

// Middleware
app.use(
  cors({
    origin: process.env.VITE_API_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/notif", notificationRoutes);
app.use("/api/program", programRoutes);
app.use("/api/distribution", distributionRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "NurimanPay API is running",
    version: "1.0.0",
    status: "ok",
    timestamp: new Date(),
    endpoints: {
      auth: {
        login: "POST api/auth/login",
      },
      transaksi: {
        create: "POST api/transaksi/create",
        getAll: "GET api/transaksi",
      },
      program: {
        create: "POST api/program/create",
        getAll: "GET api/program",
        getTransactions: "GET api/program/:id/transactions",
      },
      midtrans: {
        notification: "POST api/notif",
        cekStatus: "GET api/status/:orderId",
      },
      penyaluran: {
        getAll: "GET /api/penyaluran",
        getDetail: "GET /api/penyaluran/:id",
        getByProgram: "GET /api/penyaluran/program/:programId",
        getSummary: "GET /api/penyaluran/summary/:programId",
        create: "POST /api/penyaluran",
        update: "PUT /api/penyaluran/:id",
        delete: "DELETE /api/penyaluran/:id",
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route tidak ditemukan",
    requestedUrl: req.url,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Terjadi kesalahan pada server",
  });
});

export default app;
