# Customer Management System

A complete web application for managing customers with **Spring Boot** backend and **React** frontend.

## 🚀 Features

- Add/Edit/Delete customers
- Multiple mobile numbers per customer
- Multiple addresses per customer
- Family member relationships
- Bulk customer upload via Excel
- Search and filter customers
- Modern responsive UI

## 🛠️ Technologies

**Backend:** Java 8, Spring Boot, MariaDB, JUnit, Maven  
**Frontend:** React JS, Axios, Modern CSS

## 📋 Requirements

- Java 8+
- Node.js & npm
- MariaDB Server
- Eclipse IDE
- VS Code

## 🏗️ Project Structure

```
customer-management-system/
├── backend/           # Spring Boot API
└── frontend/          # React App
```

## ⚙️ Backend Setup

1. **Create Spring Boot Project** in Eclipse
2. **Add Dependencies:** Web, JPA, MariaDB Driver, JUnit
3. **Configure MariaDB** in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mariadb://localhost:3306/customer_db
   spring.datasource.username=root
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=org.mariadb.jdbc.Driver
   spring.jpa.database-platform=org.hibernate.dialect.MariaDBDialect
   spring.jpa.hibernate.ddl-auto=update
   ```
4. **Create Database:** `CREATE DATABASE customer_db;`
5. **Create Entities:**
   - Customer (with mobile numbers, addresses, family members)
   - City, Country (master data)
6. **Create REST Controllers** for all CRUD operations
7. **Run:** Right-click → Run as Spring Boot App

**Backend runs on:** http://localhost:8081

### Required API Endpoints
- `GET/POST/PUT/DELETE /api/customers`
- `GET /api/cities` & `GET /api/countries`
- `POST /api/customers/bulk-upload`
- `GET/POST/DELETE /api/customers/{id}/family/{familyId}`

## 🎨 Frontend Setup

```bash
# Create React app
npx create-react-app customer-management-frontend
cd customer-management-frontend

# Install dependencies
npm install axios

# Create folder structure
src/
├── components/
│   ├── CustomerList.js & CustomerList.css
│   ├── CustomerForm.js & CustomerForm.css
├── services/
│   └── customerService.js
├── App.js & App.css

# Start frontend
npm start
```

**Frontend runs on:** http://localhost:3000

## 📊 Database Schema

### Customer Table
- id, name, nic_number, date_of_birth

### Mobile Numbers Table
- id, customer_id, mobile_number

### Address Table
- id, customer_id, address_line1, address_line2, city_id, country_id

### Family Members Table
- id, customer_id, family_member_id

### Master Data (Only frontend Implement)
- cities (id, name)
- countries (id, name)

## 🚀 Quick Start

1. **Start Backend:** Run Spring Boot app in Eclipse
2. **Start Frontend:** Run `npm start` in React project  
3. **Access App:** http://localhost:3000
4. **Test Features:** Add customers, upload Excel, manage family members

## 📁 Bulk Upload Format (Only frontend Implement)

Excel file should have columns:
- Name (required)
- NIC Number (required)
- Date of Birth (required)
- Mobile Numbers (optional)
- Address details (optional)

## 🔍 Key Features

- **Customer CRUD:** Create, read, update, delete customers
- **Multiple Data:** Handle multiple mobile numbers and addresses
- **Family Links:** Connect customers as family members
- **Search/Filter:** Find customers quickly
- **Modern UI:** Beautiful, responsive design

## 🛠️ Troubleshooting

- **Backend not starting:** Check MariaDB server is running and database exists
- **Connection errors:** Verify MariaDB credentials in application.properties
- **CORS errors:** Configure CORS in Spring Boot
- **Frontend errors:** Ensure backend is running on port 8081
- **Database errors:** Ensure MariaDB user has proper permissions



**Complete Customer Management System - Ready for Production! 🎉**
