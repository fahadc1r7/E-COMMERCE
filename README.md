# Wanderlust Tours — Auth Portal

A responsive Sign Up / Sign In web application with JavaScript form validation, password visibility toggle, and client-side authentication. Built as an assignment project using HTML, CSS3, and vanilla JavaScript.

## Live Demo

- **GitHub Pages:** _(update after deployment)_

## Features

- **Sign Up page** with Full Name, Email, Phone, Location/City, Password, and Confirm Password
- **Sign In page** with Email and Password
- Real-time inline validation with color indicators (red/green borders)
- Show/hide password toggle on all password fields
- Only registered users can sign in; credentials must match signup data
- Successful sign-in redirects to the Tourist Landing Page
- Responsive layout using CSS Grid & Flexbox with media queries:
  - Mobile: ≤768px
  - Tablet: 769–1024px
  - Desktop: >1024px

## Validation Rules

| Field | Rule |
|-------|------|
| Full Name | Required, min 2 characters |
| Email | Required, valid format (e.g. example@mail.com) |
| Phone | Required, exactly 10 digits |
| Location/City | Required, alphabets only |
| Password | Required, min 8 chars, letters + numbers |
| Confirm Password | Must match password |

## Project Structure

```
tourist-auth-portal/
├── index.html          # Redirects to signup
├── signup.html         # Registration page
├── signin.html         # Login page
├── landing.html        # Tourist landing page (protected)
├── css/
│   └── styles.css      # Shared responsive styles
└── js/
    ├── auth.js         # Auth utilities & validators
    ├── signup.js       # Signup form logic
    ├── signin.js       # Signin form logic
    └── landing.js      # Landing page logic
```

## Getting Started

1. Clone the repository
2. Open `signup.html` in a browser (or use a local server)
3. Create an account, then sign in to reach the landing page

> **Note:** User data is stored in `localStorage` for demo purposes. Clearing browser data will remove registered accounts.

## GitHub Pages Deployment

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch: main / (root)**
4. Save and wait for the live URL

## License

MIT
