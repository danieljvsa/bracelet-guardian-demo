# Bracelet Guardian Demo

A wearable IoT monitoring platform designed to bridge smart bracelet devices and web administration systems, enabling real-time tracking, alert management, and centralized device supervision.

---

## Overview

Bracelet Guardian Demo is a proof-of-concept platform that acts as an intermediary between wearable bracelet devices and a web-based administration interface.

The system receives data from connected devices, processes and stores it, and exposes APIs that allow administrators to monitor bracelet activity, manage users, and respond to alerts.

This project demonstrates the integration of:

* IoT devices
* REST APIs
* Real-time monitoring
* PostgreSQL persistence
* SMS notifications
* Containerized deployment

---

## Key Features

### Device Communication

* Receive data from wearable bracelet devices
* Process and validate incoming information
* Centralized communication layer

### Monitoring & Management

* User and bracelet management
* Device status monitoring
* Historical data storage
* Activity tracking

### Notifications

* SMS alert integration through Twilio
* Event-driven notifications
* Emergency communication workflows

### Infrastructure

* RESTful API architecture
* PostgreSQL database
* Dockerized deployment
* Environment-based configuration

---

## Architecture

```text
+--------------------+
| Smart Bracelet     |
+---------+----------+
          |
          v
+--------------------+
| Bracelet Guardian  |
| API                |
+---------+----------+
          |
          +------------------+
          |                  |
          v                  v
+----------------+   +----------------+
| PostgreSQL     |   | Twilio SMS     |
| Data Storage   |   | Notifications  |
+----------------+   +----------------+
          |
          v
+--------------------+
| Web Administration |
| Dashboard          |
+--------------------+
```

---

## Technology Stack

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL
* Knex.js

### Notifications

* Twilio

### Infrastructure

* Docker
* Docker Compose

---

## Use Cases

### Elderly Monitoring

Track activity and send alerts when abnormal situations occur.

### Lone Worker Safety

Monitor workers operating in remote or hazardous environments.

### Healthcare Monitoring

Receive bracelet-generated events and trigger notifications.

### Educational Demonstration

Showcase IoT-to-cloud communication patterns and wearable integrations.

---

## Project Structure

```text
bracelet-guardian-demo/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── database/
│   └── integrations/
├── migrations/
├── docker/
├── knexfile.js
├── package.json
└── README.md
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/danieljvsa/bracelet-guardian-demo.git

cd bracelet-guardian-demo
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

Create a `.env` file:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bracelet_guardian
DB_USER=postgres
DB_PASSWORD=password

TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_number
```

### Configure Database

Update `knexfile.js` if required.

Run migrations:

```bash
npx knex migrate:latest
```

### Start Application

```bash
npm start
```

The API will be available at:

```text
http://localhost:3000
```

---

## Docker Deployment

Build image:

```bash
docker build -t bracelet-guardian-demo .
```

Run container:

```bash
docker run -p 3000:3000 bracelet-guardian-demo
```

---

## Example Workflow

1. Bracelet sends telemetry or alert event
2. API receives and validates request
3. Data is stored in PostgreSQL
4. Business rules are executed
5. Twilio sends notification if required
6. Web administration interface displays updated information

---

## Future Improvements

* [ ] Real-time WebSocket communication
* [ ] MQTT support
* [ ] Device geolocation tracking
* [ ] Alert escalation workflows
* [ ] Mobile application
* [ ] Event streaming with Kafka
* [ ] Device firmware management
* [ ] Dashboard and analytics
* [ ] Role-based access control
* [ ] Multi-device support

---

## Learning Objectives

This project was developed to explore:

* IoT device integrations
* Wearable technology communication
* REST API design
* PostgreSQL data modeling
* SMS notification systems
* Containerized deployments
* Event-driven workflows

---

## Author

Daniel Sá

Back-End Engineer focused on scalable systems, IoT platforms, backend architecture, and intelligent transportation solutions.

### Links

GitHub:
https://github.com/danieljvsa

Portfolio:
https://danieljvsa.vercel.app

---

## License

MIT License
