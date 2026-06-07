import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

function isValidCashfreeKey(key: string | undefined): boolean {
  if (!key) return false;
  const k = key.trim().toLowerCase();
  if (k === "" || k === "undefined" || k === "null") return false;
  if (
    k.includes("your_") ||
    k.includes("your-") ||
    k.includes("placeholder") ||
    k.includes("enter_") ||
    k.includes("todo") ||
    k.length < 5
  ) {
    return false;
  }
  return true;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse requests
  app.use(express.json());

  // API: Check Cashfree keys configuration state
  app.get("/api/pay-config", (req, res) => {
    const appId = process.env.VITE_CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const hasKeys = isValidCashfreeKey(appId) && isValidCashfreeKey(secretKey);
    res.json({
      isConfigured: hasKeys,
      appId: appId || "",
      env: process.env.VITE_CASHFREE_ENV || "sandbox"
    });
  });

  // API: Create Cashfree Order
  app.post("/api/cashfree-order", async (req, res) => {
    try {
      const { amount, productId, email, name, phone } = req.body;
      const appId = process.env.VITE_CASHFREE_APP_ID;
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const paymentEnv = process.env.VITE_CASHFREE_ENV || "sandbox";

      if (!amount) {
        return res.status(400).json({ success: false, error: "Amount is required" });
      }

      if (isValidCashfreeKey(appId) && isValidCashfreeKey(secretKey)) {
        const host = paymentEnv === "production"
          ? "https://api.cashfree.com"
          : "https://sandbox.cashfree.com";

        // Clean user's contact number to 10-digits
        let sanitizedPhone = (phone || "").replace(/[^\d]/g, "");
        if (sanitizedPhone.length < 10) {
          sanitizedPhone = "9999999999";
        } else {
          sanitizedPhone = sanitizedPhone.substring(sanitizedPhone.length - 10);
        }

        const cfOrderId = `cf_${productId.substring(0, 8)}_${Date.now()}`;

        const payload = {
          order_id: cfOrderId,
          order_amount: Number(amount),
          order_currency: "INR",
          customer_details: {
            customer_id: `cust_${Date.now()}`,
            customer_name: name || "Customer",
            customer_email: email || "customer@example.com",
            customer_phone: sanitizedPhone
          },
          order_meta: {
            return_url: `${process.env.APP_URL || "http://localhost:3000"}/?order_id={order_id}`
          }
        };

        const response = await fetch(`${host}/pg/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": appId,
            "x-client-secret": secretKey,
            "x-api-version": "2023-08-01"
          },
          body: JSON.stringify(payload)
        });

        const orderData = await response.json() as any;

        if (!response.ok || !orderData.payment_session_id) {
          console.error("Cashfree API order creation failure:", orderData);
          throw new Error(orderData.message || "Failed to establish secure merchant transaction.");
        }

        return res.json({
          success: true,
          paymentSessionId: orderData.payment_session_id,
          orderId: orderData.order_id,
          amount: orderData.order_amount,
          currency: "INR",
          isDemo: false
        });
      } else {
        // Fallback to high-fidelity demo mode with clear log message when unconfigured
        console.log("Cashfree keys not configured. Falling back to Sandbox/Demo payment.");
        return res.json({
          success: true,
          paymentSessionId: `demo_session_${Math.random().toString(36).substring(2, 11)}`,
          orderId: `demo_order_${Math.random().toString(36).substring(2, 11)}`,
          amount: Number(amount),
          currency: "INR",
          isDemo: true
        });
      }
    } catch (error: any) {
      console.error("Error creating Cashfree order:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to create Cashfree order" });
    }
  });

  // API: Verify Cashfree Payment status
  app.post("/api/cashfree-verify", async (req, res) => {
    try {
      const { order_id, isDemo } = req.body;
      const appId = process.env.VITE_CASHFREE_APP_ID;
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const paymentEnv = process.env.VITE_CASHFREE_ENV || "sandbox";
      const hasKeys = isValidCashfreeKey(appId) && isValidCashfreeKey(secretKey);

      if (isDemo || !hasKeys) {
        if (order_id && order_id.startsWith("demo_order_")) {
          return res.json({
            success: true,
            verified: true,
            isDemo: true,
            message: "Demo payment verified successfully!"
          });
        }
        return res.status(400).json({ success: false, error: "Invalid demo transaction key." });
      }

      const host = paymentEnv === "production"
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

      const response = await fetch(`${host}/pg/orders/${order_id}`, {
        method: "GET",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01"
        }
      });

      const orderData = await response.json() as any;

      if (!response.ok) {
        console.error("Cashfree order lookup failure:", orderData);
        throw new Error(orderData.message || "Unable to lookup order with Cashfree backend.");
      }

      // Cashfree returns "PAID" for completed transactions
      if (orderData.order_status === "PAID") {
        return res.json({
          success: true,
          verified: true,
          isDemo: false,
          message: "Payment verified successfully!"
        });
      } else {
        return res.json({
          success: false,
          verified: false,
          status: orderData.order_status,
          message: `Payment status is ${orderData.order_status}.`
        });
      }
    } catch (error: any) {
      console.error("Error verifying Cashfree payment:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to verify transaction" });
    }
  });

  // Vite dev or production static serving middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started successfully, listening on http://localhost:${PORT}`);
  });
}

startServer();
