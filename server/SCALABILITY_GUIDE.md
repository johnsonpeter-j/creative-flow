# FastAPI + MongoDB Scalability Guide

## 10 Professional Instructions for Maintaining Scalable Code

### 1. **Implement Layered Architecture Pattern**
Organize your codebase into clear layers: **Routes → Services → Repositories → Models**
- **Routes** (`app/routes/`): Handle HTTP requests/responses, input validation
- **Services** (`app/services/`): Business logic and orchestration
- **Repositories** (`app/repositories/`): Database operations and data access
- **Models** (`app/models/`): Pydantic schemas and database models
- **Core** (`app/core/`): Configuration, database connections, dependencies

### 2. **Use Dependency Injection for Database Connections**
Create a reusable database dependency that manages MongoDB connections efficiently:
```python
# app/core/database.py
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    return db.client[settings.DATABASE_NAME]
```

### 3. **Implement Repository Pattern for Data Access**
Abstract database operations behind repository classes to enable easy testing and future database migrations:
- Create one repository per domain entity (e.g., `UserRepository`, `ProductRepository`)
- Keep all MongoDB queries within repositories
- Return domain models, not raw database documents

### 4. **Use Pydantic Models for Request/Response Validation**
Separate your models into:
- **Schemas** (`app/schemas/`): Request/response validation models
- **Database Models** (`app/models/`): MongoDB document structures
- Use `ConfigDict` for Pydantic v2 or `Config` class for v1 to handle MongoDB ObjectId serialization

### 5. **Implement Proper Error Handling Middleware**
Create centralized error handling:
- Custom exception classes in `app/core/exceptions.py`
- Global exception handler in `app/core/exception_handlers.py`
- Consistent error response format across all endpoints
- Proper HTTP status codes and error messages

### 6. **Use Environment-Based Configuration Management**
Store all configuration in environment variables:
- Create `app/core/config.py` using Pydantic `BaseSettings`
- Separate settings for development, staging, and production
- Never hardcode secrets, API keys, or database URLs
- Use `.env` files for local development (add to `.gitignore`)

### 7. **Implement Async/Await Throughout the Stack**
Leverage FastAPI's async capabilities:
- Use `async def` for all route handlers
- Use `motor` (async MongoDB driver) instead of synchronous `pymongo`
- Use `asyncio` for concurrent operations
- Avoid blocking I/O operations in async functions

### 8. **Create Modular Route Organization**
Group related endpoints using FastAPI routers:
- One router file per domain (e.g., `app/routes/auth.py`, `app/routes/users.py`)
- Include routers in main `app/main.py` with proper prefixes and tags
- Use dependency injection for shared dependencies (auth, database, etc.)
- Apply middleware at router or application level as needed

### 9. **Implement Database Indexing Strategy**
Optimize MongoDB queries with proper indexing:
- Create indexes for frequently queried fields
- Use compound indexes for multi-field queries
- Implement text indexes for search functionality
- Monitor slow queries and optimize accordingly
- Document all indexes in `app/core/database_indexes.py`

### 10. **Set Up Comprehensive Logging and Monitoring**
Implement structured logging and monitoring:
- Use Python's `logging` module with proper log levels
- Log all important operations (requests, errors, database queries)
- Implement request ID tracking for distributed tracing
- Set up health check endpoints (`/health`, `/ready`)
- Monitor database connection pool, response times, and error rates
- Use tools like Prometheus, Grafana, or application-specific monitoring

---

## Recommended Folder Structure

```
server/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration management
│   │   ├── database.py        # Database connection
│   │   ├── exceptions.py      # Custom exceptions
│   │   ├── exception_handlers.py  # Global exception handlers
│   │   └── security.py        # Authentication/authorization
│   ├── models/
│   │   ├── __init__.py
│   │   └── *.py               # MongoDB document models
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── *.py               # Pydantic request/response schemas
│   ├── repositories/
│   │   ├── __init__.py
│   │   └── *.py               # Data access layer
│   ├── services/
│   │   ├── __init__.py
│   │   └── *.py               # Business logic layer
│   ├── routes/
│   │   ├── __init__.py
│   │   └── *.py               # API route handlers
│   └── utils/
│       ├── __init__.py
│       └── *.py               # Helper functions
├── tests/
│   ├── __init__.py
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── .env.example
├── .gitignore
├── requirements.txt
├── README.md
└── SCALABILITY_GUIDE.md
```

---

## Additional Best Practices

- **Version Control**: Use semantic versioning and maintain a `CHANGELOG.md`
- **Code Quality**: Use `black`, `flake8`, `mypy` for code formatting and type checking
- **Testing**: Maintain >80% test coverage with unit and integration tests
- **Documentation**: Use FastAPI's automatic OpenAPI/Swagger documentation
- **API Versioning**: Implement versioning strategy (e.g., `/api/v1/`)
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Caching**: Use Redis for caching frequently accessed data
- **Background Tasks**: Use Celery or FastAPI BackgroundTasks for async operations

