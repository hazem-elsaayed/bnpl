# BNPL Payment Plan Simulator

A full-stack Buy Now, Pay Later (BNPL) dashboard for merchants and users.

## Running the App with Docker

This project is fully dockerized and production-ready. All services (Django backend, React frontend, Celery worker/beat, Postgres, RabbitMQ) are orchestrated using Docker Compose.

### 1. Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

### 2. Environment Variables
Create a `.env` file in the project root with the following content (edit as needed):
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=1
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
POSTGRES_DB=bnpl
POSTGRES_USER=bnpluser
POSTGRES_PASSWORD=bnplpass
POSTGRES_HOST=db
POSTGRES_PORT=5432
CELERY_BROKER_URL=amqp://guest:guest@rabbitmq:5672//
CELERY_RESULT_BACKEND=rpc://
```

### 3. Build and Start All Services
```sh
docker-compose up --build
```
- The backend will be available at http://localhost:8000
- The frontend will be available at http://localhost:3000
- RabbitMQ management UI: http://localhost:15672 (user/pass: guest/guest)
- Postgres: localhost:5432

### 4. Create a Django Superuser (Admin)
In a new terminal, run:
```sh
docker-compose exec backend python manage.py createsuperuser
```
Follow the prompts to set up your admin account.

### 5. Add Merchant and User Accounts from Django Admin
1. Go to http://localhost:8000/admin and log in with your superuser credentials.
2. Click on **Users** in the sidebar.
3. Click **Add user** (top right).
4. Fill in the username, password, and email. Click **Save and continue editing**.
5. In the user edit form, set the **role** field to either `merchant` or `user` as needed.
6. Click **Save**.

Repeat for as many merchants and users as you need.

---

- All database migrations are run automatically when the backend container starts.
- Celery worker and beat are started automatically for background and scheduled tasks.
- Emails (e.g., payment reminders) are printed to the console by default.



## Security Considerations
- All API endpoints require JWT authentication.
- Users and merchants can only access their own plans and data (enforced by DRF permissions).
- JWT tokens are stored in localStorage (for demo; use httpOnly cookies in production).
- Paid installments cannot be edited.
- In production, use HTTPS and secure your secret keys.

## Trade-offs & Notes
- Date validation and edge cases are simplified for demo purposes.
- No registration flow; users/merchants are created via admin.


## License
MIT
