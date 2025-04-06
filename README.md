## API Documentation

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Hoagies

- `GET /hoagies` - Get paginated list of hoagies
- `POST /hoagies` - Create a new hoagie
- `GET /hoagies/:id` - Get hoagie details
- `PUT /hoagies/:id` - Update hoagie
- `DELETE /hoagies/:id` - Delete hoagie

### Comments

- `GET /hoagies/:id/comments` - Get comments for a hoagie
- `POST /hoagies/:id/comments` - Add a comment to a hoagie
- `DELETE /comments/:id` - Delete a comment

## Database Schema

### User
```typescript
{
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Features

- User authentication
- User validation