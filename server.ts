import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse requests
  app.use(express.json());

  // API: Check Razorpay keys configuration state
  app.get("/api/pay-config", (req, res) => {
    const hasKeys = !!(process.env.VITE_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
    res.json({
      isConfigured: hasKeys,
      keyId: process.env.VITE_RAZORPAY_KEY_ID || ""
    });
  });

  // API: Create Razorpay Order
  app.post("/api/razorpay-order", async (req, res) => {
    try {
      const { amount, productId, email, name, phone } = req.body;
      const keyId = process.env.VITE_RAZORPAY_KEY_ID;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (!amount) {
        return res.status(400).json({ success: false, error: "Amount is required" });
      }

      // Convert INR amount to paise (e.g. ₹99 = 9900 paise)
      const amountInPaise = Math.round(amount * 100);

      if (keyId && keySecret) {
        // Initialize Razorpay client lazily to prevent start crashes if environment variables are not loaded yet
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret
        });

        const options = {
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${productId.substring(0, 8)}_${Date.now()}`,
          notes: {
            productId,
            email,
            name,
            phone
          }
        };

        const order = await razorpay.orders.create(options);
        return res.json({
          success: true,
          orderId: order.id,
          amount: order.amount,
          currency: "INR",
          keyId: keyId,
          isDemo: false
        });
      } else {
        // Fallback to high-fidelity demo mode with clear log message when unconfigured
        console.log("Razorpay keys not configured. Falling back to Sandbox/Demo payment.");
        return res.json({
          success: true,
          orderId: `demo_order_${Math.random().toString(36).substring(2, 11)}`,
          amount: amountInPaise,
          currency: "INR",
          keyId: "demo_key_unconfigured",
          isDemo: true
        });
      }
    } catch (error: any) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to create order" });
    }
  });

  // API: Verify Razorpay Payment Signature
  app.post("/api/razorpay-verify", (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, isDemo } = req.body;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;

      if (isDemo || !keySecret) {
        if (razorpay_order_id && razorpay_order_id.startsWith("demo_order_")) {
          return res.json({
            success: true,
            verified: true,
            isDemo: true,
            message: "Demo payment verified successfully!"
          });
        }
        return res.status(400).json({ success: false, error: "Invalid demo transaction key." });
      }

      // Verify legitimate Razorpay webhook/redirect signature using HMAC SHA256
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        return res.json({
          success: true,
          verified: true,
          isDemo: false,
          message: "Payment signature verified successfully!"
        });
      } else {
        return res.status(400).json({
          success: false,
          verified: false,
          error: "Razorpay signature verification failed."
        });
      }
    } catch (error: any) {
      console.error("Error verifying payment signature:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to verify signature" });
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
