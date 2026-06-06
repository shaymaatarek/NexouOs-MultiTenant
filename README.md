NexusOS

A multi-tenant SaaS management platform built with .NET 9, React, and PostgreSQL.

NexusOS is a portfolio project designed to explore real-world software architecture concepts including multi-tenancy, role-based authorization, tenant isolation, and scalable application design.

Overview
NexusOS allows multiple organizations (tenants) to operate independently within a single application instance while maintaining complete data isolation.
The platform provides:
    • Multi-Tenant Architecture 
    • JWT Authentication 
    • Role-Based Authorization 
    • Tenant Data Isolation 
    • User Management 
    • Product Management 
    • Order Management 
    • Platform Administration 
    • Audit Logging 

Architecture

![C4 Context](docs/c4-context.png)

![C4 Container](docs/c4-container.png)

Architecture Style
The backend follows Clean Architecture principles:
    • NexusOS-Models
    • NexusOS-Business
    • NexusOS-Data
    • NexusOS-API
Layer Responsibilities
    Layer	Responsibility
    Models	Business entities and core rules
    Business	Use cases and business logic
    Data	Database access and external services
    API	HTTP endpoints and request handling

System Context
Platform Users
Super Admin
Responsible for managing the SaaS platform itself.
Capabilities:
    • Manage Tenants 
    • Monitor Platform Activity 
    • View Audit Logs 
    • Manage Subscriptions 
    • Access Platform Dashboard 
Tenant Admin
Responsible for managing a specific organization.
Capabilities:
    • Manage Users 
    • Manage Products 
    • Manage Orders 
    • View Tenant Dashboard 
User
Standard user with limited permissions within a tenant.

Multi-Tenant Design
Each organization is represented as a Tenant.
Tenant
 ├── Users
 ├── Products
 └── Orders
All business data is associated with a TenantId.
This ensures:
    • Data Isolation 
    • Secure Access Control 
    • Shared Infrastructure 
    • Scalable SaaS Design 

Modules
Authentication
    • Login 
    • JWT Authentication 
    • Refresh Tokens
Tenant Management
    • Create Tenant 
    • Update Tenant 
    • Activate/Deactivate Tenant 
User Management
    • Create User 
    • Assign Roles 
    • Update User 
    • Delete User
Product Management
    • Create Products 
    • Update Products 
    • Delete Products 
Order Management
    • Create Orders 
    • View Orders 
Audit Logging
Track important system activities.

Technology Stack
Backend
    • .NET 9 
    • ASP.NET Core Web API 
    • Entity Framework Core 
    • PostgreSQL 
Frontend
    • React 
    • TypeScript 
Security
    • JWT Authentication 
    • Role-Based Authorization 

Screenshots
Super Admin Dashboard
<img width="1916" height="1027" alt="image" src="https://github.com/user-attachments/assets/9d61dfdf-4c8c-491c-bec4-c01c868d3702" />

Tenant Dashboard
<img width="1918" height="1028" alt="image" src="https://github.com/user-attachments/assets/15b052ae-be8c-4c1e-a2a0-47eaf570983d" />


Demo
https://www.youtube.com/watch?v=urSrvfHCQHQ

Architectural Decisions
Why Multi-Tenancy?
To simulate real-world SaaS platforms where multiple organizations share the same infrastructure while maintaining data isolation.
Why Clean Architecture?
To achieve:
    • Separation of Concerns 
    • Maintainability 
    • Testability 
    • Scalability 
Why Role-Based Authorization?
To support multiple user types with different responsibilities.

Future Enhancements
Planned improvements:
    • Subscription Billing 
    • Feature Flags 
    • Notification Service 
    • File Storage 
    • Background Jobs 
    • Advanced Reporting 
    • Tenant Impersonation  

Learning Objectives
This project was created to practice and demonstrate:
    • Software Architecture 
    • SaaS Design Patterns 
    • Multi-Tenant Systems 
    • Domain Modeling 
    • Authentication & Authorization 
    • Clean Architecture Principles 

Author
Shaymaa Tarek
Web Team Leader 
Tech Stack:
    • .NET 
    • C# 
    • React 
    • JavaScript 
    • SQL 
