# Setup Instructions
git clone https://github.com/AdarshBelnekar/Highway-Delite-Assignment/


## Backend
```bash
 cd backend
 npm install 
```
## Run the backend server and frontend also
```bash
 npm run dev
```
By default, backend runs at: http://localhost:5000

## Frontend
```bash
 cd frontend
 npm install 
```
Frontend runs at: http://localhost:5173
### .env file
-PORT=5000

-MONGO_URI=your_mongodb_connection_string

-EMAIL_USER=your_gmail_email

-EMAIL_PASS=your_gmail_app_password

-JWT_SECRET=your_jwt_secret

 ## API Endpoints
### API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| POST   | `/api/auth/send-otp`  | Send OTP to email            |
| POST   | `/api/auth/verify-otp`| Verify OTP and return JWT    |
| POST	 | `/api/notes	`          | Create a new note          |
| GET 	 | `/api/notes	`          | Get all notes for authenticated user          |
|DELETE	 | `/api/notes/:id`|	Delete a specific note by|







