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
      background: #4C83EE;
      color: #fff;
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




