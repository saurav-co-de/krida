# 🏏 KRIDA - Sports Venue Booking Platform

A professional full-stack web application for booking sports turfs and venues including Cricket, Badminton, Tennis, and Football.

## 🌟 Features

### User Features
- ✅ Browse turfs by sport category
- ✅ Search and filter turfs by name, location, or sport
- ✅ View detailed turf information with images and facilities
- ✅ Real-time availability checking
- ✅ Date and time slot selection
- ✅ Instant booking confirmation
- ✅ View and manage bookings
- ✅ Cancel bookings (up to 2 hours before)
- ✅ Responsive design for mobile, tablet, and desktop

### Technical Features
- ✅ Modern React frontend with Tailwind CSS
- ✅ RESTful API backend with Express.js
- ✅ Real-time data validation
- ✅ Toast notifications for user feedback
- ✅ Professional UI with animations
- ✅ File-based data storage (easily upgradable to database)

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **UUID** - Unique ID generation
- **CORS** - Cross-origin requests
- **File System** - JSON-based storage

## 📋 Prerequisites

Before installation, ensure you have:
- **Node.js** (version 14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- A modern web browser

## 🚀 Installation & Setup

### Step 1: Extract the ZIP file
Extract the `turf-booking-app.zip` file to your desired location.

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ▶️ Running the Application

### Option 1: Manual Start (Recommended for first time)

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```
The frontend will automatically open in your browser at `http://localhost:3000`

### Option 2: Using the Start Script

**On Windows:**
```bash
start-app.bat
```

**On Mac/Linux:**
```bash
chmod +x start-app.sh
./start-app.sh
```

## 📱 Using the Application

1. **Browse Turfs**: Navigate to the home page and explore available turfs
2. **Filter by Sport**: Click on sport categories or use the filter dropdown
3. **Search**: Use the search bar to find specific turfs by name or location
4. **View Details**: Click on any turf to see detailed information
5. **Book a Slot**: 
   - Click "Book Now"
   - Select your preferred date
   - Choose an available time slot
   - Fill in your contact details
   - Confirm booking
6. **View Bookings**: Go to "My Bookings" and enter your email to see all bookings
7. **Cancel Booking**: Click cancel on any confirmed upcoming booking

## 📁 Project Structure

```
krida-app/
├── backend/
│   ├── data/              # JSON data files (auto-generated)
│   │   ├── turfs.json     # Turf information
│   │   └── bookings.json  # Booking records
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
│
└── frontend/
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── components/    # Reusable components
    │   │   ├── Navbar.js
    │   │   └── Footer.js
    │   ├── pages/         # Page components
    │   │   ├── Home.js
    │   │   ├── TurfList.js
    │   │   ├── TurfDetail.js
    │   │   ├── Booking.js
    │   │   └── MyBookings.js
    │   ├── src/assets/    # Images and logos
    │   │   └── logo.png   # KRIDA Logo
    │   ├── services/      # API services
    │   │   └── api.js
    │   ├── App.js         # Main app component
    │   ├── index.js       # Entry point
    │   └── index.css      # Global styles
    └── package.json       # Frontend dependencies
```

## 🔧 Configuration

### Backend Port
Default: `5000`
To change, edit `backend/server.js`:
```javascript
const PORT = 5000; // Change to desired port
```

### Frontend API URL
Default: `http://localhost:5000/api`
To change, create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📊 API Endpoints

### Turfs
- `GET /api/turfs` - Get all turfs (supports ?sport and ?search params)
- `GET /api/turfs/:id` - Get single turf
- `GET /api/turfs/:id/availability?date=YYYY-MM-DD` - Get availability

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings (supports ?email param)
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Stats
- `GET /api/stats` - Get platform statistics

## 🎨 Customization

### Adding New Turfs
Edit `backend/data/turfs.json` or modify the initial data in `backend/server.js`

### Changing Colors
Edit `frontend/tailwind.config.js` to modify the color scheme

### Adding New Sports
1. Add new sport category in `backend/server.js` initial data
2. Update sport filters in frontend components

## 🔄 What You Need to Do Manually

### Essential Tasks:
1. ✅ **Install Node.js** - Download from nodejs.org
2. ✅ **Run npm install** - In both backend and frontend directories
3. ✅ **Start both servers** - Backend on port 5000, frontend on port 3000

### Optional Enhancements:
1. **Database Integration**:
   - Replace JSON file storage with MongoDB, PostgreSQL, or MySQL
   - Update the API service methods in `backend/server.js`

2. **Payment Integration**:
   - Add Stripe, Razorpay, or PayPal for online payments
   - Implement payment gateway in booking flow

3. **User Authentication**:
   - Add JWT-based authentication
   - Implement user registration and login
   - Add user profiles

4. **Email Notifications**:
   - Integrate SendGrid or Nodemailer
   - Send booking confirmations via email
   - Send reminders before booking time

5. **Image Upload**:
   - Implement image upload for turfs
   - Use AWS S3 or Cloudinary for storage

6. **Admin Panel**:
   - Create admin dashboard
   - Add CRUD operations for turfs
   - View all bookings and analytics

7. **Reviews & Ratings**:
   - Allow users to rate and review turfs
   - Display average ratings

8. **Advanced Search**:
   - Add price range filter
   - Add rating filter
   - Add location-based search with maps

9. **Calendar Integration**:
   - Export bookings to Google Calendar
   - iCal download option

10. **Deployment**:
    - Deploy backend to Heroku, AWS, or DigitalOcean
    - Deploy frontend to Vercel, Netlify, or AWS S3
    - Set up custom domain
    - Configure environment variables

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (Backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### npm install fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### React app doesn't start
```bash
# Delete node_modules in frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Contact: support@krida.com

## 🎯 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Loyalty programs
- [ ] Group booking discounts
- [ ] Equipment rental integration
- [ ] Weather-based recommendations

---

Built with ❤️ for sports enthusiasts
