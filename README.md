## Description

Assessment project - Event Ticket Booking App.

## Project Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm (v8 or higher)

### Installation Steps

1. Set up environment variables by creating a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=event_ticket_booking
DB_SCHEMA=event_booking_2
DB_SSL_ENABLED=false
```

2. Install dependencies:
```bash
npm install
```

3. Database Setup (in order):
```bash
# Drop existing schema (if exists)
npm run schema:drop

# Create new schema
npm run schema:create

# Run migrations
npm run migration:run

# Seed the database with initial data
npm run db:seed
```

4. Start the Development Server:
```bash
# Clean the dist folder
rm -rf dist

# Start the server in development mode
npm run start:dev
```

The GraphQL server will be available at: http://localhost:3000/graphql

## Project Structure
```
src/
├── bookings/         # Bookings module
├── events/           # Events module
├── users/            # Users module
├── database/         # Database configuration and migrations
│   ├── migrations/   # Database migrations
│   └── seeds/        # Seed data
├── common/           # Shared code and utilities
└── schema.gql        # Generated GraphQL schema
```

## Database Schema

The application uses PostgreSQL with the following main tables:
- users: Store user information
- events: Store event details
- bookings: Store booking records

For detailed schema information, check the migrations in `src/database/migrations/`.

## API Documentation

Visit the GraphQL Playground at http://localhost:3000/graphql when the server is running to explore the API.

### Queries

Get all users:
```graphql
query Users($pagination: PaginationInput) {
  users(pagination: $pagination) {
    items {
      id
      username
      email
      bookings {
        id
        numberOfTickets
      }
    }
    total
    page
    limit
  }
}
```

Get single user:
```graphql
query User($id: ID!) {
  user(id: $id) {
    id
    username
    email
    bookings {
      id
      numberOfTickets
      event {
        title
        date
      }
    }
  }
}
```

Get user's bookings:
```graphql
query UserBookings($filter: BookingFilterInput, $pagination: PaginationInput) {
  bookings(filter: $filter, pagination: $pagination) {
    items {
      id
      numberOfTickets
      createdAt
      event {
        id
        title
        date
        location
        price
      }
    }
    total
    page
    limit
  }
}

# Variables:
{
  "filter": {
    "userId": "user-uuid"
  },
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

Get all events:
```graphql
query Events($pagination: PaginationInput) {
  events(pagination: $pagination) {
    items {
      id
      title
      description
      date
      location
      availableTickets
      totalTickets
      price
    }
    total
    page
    limit
  }
}
```

Get single event:
```graphql
query Event($id: ID!) {
  event(id: $id) {
    id
    title
    description
    date
    location
    availableTickets
    totalTickets
    price
    bookings {
      id
      numberOfTickets
      user {
        username
      }
    }
  }
}
```

Get single booking:
```graphql
query Booking($id: ID!) {
  booking(id: $id) {
    id
    numberOfTickets
    createdAt
    user {
      id
      username
      email
    }
    event {
      id
      title
      date
      location
      price
      availableTickets
    }
  }
}
```

### Mutations

Create booking:
```graphql
mutation CreateBooking($userId: ID!, $input: CreateBookingInput!) {
  createBooking(userId: $userId, input: $input) {
    id
    numberOfTickets
    createdAt
    event {
      id
      title
      availableTickets
      price
    }
    user {
      id
      username
    }
  }
}

# Variables:
{
  "userId": "user-uuid",
  "input": {
    "eventId": "event-uuid",
    "numberOfTickets": 2
  }
}
```

### Filtering & Pagination

Bookings with filters:
```graphql
query FilteredBookings($filter: BookingFilterInput, $pagination: PaginationInput) {
  bookings(
    filter: { 
      userId: "user-uuid",
      eventId: "event-uuid",
      createdFrom: "2024-01-01",
      createdTo: "2024-12-31"
    },
    pagination: { 
      page: 1, 
      limit: 10 
    }
  ) {
    items {
      id
      numberOfTickets
      createdAt
      event {
        title
        price
      }
    }
    total
    page
    limit
  }
}
```

## Architecture

The application follows a modular architecture based on NestJS framework principles:

### Core Components

1. **Module Layer**
   - Separate modules for events, bookings, and users
   - Each module is self-contained with its own services, resolvers, and entities
   - Clear separation of concerns following Domain-Driven Design principles

2. **Data Layer**
   - TypeORM for database interactions
   - Repository pattern for data access
   - Migrations for version-controlled schema changes
   - Optimistic locking for concurrent booking operations

3. **API Layer**
   - GraphQL API using code-first approach
   - Type-safe resolvers and input validation
   - Pagination and filtering support

4. **Business Logic Layer**
   - Service layer handling complex operations
   - Transaction management for booking operations
   - Event ticket availability checks
   - Concurrent booking handling

### Key Design Decisions

- Used PostgreSQL for ACID compliance and transaction support
- Implemented optimistic locking for ticket bookings
- Chose GraphQL for flexible data fetching and reduced over-fetching
- Modular architecture for maintainability and scalability

## Future Improvements

Several areas could be enhanced in future iterations:

1. **Authentication & Authorization**
   - Implement JWT-based authentication
   - Role-based access control
   - Session management
   - OAuth2 integration

2. **Performance & Scalability**
   - Implement caching layer (Redis)
   - Query optimization
   - Connection pooling
   - Response compression
   - Horizontal scaling capabilities
   - Load balancing configuration

3. **Message Queue System**
   - Implement RabbitMQ/Apache Kafka for event-driven architecture
   - Asynchronous ticket processing
   - Distributed task scheduling
   - Event sourcing for booking history
   - Dead letter queues for failed operations

4. **Business Features**
   - Payment integration
   - Ticket QR code generation
   - Email notifications
   - Waitlist functionality
   - Ticket transfer between users
   - Dynamic pricing system
   - Bulk booking handling

5. **Resilience & Fault Tolerance**
   - Circuit breaker implementation
   - Retry mechanisms
   - Rate limiting
   - Fallback strategies
   - Error recovery procedures
   - Service health monitoring

6. **Infrastructure**
   - Docker containerization
   - Kubernetes orchestration
   - CI/CD pipeline
   - Monitoring and logging (ELK Stack)
   - Auto-scaling configuration
   - Multi-region deployment

7. **Testing & Quality**
   - Increase test coverage
   - Load testing
   - Integration tests
   - E2E testing
   - Performance benchmarking
   - Security penetration testing
