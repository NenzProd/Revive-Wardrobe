import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import axios from "axios";
import productModel from "../models/productModel.js";
import transporter from '../config/nodemailer.js';
import { ORDER_STATUS_UPDATE_TEMPLATE, ORDER_CONFIRMATION_TEMPLATE } from '../config/emailTemplates.js';

function sendMail({ to, subject, html }) {
  console.log('SendMail function called with:', { to, subject: subject.substring(0, 50) + '...' });
  return transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html
  })
}

// Test email function for debugging
const testEmail = async (req, res) => {
  try {
    console.log('Testing email configuration...');
    console.log('Environment variables check:');
    console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL ? 'Set' : 'NOT SET');
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'NOT SET');
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'NOT SET');
    
    const testEmailHtml = `
      <h2>Test Email</h2>
      <p>This is a test email to verify email configuration.</p>
      <p>If you receive this, your email setup is working correctly.</p>
    `;
    
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: 'Email address required' });
    }
    
    await sendMail({
      to: email,
      subject: 'Test Email - Revive Wardrobe',
      html: testEmailHtml
    });
    
    res.json({ success: true, message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Test email failed:', error);
    res.json({ success: false, message: error.message, details: error.stack });
  }
};


const createPaymenntOrder = async (req, res) => {
  try {
    const { amount, address, line_items } = req.body;
    if (!amount)
      return res
        .status(400)
        .json({ success: false, message: "Amount required" });
    if (!address)
      return res
        .status(400)
        .json({ success: false, message: "Address required" });

    // Build items array from line_items
    const items = line_items?.map((item) => ({
      name: item.name || "Product",
      quantity: parseInt(item.quantity) || 1,
      price: parseFloat(item.price) || 0,
      linetotal: parseFloat(item.price) * parseInt(item.quantity) || 0,
    })) || [
      {
        name: "Order",
        quantity: 1,
        price: amount,
        linetotal: amount,
      },
    ];

    const payload = {
      requestId: "REQ-" + Date.now(),
      orderId: "ORD-" + Date.now(),
      currency: "AED",
      amount: parseFloat(amount),
      items,
      customer: {
        firstName: address.first_name || "Customer",
        lastName: address.last_name || "",
        email: address.email || "customer@example.com",
        phone: address.phone || "+971500000000",
      },
      billingAddress: {
        name: `${address.first_name || ""} ${address.last_name || ""}`.trim(),
        address1: address.address || "Address",
        city: address.city || "Dubai",
        country: address.country === "UAE" ? "AE" : "AE",
      },
      returnUrl: process.env.FRONTEND_URL + "/payment-redirect",
      language: "EN",
    };

    const paymenntRes = await axios.post(
      "https://api.test.paymennt.com/mer/v2.0/checkout/web",
      payload,
      {
        headers: {
          "X-Paymennt-Api-Key": process.env.PAYMENNT_API_KEY,
          "X-Paymennt-Api-Secret": process.env.PAYMENNT_API_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (paymenntRes.data.success) {
      res.json({
        success: true,
        checkoutUrl: paymenntRes.data.result.redirectUrl,
        paymentId: paymenntRes.data.result.id,
        orderId: paymenntRes.data.result.orderId,
        requestId: paymenntRes.data.result.requestId,
      });
    } else {
      res.json({
        success: false,
        message: "Failed to create Paymennt checkout",
      });
    }
  } catch (error) {
    console.log("Paymennt error:", error.response?.data || error.message);
    res.json({ success: false, message: error.message });
  }
};

const verifyPaymennt = async (req, res) => {
  try {
    const { paymentId, userId, address, price, line_items } = req.body;

    if (!paymentId) {
      return res.json({ success: false, message: "Payment ID required" });
    }

    // Verify payment with Paymennt
    const verifyRes = await axios.get(
      `https://api.test.paymennt.com/mer/v2.0/checkout/${paymentId}`,
      {
        headers: {
          "X-Paymennt-Api-Key": process.env.PAYMENNT_API_KEY,
          "X-Paymennt-Api-Secret": process.env.PAYMENNT_API_SECRET,
        },
      }
    );

    if (!verifyRes.data.success) {
      return res.json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const paymentData = verifyRes.data.result;

    // Check if payment is successful
    if (paymentData.status !== "PAID") {
      return res.json({
        success: false,
        message: `Payment status: ${paymentData.status}`,
      });
    }

    // Check stock for each line item
    for (const item of line_items) {
      const product = await productModel.findById(item.product_id);
      if (!product) {
        return res.json({
          success: false,
          message: `Product not found for item ${item.product_id}`,
        });
      }
      const variant = product.variants.find((v) => v.sku === item.sku_id);
      if (!variant) {
        return res.json({
          success: false,
          message: `Variant not found for SKU ${item.sku_id}`,
        });
      }
      if (variant.stock < Number(item.quantity)) {
        return res.json({
          success: false,
          message: `Insufficient stock for ${product.name} (${variant.filter_value}). Only ${variant.stock} left.`,
        });
      }
    }

    // Decrement stock for each line item
    for (const item of line_items) {
      const product = await productModel.findById(item.product_id);
      const variant = product.variants.find((v) => v.sku === item.sku_id);
      variant.stock -= Number(item.quantity);
      if (variant.stock < 0) variant.stock = 0;
      await product.save();
    }

    // Create order in DB
    const orderData = {
      userId,
      address,
      price,
      line_items,
      paymentMethod: "paymennt",
      paymentId: paymentData.id,
      status: "Order Placed",
      date: new Date(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Get user details for order confirmation email
    const user = await userModel.findById(userId);
    console.log('User found for email:', user ? { id: user._id, email: user.email, name: user.name } : 'No user found');
    
    // Send order confirmation email
    if (user && user.email) {
      console.log('Attempting to send order confirmation email to:', user.email);
      try {
        // Format order date
        const orderDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        // Build order items HTML
        let orderItemsHtml = '';
        let calculatedSubtotal = 0;
        
        for (const item of line_items) {
          const product = await productModel.findById(item.product_id);
          const productName = product ? product.name : 'Product';
          const variantInfo = item.sku_id ? ` (${item.sku_id})` : '';
          const itemTotal = parseFloat(item.price) * parseInt(item.quantity);
          calculatedSubtotal += itemTotal;
          
          orderItemsHtml += `
            <div class="order-item">
              <div class="item-details">
                <div class="item-name">${productName}</div>
                <div class="item-variant">Quantity: ${item.quantity}${variantInfo}</div>
              </div>
              <div class="item-price">${price.currency_code || 'AED'} ${itemTotal.toFixed(2)}</div>
            </div>
          `;
        }

        // Calculate totals from the price object
        const shippingAmount = parseFloat(price.shipping_charges || 0);
        const taxAmount = parseFloat(price.tax || 0);
        const extraCharges = parseFloat(price.extra_charges || 0);
        const codCharges = parseFloat(price.COD || 0);
        const totalAmount = calculatedSubtotal + shippingAmount + taxAmount + extraCharges + codCharges;

        // Prepare email content
        let emailHtml = ORDER_CONFIRMATION_TEMPLATE
          .replace('{{customerName}}', user.name || 'Customer')
          .replace('{{orderId}}', newOrder._id.toString())
          .replace('{{orderDate}}', orderDate)
          .replace('{{orderItems}}', orderItemsHtml)
          .replace(/{{currency}}/g, price.currency_code || 'AED')
          .replace('{{subtotal}}', calculatedSubtotal.toFixed(2))
          .replace('{{shipping}}', shippingAmount.toFixed(2))
          .replace('{{tax}}', taxAmount.toFixed(2))
          .replace('{{total}}', totalAmount.toFixed(2))
          .replace(/{{customerName}}/g, user.name || 'Customer')
          .replace('{{address}}', address.address || '')
          .replace('{{city}}', address.city || '')
          .replace('{{country}}', address.country || '')
          .replace('{{phone}}', address.phone || '')
          .replace('{{trackingLink}}', 'https://test.revivewardrobe.com/account');

        console.log('Email content prepared for order:', newOrder._id.toString());
        console.log('Sending email with subject:', 'Order Confirmation - Thank you for your purchase! - Revive Wardrobe');
        console.log('SMTP config check - SENDER_EMAIL:', process.env.SENDER_EMAIL ? 'Set' : 'NOT SET');
        console.log('SMTP config check - SMTP_USER:', process.env.SMTP_USER ? 'Set' : 'NOT SET');
        console.log('SMTP config check - SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'NOT SET');

        // Send confirmation email
        const emailResult = await sendMail({
          to: user.email,
          subject: 'Order Confirmation - Thank you for your purchase! - Revive Wardrobe',
          html: emailHtml
        });

        console.log('Email sent successfully!', emailResult.messageId);
        console.log(`Order confirmation email sent to ${user.email} for order ${newOrder._id}`);
      } catch (emailError) {
        // Don't fail the payment process if email fails - just log the error
        console.error('Failed to send order confirmation email:');
        console.error('Error message:', emailError.message);
        console.error('Error stack:', emailError.stack);
        if (emailError.response) {
          console.error('SMTP Response:', emailError.response);
        }
      }
    } else {
      console.log('Cannot send email - User not found or email missing');
      console.log('UserId provided:', userId);
      console.log('User found:', !!user);
      console.log('User has email:', user ? !!user.email : 'N/A');
    }

    // Send order to Depoter
    const depoterPayload = {
      order_id: newOrder._id.toString(),
      billing: { ...address },
      shipping: { ...address },
      price: { ...price },
      line_items: line_items.map((item) => ({
        sku_id: item.sku_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    let depoterOrder = null;
    try {
      const depoterRes = await axios.post(
        "https://fms.depoter.com/WMS/API/create_order/",
        depoterPayload,
        { headers: { key: "974e7b1d1ce1aadee33e" } }
      );
      depoterOrder = depoterRes.data?.order;
      if (depoterOrder && depoterOrder.id && depoterOrder.depoter_order_id) {
        await orderModel.findByIdAndUpdate(newOrder._id, {
          depoterId: depoterOrder.id,
          depoterOrderId: depoterOrder.depoter_order_id,
        });
      }
    } catch (err) {
      console.log("Depoter API error:", err?.response?.data || err.message);
    }

    res.json({
      success: true,
      message: "Payment Successful, Order Placed",
      depoterId: depoterOrder?.id,
      depoterOrderId: depoterOrder?.depoter_order_id,
    });
  } catch (error) {
    console.log(
      "Paymennt verify error:",
      error.response?.data || error.message
    );
    res.json({ success: false, message: error.message });
  }
};

// all orders for admin panal

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// user orders data for front end

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update order status from admin panel

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const depoterWebhook = async (req, res) => {
  try {
    const { order } = req.body; // Depoter sends { order: {...} }

    if (!order || !order.order_id || !order.status) {
      return res.status(400).json({ success: false, message: "Invalid webhook payload" });
    }

    // Extract fields from Depoter payload
    const {
      order_id,
      depoter_order_id,
      currency_code,
      shipper_name,
      awb,
      tracking_url,
      status,
      line_items,
      return_tracking_details
    } = order;

    // Update order in DB
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: order_id },   // ⚠️ you are saving your MongoDB order._id as depoter "order_id"
      {
        depoterOrderId: depoter_order_id,
        currency_code,
        shipper_name,
        awb,
        tracking_url,
        status,
        line_items,
        return_tracking_details
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found in DB" });
    }

    // Get user details for email
    const user = await userModel.findById(updatedOrder.userId);
    
    if (user && user.email) {
      try {
        // Prepare email content
        let emailHtml = ORDER_STATUS_UPDATE_TEMPLATE
          .replace('{{customerName}}', user.name || 'Customer')
          .replace('{{orderId}}', order_id)
          .replace('{{status}}', status);

        // Add shipper information if available
        const shipperInfo = shipper_name ? `<p><strong>Shipped via:</strong> ${shipper_name}</p>` : '';
        emailHtml = emailHtml.replace('{{shipperInfo}}', shipperInfo);

        // Add AWB information if available
        const awbInfo = awb ? `<p><strong>Tracking Number:</strong> ${awb}</p>` : '';
        emailHtml = emailHtml.replace('{{awbInfo}}', awbInfo);

        // Add tracking section if tracking URL is available
        const trackingSection = tracking_url ? 
          `<p>You can track your order using the link below:</p>
           <a href="${tracking_url}" class="tracking-link">Track Your Order</a>` : 
          '<p>We will notify you when tracking information becomes available.</p>';
        emailHtml = emailHtml.replace('{{trackingSection}}', trackingSection);

        // Send email
        await sendMail({
          to: user.email,
          subject: `Order Update - ${status} - Revive Wardrobe`,
          html: emailHtml
        });

        console.log(`Order status email sent to ${user.email} for order ${order_id}`);
      } catch (emailError) {
        // Don't fail the webhook if email fails - just log the error
        console.log('Failed to send order status email:', emailError.message);
      }
    }

    return res.status(200).json({ success: true, message: "Webhook processed", order: updatedOrder });

  } catch (err) {
    console.log("Depoter Webhook error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {
  createPaymenntOrder,
  verifyPaymennt,
  allOrders,
  userOrders,
  updateStatus,
  depoterWebhook,
  testEmail,
};
