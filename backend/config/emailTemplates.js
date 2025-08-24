export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Welcome to Revive Wardrobe</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F9F9F9; }
    .container { max-width: 500px; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; }
    .button {
      display: inline-block;
      background: #c10000e6;
      color: #fff !important;
      padding: 12px 20px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Welcome to Revive Wardrobe!</h2>
    <p>Hi <strong>{{name}}</strong>,</p>
    <p>Thank you for registering with Revive Wardrobe. You can now shop, track orders, and manage your wardrobe seamlessly.</p>
    <p>
      <a href="{{loginLink}}" class="button">Login Now</a>
    </p>
    <p>We're glad to have you onboard!</p>
    <p>— Team Revive Wardrobe<br><a href="https://www.revivewardrobe.com">www.revivewardrobe.com</a></p>
  </div>
</body>
</html>
`;

export const EMAIL_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Verify Your Email - Revive Wardrobe</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F0F0F0; }
    .container { max-width: 500px; margin: 50px auto; background: #ffffff; padding: 30px; border-radius: 8px; }
    .otp-box {
      display: inline-block;
      background: #f5f5f5;
      color: #222;
      font-size: 1.5em;
      letter-spacing: 0.2em;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      margin: 16px 0;
      border: 1px dashed #FFA500;
      user-select: all;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Verify Your Email Address</h2>
    <p>Hi <strong>{{name}}</strong>,</p>
    <p>To complete your registration with Revive Wardrobe, please use the following OTP code:</p>
    <div class="otp-box">{{otp}}</div>
    <p>This code will expire in 10 minutes.</p>
    <p>Thanks,<br>Team Revive Wardrobe</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Reset Your Password - Revive Wardrobe</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F4F4F4; }
    .container { max-width: 500px; margin: 50px auto; background: #ffffff; padding: 30px; border-radius: 8px; }
    .otp-box {
      display: inline-block;
      background: #f5f5f5;
      color: #222;
      font-size: 1.5em;
      letter-spacing: 0.2em;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: bold;
      margin: 16px 0;
      border: 1px dashed #DC3545;
      user-select: all;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hi <strong>{{name}}</strong>,</p>
    <p>We received a request to reset your password. Use the OTP code below to set a new password:</p>
    <div class="otp-box">{{otp}}</div>
    <p>This code is valid for the next 10 minutes. If you didn't request this, please ignore this email.</p>
    <p>— Team Revive Wardrobe</p>
  </div>
</body>
</html>
`;

export const ORDER_STATUS_UPDATE_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Order Status Update - Revive Wardrobe</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F9F9F9; }
    .container { max-width: 500px; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; }
    .status-badge {
      display: inline-block;
      background: #c10000e6;
      color: #fff;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      margin: 10px 0;
    }
    .order-details {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 15px 0;
    }
    .tracking-link {
      display: inline-block;
      background: #28a745;
      color: #fff !important;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Order Status Update</h2>
    <p>Hi <strong>{{customerName}}</strong>,</p>
    <p>Your order has been updated!</p>
    
    <div class="order-details">
      <p><strong>Order ID:</strong> {{orderId}}</p>
      <p><strong>Status:</strong> <span class="status-badge">{{status}}</span></p>
      {{shipperInfo}}
      {{awbInfo}}
    </div>
    
    {{trackingSection}}
    
    <p>Thank you for shopping with us. If you have any questions, feel free to contact our support team.</p>
    <p>Best regards,<br>Team Revive Wardrobe<br><a href="https://www.revivewardrobe.com">www.revivewardrobe.com</a></p>
  </div>
</body>
</html>
`;

export const ORDER_CONFIRMATION_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Order Confirmation - Revive Wardrobe</title>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F9F9F9; }
    .container { max-width: 600px; margin: 50px auto; background: #fff; padding: 30px; border-radius: 8px; }
    .header { text-align: center; margin-bottom: 30px; }
    .order-summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e9ecef;
    }
    .order-item:last-child { border-bottom: none; }
    .item-details { flex: 1; }
    .item-name { font-weight: bold; margin-bottom: 5px; }
    .item-variant { color: #6c757d; font-size: 0.9em; }
    .item-price { font-weight: bold; color: #c10000e6; }
    .total-section {
      background: #e9ecef;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      margin: 5px 0;
    }
    .total-final {
      font-weight: bold;
      font-size: 1.2em;
      color: #c10000e6;
      border-top: 2px solid #c10000e6;
      padding-top: 10px;
      margin-top: 10px;
    }
    .address-section {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .track-button {
      display: inline-block;
      background: #c10000e6;
      color: #fff !important;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
      margin: 20px 0;
      text-align: center;
    }
    .footer { text-align: center; margin-top: 30px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Thank you for your order!</h1>
      <p>Hi <strong>{{customerName}}</strong>, your order has been confirmed and is being processed.</p>
    </div>
    
    <div class="order-summary">
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {{orderId}}</p>
      <p><strong>Order Date:</strong> {{orderDate}}</p>
      <p><strong>Payment Method:</strong> Paymennt</p>
      
      <h4>Items Ordered:</h4>
      {{orderItems}}
    </div>
    
    <div class="total-section">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>{{currency}} {{subtotal}}</span>
      </div>
      <div class="total-row">
        <span>Shipping:</span>
        <span>{{currency}} {{shipping}}</span>
      </div>
      <div class="total-row">
        <span>Tax:</span>
        <span>{{currency}} {{tax}}</span>
      </div>
      <div class="total-row total-final">
        <span>Total:</span>
        <span>{{currency}} {{total}}</span>
      </div>
    </div>
    
    <div class="address-section">
      <h4>Shipping Address:</h4>
      <p>
        {{customerName}}<br>
        {{address}}<br>
        {{city}}, {{country}}<br>
        Phone: {{phone}}
      </p>
    </div>
    
    <div style="text-align: center;">
      <a href="{{trackingLink}}" class="track-button">Track Your Order</a>
    </div>
    
    <p>We'll send you shipping confirmation when your items are on the way!</p>
    
    <div class="footer">
      <p>Thank you for choosing Revive Wardrobe!</p>
      <p>— Team Revive Wardrobe<br>
      <a href="https://www.revivewardrobe.com">www.revivewardrobe.com</a></p>
    </div>
  </div>
</body>
</html>
`;




