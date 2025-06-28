# 🛒 E-Commerce Platform - Project README


## ✅ TODO - In Progress

### 🧮 Stock Management
- [ ] **Reduce Stock on Order**
  - Implement logic to reduce stock based on selected **product size**
  - Show out-of-stock status for unavailable sizes



---

## 🚀 Planned Features (Future Updates)

- [ ] **Google Login Support**
  - OAuth 2.0 sign-in with Google for faster user access

- [ ] **OTP and Email Verification**
  - Secure sign-up/login with email/OTP verification

- [ ] **Forgot Password**
  - Reset password flow via email or OTP

- [ ] **Custom Chatbot + WhatsApp Integration**
  - In-app support using chatbot
  - WhatsApp message automation for order updates

---

## 🛠 Tech Stack

- **Frontend**: React.js / Tailwind CSS  
- **Backend**: Node.js / Express.js / MongoDB  
- **Payment**: Razorpay  
- **Authentication**: JWT / Google OAuth (planned)


sample product json
{
  "product": {
    "name": "Zainab Chottani – Lawn Suit",
    "description": "Elegant lawn suit with intricate embroidery.",
    "category": "Ethnic Elegance",
    "sub_category": "Lawn Suit",
    "brand": "Zainab",
    "currency": "AED",
    "lead_time": "24",
    "replenishment_period": "48",
    "hs_code": "6109",
    "country": "India",
    "tax": "5%",
    "filter_name": ["Size"],
    "variants": [
      {
        "sku": "zainab-lawn-xs",
        "barcode": "123456789012",
        "retail_price": 3400,
        "discount": 0,
        "weight_unit": "Kg",
        "filter_value": ["XS"],
        "min_order_quantity": 1
      },
      {
        "sku": "zainab-lawn-m",
        "barcode": "123456789013",
        "retail_price": 3400,
        "discount": 0,
        "weight_unit": "Kg",
        "filter_value": ["M"],
        "min_order_quantity": 1
      }
    ]
  }
}

