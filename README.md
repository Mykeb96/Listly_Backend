# Listly Backend API

A robust RESTful API backend built with NestJS for managing listings, users, categories, and messages. This application provides a scalable foundation for a marketplace or listing platform.

## 🚀 Features

- **User Management**: Create, read, update, and delete users
- **Listings Management**: Full CRUD operations for product/service listings
- **Category System**: Organize listings with categories
- **Messaging System**: User-to-user messaging functionality
- **Rate Limiting**: Built-in protection against API abuse (10 requests per 60 seconds)
- **Input Validation**: Automatic request validation using DTOs
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
- **Type Safety**: Full TypeScript support with Prisma ORM

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11.0.1)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: class-validator, class-transformer
- **Rate Limiting**: @nestjs/throttler

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 or higher)
- [Prisma CLI](https://www.prisma.io/docs/getting-started/installation) (included as dev dependency)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Listly_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/listly_db?schema=public"
   PORT=4000
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

## 🚀 Running the Application

### Development Mode

Start the application in watch mode (auto-reload on file changes):

```bash
npm run start:dev
```

The API will be available at `http://localhost:4000` (or the port specified in your `.env` file).

### Production Mode

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start:prod
   ```

### Other Commands

```bash
# Start without watch mode
npm run start

# Start in debug mode
npm run start:debug

# Format code
npm run format

# Lint code
npm run lint
```

## 📚 API Endpoints

### Users

- `GET /users` - Get all users
- `GET /users?id={id}` - Get user by ID
- `POST /users` - Create a new user
- `PUT /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user

### Listings

- `GET /listings` - Get all listings
- `GET /listings?id={id}` - Get listing by ID
- `GET /listings?user={userId}` - Get listings by user
- `GET /listings?category={categoryName}` - Get listings by category
- `POST /listings` - Create a new listing
- `PUT /listings/:id` - Update a listing
- `DELETE /listings/:id` - Delete a listing

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create a new category
- `DELETE /categories/:id` - Delete a category

### Messages

- `GET /messages?sender={senderId}` - Get messages by sender
- `GET /messages?sender={senderId}&recipient={recipientId}` - Get messages between users
- `POST /messages` - Create a new message
- `DELETE /messages/:id` - Delete a message

## 🔒 Rate Limiting

The API implements rate limiting to protect against abuse:

- **Limit**: 10 requests per 60 seconds per IP address
- **Response**: HTTP 429 (Too Many Requests) when limit is exceeded
- **Window**: Sliding window based on first request timestamp

To customize rate limits, modify the configuration in `src/app.module.ts`:

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000, // Time window in milliseconds
  limit: 10,  // Maximum requests per window
}]),
```

## 📁 Project Structure

```
src/
├── app.module.ts          # Root application module
├── main.ts                # Application entry point
├── prisma.service.ts      # Prisma database service
├── users/                 # User module
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── listings/              # Listing module
│   ├── listings.controller.ts
│   ├── listings.service.ts
│   └── dto/
├── categories/            # Category module
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
└── messages/             # Message module
    ├── messages.controller.ts
    ├── messages.service.ts
    └── dto/
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 🗄️ Database Management

### Prisma Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate
```

## ⚠️ Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email)
- `429` - Too Many Requests (rate limit exceeded)

## 🔐 Security Features

- Input validation on all endpoints
- Rate limiting to prevent abuse
- SQL injection protection (via Prisma ORM)
- Type-safe database queries

## 📄 License

This project is private and unlicensed.

## 🤝 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## 📞 Support

For NestJS-related questions:
- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)

---

Built with ❤️ using NestJS
