# Mentor LMS Docker Setup

## Quick Start

### 1. Build the Application
```bash
docker build -t mentor-lms .
```

### 2. Setup Options

#### Option A: With Docker MySQL (Recommended)
```bash
# Create network
docker network create mentor-network

# Run MySQL container
docker run -d --name mysql --network mentor-network \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=mentor_lms \
  -e MYSQL_USER=mentor_user \
  -e MYSQL_PASSWORD=your_password \
  -p 3306:3306 mysql:8.0

# Run application
docker run -d --name mentor-lms-app --network mentor-network -p 8080:80 mentor-lms
```

**Database Configuration:**
- Host: `mysql`
- Port: `3306`
- Database: `mentor_lms`
- Username: `mentor_user`
- Password: `your_password`

#### Option B: With External MySQL
```bash
docker run -d -p 8080:80 --name mentor-lms-app mentor-lms
```

### 3. Access Application
Open your browser: `http://localhost:8080`

## Management Commands

```bash
# View containers
docker ps -a

# View logs
docker logs mentor-lms-app

# Access container shell
docker exec -it mentor-lms-app bash

# Stop and remove
docker stop mentor-lms-app && docker rm mentor-lms-app

# Restart services
docker restart mentor-lms-app mysql
```
