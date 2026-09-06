# SpaceHeaven

A full-stack property listing platform built with Node.js, Express, MongoDB and EJS.

SpaceHeaven allows users to discover stays, create their own listings, upload property images, and leave reviews. The project focuses on implementing a complete backend workflow with authentication, authorization, database relationships, sessions, validation and cloud image storage.

## Live Demo

**Primary deployment:**
https://space-heaven.vercel.app/listings

**Alternative deployment:**
https://spaceheaven.onrender.com/listings

---

## Features

### Listings

* Browse available properties
* View detailed listing information
* Create new listings
* Edit existing listings
* Delete listings
* Listing ownership checks
* Search by title, location and country

### Authentication

* User registration
* Login and logout
* Password authentication with Passport
* Persistent sessions
* Protected routes

### Reviews

* Add reviews to listings
* Rating system
* Display reviews with listing details
* Review author authorization
* Delete reviews

### Images

* Upload listing images
* Image processing through Multer
* Cloud storage using Cloudinary
* Store image URL and filename in MongoDB

### UI

* Responsive Bootstrap layout
* Search bar
* Listing cards
* Category filters
* Flash notifications
* Responsive navigation

---

## Tech Stack

| Category       | Technologies                           |
| -------------- | -------------------------------------- |
| Frontend       | EJS, Bootstrap, CSS, JavaScript        |
| Backend        | Node.js, Express.js                    |
| Database       | MongoDB, Mongoose, MongoDB Atlas       |
| Authentication | Passport.js, Passport Local Mongoose   |
| Image Storage  | Cloudinary                             |
| File Upload    | Multer                                 |
| Validation     | Joi                                    |
| Sessions       | Express Session, Connect-Mongo         |
| Templating     | EJS, EJS-Mate                          |
| Other          | Method Override, Connect Flash, Dotenv |

---

## Architecture

The application follows an MVC-style structure:

```text
Client
  │
  ▼
Express Routes
  │
  ▼
Middleware
  │
  ├── Authentication
  ├── Authorization
  └── Validation
  │
  ▼
Controllers
  │
  ▼
Mongoose Models
  │
  ▼
MongoDB Atlas
```

Listing images follow a separate upload flow:

```text
Form
  │
  ▼
Multer
  │
  ▼
Cloudinary
  │
  ▼
Image URL + Filename
  │
  ▼
MongoDB
```

---

## Project Structure

```text
SpaceHeaven/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   │   └── boilerplate.ejs
│   │
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   └── show.ejs
│   │
│   ├── reviews/
│   └── users/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│   ├── ExpressError.js
│   └── wrapAsync.js
│
├── middleware.js
├── schema.js
├── cloudConfig.js
├── app.js
├── package.json
├── package-lock.json
└── .env
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MongoDB Atlas account
* Cloudinary account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/space-heaven.git
cd space-heaven
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SESSION_SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

PORT=8080
```

Do not commit the `.env` file to GitHub.

### 4. Start the application

```bash
npm start
```

For development with Nodemon:

```bash
npx nodemon app.js
```

The application will run on:

```text
http://localhost:8080
```

---

## Database Models

### User

Used for authentication and user accounts.

```text
User
 ├── username
 └── authentication data
```

### Listing

```text
Listing
 ├── title
 ├── description
 ├── price
 ├── location
 ├── country
 ├── image
 ├── owner
 └── reviews
```

### Review

```text
Review
 ├── comment
 ├── rating
 ├── author
 └── listing
```

Listings reference their owners and reviews, while reviews reference both their author and the listing they belong to.

---

## Authentication & Authorization

Passport.js is used for authentication.

Protected routes check whether a user is logged in before allowing actions such as creating a listing or submitting a review.

Authorization middleware also checks resource ownership.

For example:

```text
User
 │
 ├── Own Listing ──────► Edit / Delete
 │
 └── Other Listing ────► View
```

This prevents users from modifying listings that do not belong to them.

---

## Validation

Joi is used for server-side validation.

Validation is performed before saving listing and review data to MongoDB.

This prevents invalid or incomplete data from reaching the database.

---

## Sessions

User sessions are handled using:

* Express Session
* Connect-Mongo
* MongoDB Atlas

Sessions are stored in MongoDB rather than relying only on the server's memory.

---

## Image Uploads

Listing images are uploaded using Multer and stored on Cloudinary.

Only the image reference is stored in MongoDB:

```js
{
    url: "...",
    filename: "..."
}
```

This keeps the database from storing the actual image files.

---

## Search

The listings page supports destination-based searching.

Example:

```text
/listings?search=Delhi
```

Search can be performed against listing information such as:

* Title
* Location
* Country

---

## Error Handling

The application uses a custom `ExpressError` class for structured application errors.

Asynchronous controllers are wrapped using `wrapAsync` so rejected promises are passed to the central Express error handler.

```text
Route
  │
  ▼
Controller
  │
  ├── Success ──► Response
  │
  └── Error ────► Error Handler
```

---

## Security

The application uses several layers of protection:

* Authentication for protected routes
* Authorization for resource ownership
* Server-side validation
* Environment variables for credentials
* MongoDB-backed sessions
* HTTP-only session cookies

Sensitive credentials should never be committed to the repository.

---

## Screenshots

Add screenshots of the application here when publishing the repository.

Recommended screenshots:

1. Home / Listings page
2. Listing details
3. Create listing page
4. Login page
5. Review section
6. Mobile responsive view

Example:

```md
![Listings](./screenshots/listings.png)
```

---

## Future Improvements

Some features planned for future versions:

* Booking and reservation system
* Availability calendar
* Interactive maps
* Wishlist / favorites
* Payment integration
* Advanced filters
* User profile pages
* Owner dashboard
* Email notifications
* Improved recommendation system

---

## What I Learned

Building SpaceHeaven gave me practical experience with:

* Building RESTful Express applications
* MVC architecture
* MongoDB relationships
* Mongoose population
* Authentication with Passport
* Authorization middleware
* Session management
* CRUD operations
* File uploads
* Cloudinary integration
* Server-side validation
* Error handling
* EJS templating
* Deployment

---

## Deployment

The application has been deployed using both Vercel and Render.

**Live:**
https://space-heaven.vercel.app/listings

**Render:**
https://spaceheaven.onrender.com/listings

Environment variables are configured separately for deployed environments.

---

## Author

### Harshvardhan Singh

Computer Science student and full-stack web developer.

Interested in:

* Full-stack development
* Backend engineering
* Open source
* Machine Learning
* Problem solving

---

## License

This project was created for learning and portfolio purposes.
