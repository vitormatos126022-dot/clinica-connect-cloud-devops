require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  ports: {
    gateway: Number(process.env.GATEWAY_PORT || 3100),
    appointments: Number(process.env.APPOINTMENTS_PORT || 3101),
    stock: Number(process.env.STOCK_PORT || 3102),
    notifications: Number(process.env.NOTIFICATIONS_PORT || 3103),
  },
  databaseUrl: process.env.DATABASE_URL || "postgres://clinic_user:clinic_pass@localhost:5432/clinic_connect",
  services: {
    appointments: process.env.APPOINTMENTS_URL || "http://localhost:3101",
    stock: process.env.STOCK_URL || "http://localhost:3102",
    notifications: process.env.NOTIFICATIONS_URL || "http://localhost:3103",
  },
};

module.exports = { config };
