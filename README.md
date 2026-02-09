# Speaker Availability Management System

A MERN stack application for managing speaker availability across different categories (Weekly Speakers, ICA Speakers, etc.). Users can view speaker information and update their availability for programs, while administrators have full control over pages and speakers.

## Features

### User Features
- 🔐 User authentication (Login/Register)
- 📋 View multiple speaker categories (pages)
- 👥 View speaker details (Name, Area, Phone Number, Availability)
- 📅 Schedule speakers for programs by setting date and time
- ✅ Mark speakers as available after programs
- 🔒 Speakers are locked to prevent double-booking

### Admin Features
- 👑 Full administrative control (first registered user becomes admin)
- ➕ Add/Remove speaker categories (pages)
- ➕ Add/Remove individual speakers
- ✏️ Edit speaker information
- 📊 Manage all aspects of the system

### Security & Compliance
- ⚠️ Built-in disclaimer to prevent misuse
- 🔐 JWT-based authentication
- 🛡️ Role-based access control (Admin vs Regular Users)
- 📝 Activity tracking (who locked which speaker)

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- Context API for state management

## Project Structure

```
speaker-availability-app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Page.js               # Page/Category model
│   │   └── Speaker.js            # Speaker model
│   ├── middleware/
│   │   └── auth.js               # Authentication middleware
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── pages.js              # Page routes
│   │   └── speakers.js           # Speaker routes
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Main server file
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js          # Login/Register component
    │   │   ├── Dashboard.js      # Main dashboard
    │   │   ├── SpeakerList.js    # Speaker list view
    │   │   ├── SpeakerCard.js    # Individual speaker card
    │   │   ├── AddSpeakerModal.js # Modal for adding speakers
    │   │   └── PrivateRoute.js   # Protected route component
    │   ├── context/
    │   │   └── AuthContext.js    # Authentication context
    │   ├── services/
    │   │   └── api.js            # API service layer
    │   ├── styles/
    │   │   ├── Auth.css
    │   │   ├── Dashboard.css
    │   │   ├── SpeakerList.css
    │   │   └── SpeakerCard.css
    │   ├── App.js
    │   ├── App.css
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from the template:
```bash
cp .env.example .env
```

4. Update the `.env` file with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/speaker-availability
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file if you need to change the API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the frontend development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Usage Guide

### First Time Setup

1. **Start both servers** (backend and frontend)
2. **Register the first user** - This user will automatically become the admin
3. **Create speaker categories** (e.g., "Weekly Speakers", "ICA Speakers")
4. **Add speakers** to each category

### For Regular Users

1. **Login** with your credentials
2. **Select a category** from the dashboard
3. **View available speakers**
4. **Schedule a program**:
   - Click "Schedule Program" on an available speaker
   - Enter the program date and time
   - Click "Confirm Schedule"
5. **Mark speaker available** after the program is complete

### For Administrators

All regular user features, plus:
- **Add Categories**: Click "Add Category" on the dashboard
- **Delete Categories**: Click "Delete" on any category card (only if empty)
- **Add Speakers**: Click "Add Speaker" in any category
- **Delete Speakers**: Click "Delete" on any speaker card
- **Edit Speakers**: Update speaker information

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pages (Categories)
- `GET /api/pages` - Get all pages
- `POST /api/pages` - Create page (admin only)
- `PUT /api/pages/:id` - Update page (admin only)
- `DELETE /api/pages/:id` - Delete page (admin only)

### Speakers
- `GET /api/speakers` - Get all speakers (filter by pageId)
- `GET /api/speakers/:id` - Get single speaker
- `POST /api/speakers` - Create speaker (admin only)
- `PUT /api/speakers/:id` - Update speaker (admin only)
- `PATCH /api/speakers/:id/availability` - Update availability
- `DELETE /api/speakers/:id` - Delete speaker (admin only)

## Database Schema

### User
```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  isAdmin: Boolean (default: false),
  timestamps: true
}
```

### Page
```javascript
{
  name: String (required, unique),
  order: Number (default: 0),
  timestamps: true
}
```

### Speaker
```javascript
{
  name: String (required),
  area: String (required),
  phoneNumber: String (required),
  pageId: ObjectId (ref: Page, required),
  availability: {
    isAvailable: Boolean (default: true),
    programDate: Date,
    programTime: String,
    lockedBy: ObjectId (ref: User),
    lockedAt: Date
  },
  timestamps: true
}
```

## Important Notes

### Disclaimer Guidelines
The system displays important disclaimers to users:
- ⚠️ Update availability ONLY if speaker is confirmed
- ⚠️ Do NOT update your name to avoid being a speaker
- ⚠️ All changes are tracked and logged
- ⚠️ Violations may result in disciplinary action

### Security Features
- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Authentication required for all speaker operations
- Admin-only routes protected by middleware
- Activity tracking (who locked which speaker)

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

**Backend:**
```bash
cd backend
# Set NODE_ENV=production in .env
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For MongoDB Atlas, whitelist your IP address

### CORS Issues
- Backend CORS is enabled for all origins in development
- For production, update CORS settings in `server.js`

### Authentication Issues
- Clear browser localStorage
- Check JWT_SECRET is set in `.env`
- Verify token expiration hasn't occurred

## Future Enhancements

- [ ] Email notifications for scheduled programs
- [ ] Calendar view of speaker schedules
- [ ] Speaker availability patterns/recurring programs
- [ ] Export speaker data to Excel/PDF
- [ ] Advanced filtering and search
- [ ] Mobile app version
- [ ] SMS notifications

## License

This project is created for internal organizational use.

## Support

For issues or questions, please contact the system administrator.
