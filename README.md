# 5StarK9 - Canine Training Progress Tracking and CRM

## Overview
5StarK9 is a proposed full-stack web application designed specifically for professional dog trainers. It aims to serve as a comprehensive Client Relationship Management (CRM) and progress tracking system, centralizing client data, dog profiles, training plans, scheduling, and session notes into one intuitive platform. By leveraging a Django/Django REST Framework backend and a React frontend, 5StarK9 will offer a robust, scalable, and user-friendly solution to enhance the efficiency and effectiveness of dog training businesses.

### Problem: 
Professional dog trainers manage a significant volume of complex and interconnected information. This includes detailed client contact information, multiple dogs per client (each with unique breeds, temperaments, and training needs), customized training regimens, appointment schedules, and ongoing progress assessments. Currently, many trainers rely on disparate tools like spreadsheets, physical notebooks, generic calendar apps, or basic contact managers. This fragmented approach often leads to:
- **Inefficiency:** Time wasted searching for information across different sources.
- **Disorganization:** Difficulty maintaining consistent and easily accessible records.
- **Lack of Insight:** Challenges in tracking long-term progress and identifying patterns across clients or training methods.
- **Scalability Issues:** Difficulty managing a growing client base effectively.
### Solution: 
5StarK9 addresses these challenges by providing a dedicated, integrated web application tailored to the specific workflow of dog trainers. The system will empower trainers to:
- **Centralize Operations:** Manage all core aspects of their business—clients, dogs, plans, schedules, and progress—within a single platform.
- **Streamline Workflows:** Reduce administrative overhead through efficient data entry, retrieval, and management features.
- **Enhance Client Service:** Maintain detailed, easily accessible records for personalized training and communication.
- **Improve Training Outcomes:** Gain better visibility into individual dog progress and the effectiveness of different training plans through structured data collection.
### Primary Competitors
- [Busy Paws](https://www.busypaws.app/)
- [Gingr](https://www.gingrapp.com/)
## Key Features:

### **Client Management:** 
Securely store and manage client details (name, contact info, address) and link them to their respective dogs.
- [ ] **Add New Client:** As a trainer, I want to add a new client record with their name, phone number, email address, and physical address, so that I can keep track of who I am working with and how to contact them.
- [ ] **View Client List:** As a trainer, I want to view a list of all my clients, showing key information like name and primary contact number, so that I can quickly find and access client records.
- [ ] **View Client Details:** As a trainer, I want to select a client from the list and view their full details (name, all contact info, address, associated dogs), so that I have all relevant information readily available.
- [ ] **Edit Client Information:** As a trainer, I want to edit an existing client's contact information (phone, email, address), so that I can keep their records accurate and up-to-date.
- [ ] **Link Dog to Client:** As a trainer, when viewing or adding a client, I want to easily associate one or more dogs with that client's record, so that I know which dogs belong to which owner.
- [ ] **Search/Filter Clients:** As a trainer, I want to search or filter my client list by name, so that I can quickly find a specific client, especially when I have many clients.
- [ ] **Archive Client:** As a trainer, I want to archive or mark a client as inactive (rather than deleting them), so that I can hide them from the main active list but retain their historical data for future reference.

### **Comprehensive Dog Profiles:** 
Create detailed profiles for each dog, including name, breed, age, photo (optional), owner, medical notes, behavioral history, and specific training goals/notes.
- [ ] **Add New Dog Profile:** As a trainer, I want to create a new profile for a dog, including its name, breed, and age (or date of birth), so that I can start tracking its information.
- [ ] **Associate Dog with Owner:** As a trainer, when creating or editing a dog's profile, I want to link it to an existing client record (the owner), so that I can easily see who owns which dog.
- [ ] **View Dog List (All/By Client):** As a trainer, I want to view a list of all dogs in the system, perhaps with the ability to filter by client/owner, so that I can get an overview or find a specific dog quickly.
- [ ] **View Detailed Dog Profile:** As a trainer, I want to select a dog and view its complete profile, including name, breed, age, owner, medical notes, behavioral history, training goals, and session history (linked later), so that I have all relevant details in one place before a session or review.
- [ ] **Edit Basic Dog Information:** As a trainer, I want to edit a dog's basic information (like name, breed, age/DOB) if it was entered incorrectly or needs updating, so that the profile remains accurate.
- [ ] **Manage Medical Notes:** As a trainer, I want to add, view, and update medical notes (e.g., allergies, past injuries, vet contact) for a dog, so that I am aware of any health considerations relevant to training.
- [ ] **Manage Behavioral History:** As a trainer, I want to add, view, and update notes on a dog's known behavioral history (e.g., past incidents, known triggers, temperament assessment), so that I can tailor training appropriately and safely.
- [ ] **Manage Training Goals/Notes:** As a trainer, I want to record, view, and update specific training goals and general notes for a dog (distinct from session logs), so that I can track overarching objectives and important reminders for that individual dog.
- [ ] **Mark Dog Inactive:** As a trainer, I want to mark a dog's profile as inactive (e.g., if the client is no longer active or the dog has passed away), so that it doesn't clutter the active list but its historical data is preserved.
- [ ] **(POTENTIAL) Add/Update Dog Photo:** As a trainer, I want the option to upload and update a photo for each dog's profile, so that I can easily identify the dog visually.

### **Customizable Training Plans:** 
Design reusable training plan templates (e.g., "Puppy Socialization," "Basic Obedience," "Reactivity Modification") outlining specific exercises, goals, and timelines. Assign these plans to individual dogs and track progress against them.
- [ ] **Create Training Plan Template:** As a trainer, I want to create reusable training plan templates (e.g., "Puppy Basics," "Leash Manners") with a name and description, so that I can standardize my training programs and save time.
- [ ] **Define Template Structure (Exercises/Goals/Timeline):** As a trainer, when creating or editing a template, I want to define specific exercises, steps, overall goals, and suggested timelines or number of sessions, so that the plan structure is clear and comprehensive.
- [ ] **Manage Custom Skills/Behaviors Library:** As a trainer, I want to create and manage a library of custom skills or behaviors (e.g., "Sit," "Stay," "Loose Leash Walking," "Ignore Distractions"), so that I can consistently track specific elements across different dogs and plans.
- [ ] **Add Skills/Behaviors to Template:** As a trainer, when creating or editing a template, I want to associate specific skills/behaviors from my library with the plan's exercises or goals, so that I know what specific items the plan aims to teach or improve.
- [ ] **View Template List:** As a trainer, I want to view a list of all my saved training plan templates, so that I can easily find and select them for assignment or editing.
- [ ] **Edit Training Plan Template:** As a trainer, I want to edit an existing training plan template (its name, description, exercises, goals, timeline, associated skills), so that I can refine or update my standard programs.
- [ ] **Assign Plan to Dog:** As a trainer, I want to assign a specific training plan template to an individual dog's profile, so that I can start tracking their progress against that structured plan.
- [ ] **View Dog's Assigned Plan(s):** As a trainer, when viewing a dog's profile, I want to see which training plan(s) are currently assigned to them, along with their progress, so that I know what we are working on.
- [ ] **Track Progress within Assigned Plan:** As a trainer, during or after a session, I want to update the status or progress on specific exercises, goals, or skills within a dog's assigned training plan, so that I have a clear record of advancement against the plan's objectives.
- [ ] **Archive Template:** As a trainer, I want to archive old or unused training plan templates, so that they don't clutter my active list but remain available if needed later.
- [ ] **(POTENTIAL) Duplicate Template:** As a trainer, I want to duplicate an existing training plan template, so that I can quickly create a variation without starting from scratch.

### **Integrated Appointment Scheduling:** 
A calendar-based system to schedule, view, modify, and manage training sessions. Link appointments to specific clients, dogs, locations, and training plans. Include features for setting reminders (potential future enhancement).
- [ ] **View Schedule:** As a trainer, I want to view my appointments on a calendar (with options for daily, weekly, and monthly views), so that I can easily see my availability and scheduled sessions.
- [ ] **Schedule New Appointment:** As a trainer, I want to create a new appointment by selecting a date and time slot on the calendar, so that I can book new training sessions.
- [ ] **Link Appointment Details:** As a trainer, when creating or editing an appointment, I want to link it to a specific client, one or more of their dogs, a location (e.g., client's home, training facility), and optionally a relevant training plan, so that all necessary context is associated with the appointment.
- [ ] **View Appointment Details:** As a trainer, I want to click on an appointment in the calendar and view its details (date, time, duration, client, dog(s), location, linked plan, notes), so that I can quickly review the information for an upcoming session.
- [ ] **Modify Appointment:** As a trainer, I want to easily modify an existing appointment's date, time, duration, location, or linked participants/plan, so that I can accommodate rescheduling requests or changes.
- [ ] **Cancel Appointment:** As a trainer, I want to cancel an existing appointment, so that my schedule accurately reflects when a session is no longer happening.
- [ ] **Visual Availability:** As a trainer, I want scheduled appointments to clearly block out time on my calendar view, so that I can quickly see when I am busy or free.
- [ ] **Set Appointment Status:** As a trainer, I want to be able to mark an appointment's status (e.g., Scheduled, Confirmed, Completed, Cancelled, No-Show), so that I can track the lifecycle of each session.
- [ ] **(Future Enhancement) Set Reminders:** As a trainer, I want the option to set automated reminders for upcoming appointments (for myself and/or the client), so that we reduce the chance of missed sessions.
- [ ] **Future Enhancement) Filter Calendar:** As a trainer, I want to potentially filter my calendar view (e.g., show only appointments for a specific client, or at a specific location), so that I can focus on relevant subsets of my schedule.

### **Detailed Session Logging & Progress Tracking:** 
Allow trainers to record notes, observations, milestones achieved, challenges encountered, and media (photos/short videos - potential future enhancement) for each training session. This creates a chronological progress log for every dog.
- [ ] **Create Session Log Entry:** As a trainer, I want to create a new log entry for a specific training session, linking it to the relevant dog and date/time, so that I can document what occurred during that session.
- [ ] **Record General Session Notes:** As a trainer, during or after a session, I want to write free-form notes about the session (e.g., overall mood, environment, owner interactions), so that I can capture contextual details.
- [ ] **Log Specific Observations:** As a trainer, I want to record specific observations about the dog's behavior during the session (e.g., "Showed less anxiety near bikes," "Responded quickly to 'sit' cue"), so that I can track nuanced changes over time.
- [ ] **Record Milestones Achieved:** As a trainer, I want to explicitly log milestones achieved during the session (e.g., "Held 'stay' for 30 seconds," "Walked loosely on leash past another dog"), potentially linking them to specific skills or plan goals, so that I can clearly track positive progress.
- [ ] **Record Challenges Encountered:** As a trainer, I want to document any challenges or difficulties encountered during the session (e.g., "Struggled with recall around squirrels," "Became easily distracted by noise"), so that I know what areas need more focus in future sessions.
- [ ] **View Chronological Session Logs:** As a trainer, when viewing a dog's profile, I want to see a chronological history of all past session logs for that dog, so that I can easily review their entire training journey and progress over time.
- [ ] **Edit Recent Session Log:** As a trainer, I want to be able to edit a session log entry shortly after creating it (e.g., within the same day), so that I can correct typos or add details I initially forgot.
- [ ] (Future Enhancement) **Attach Media to Log:** As a trainer, I want the option to enhance session logs with visual documentation by attaching photos or short videos to a session log entry, so that I can visually document behavior or progress.
### **Trainer Dashboard:** 
An overview screen displaying upcoming appointments, recently updated dog profiles, pending tasks, and key statistics (e.g., active clients, sessions this week).
- [ ] **View Upcoming Appointments:** As a trainer, when I view the dashboard, I want to see a summary of my upcoming appointments (e.g., for today and the next few days), so that I can quickly grasp my immediate schedule.
- [ ] **View Recent Dog Profile Activity:** As a trainer, when I view the dashboard, I want to see a list of recently updated or accessed dog profiles, so that I can easily return to dogs I've recently worked with or documented.
- [ ] **View Pending Tasks/Alerts:** As a trainer, when I view the dashboard, I want to see any pending tasks or alerts (e.g., sessions needing logs, follow-up reminders), so that I know what requires my attention.
- [ ] **View Key Statistics:** As a trainer, when I view the dashboard, I want to see key statistics like the number of active clients and the number of sessions scheduled for the current week, so that I have an at-a-glance overview of my business activity.
- [ ] **Navigate from Dashboard:** As a trainer, I want to be able to click on items listed on the dashboard (like an upcoming appointment or a recently updated dog profile) and be taken directly to that item's detailed view, so that the dashboard serves as an efficient navigation hub.
## Technology Stack:
**Backend Framework:**\
Python / Django (Utilizing its ORM, admin interface, and security features)

**API:**\
Django REST Framework (For building a clean, well-documented RESTful API)

**Authentication:**\
JSON Web tokens via `djangorestframework-simplejwt`\
Google OAuth

**Database:**\
PostgreSQL (A robust relational database suitable for structured data)

**Frontend Library:**\
JavaScript / React (For creating a dynamic, interactive, and component-based user interface)

**API Communication:**\
Axios (For handling asynchronous HTTP requests between frontend and backend)

**Styling:**\
React-Bootstrap

## **Authentication Strategy**
To ensure robust protection of customer data, including sensitive information like email addresses, and to align with stringent compliance standards such as GDPR and ISO 27001, this product employs **JSON Web Tokens (JWTs)** for API authentication in place of standard Django Rest Framework (DRF) tokens. Unlike basic DRF tokens which are opaque strings requiring a database lookup for validation on each request, **JWTs offer significant advantages:** 
- Self-contained, carrying claims (user identity and permissions) and a mandatory expiration timestamp (exp claim) within a cryptographically signed structure. This stateless nature 
- Reduces database load and potential attack vectors associated with constant database interaction for token validation
- The built-in, verifiable expiration mechanism directly supports security best practices and compliance mandates:
  - `GDPR`'s principle of storage limitation and `ISO 27001 A.9 Access Control` concerning session timeouts by enforcing limited lifetimes for access credentials, mitigating risks associated with indefinitely valid tokens
- The cryptographic signature ensures the integrity of the token, preventing tampering and confirming the authenticity of the claims, thereby providing a more secure, manageable, and compliant method for controlling access to protected resources and customer data.

## **Third Party API Usage**
### Google Calendar API (with OAuth):
Integrated Appointment Scheduling" feature. Implement functionality to sync the training appointments created in the app to the trainer's Google Calendar. This requires handling Google OAuth for authentication and authorization.
### Weather API (e.g., OpenWeatherMap): 
Integrated into the Trainer Dashboard or the Appointment Details view. Fetch the weather forecast for the date and location of upcoming outdoor appointments, helping the trainer prepare.
### Stripe API
Integrated Payments (POTENTIAL)

## CRUD-ing resources:
- [ ] **Clients:** (CRUD)
- [ ] **Dogs:** (CRUD)
- [ ] **Training Plans (Templates):** (CRUD)
- [ ] **Appointments:** (CRUD)
- [ ] **Session Logs:** (CRU - Delete restricted)
- [ ] **Skills/Behaviors:** (CRUD)

## User Authentication (Django/React)

### Backend (Django & Django REST Framework - DRF)
- [x] ~~**Configure Django auth App**~~
- [x] ~~**Install/Configure DRF & Auth Packages**~~
- [ ] **Custom User Model** inheriting from AbstractUser with a `One-to-One` linked `ClientProfile` model.
- [ ] **Run migrations** (`python manage.py migrate`) to create necessary auth tables
- [x] ~~**Choose Authentication Strategy:** JWT library `djangorestframework-simplejwt`~~
- [ ] **Create API Endpoints**
  - [ ] **Registration:** (`/api/v1/auth/register/`)
  - [ ] **Login:** (`/api/v1/auth/login/`)
  - [ ] **Get Current User:** (`/api/v1/auth/user/`) Requires authentication and returns the details of the currently logged-in user
  - [ ] **Logout:** (`/api/v1/auth/logout/`).
- [ ] **Create Views**
- [ ] **Create Serializers**
- [ ] **Define URL Patterns**
- [ ] **Set Permissions:** Ensure sensitive API endpoints (client data, dog profiles) require authentication using DRF's permission classes (`IsAuthenticated`). `Registration` and `Login` endpoints should be accessible without authentication.

### Frontend (React)

- [x] **Install Libraries:**
  - `axios` for API calls
  - `react-router-dom` for routing
- [x] Create Authentication Service/Module
- [x] **Implement State Management:** React Context API to manage global authentication state (`isAuthenticated`, `user`, `token`).
- [x] Create functions to interact with the backend API endpoints (`register(userData)`, `login(credentials)`, `logout()`, `getCurrentUser()`)
- [x] Create UI Components:
  - [x] `RegistrationForm.js`: Form with fields for username, email, password, password confirmation. Calls the register service function.
  - [x] `LoginForm.js`: Form with fields for username/email and password. Calls the login service function. On success, updates auth state and stores the token.
  - [x] `LogoutButton.js`: Button that calls the logout service function, clears auth state, and removes the token.
- [x] **Token Handling:** Upon successful login, store the received token securely (`localStorage`).
- [x] Configure `Axios` to automatically include the token in the `Authorization` header for subsequent requests (`axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;`).
- [x] Clear the token upon logout.
- [ ] Implement Protected Routes: Create a ProtectedRoute component that checks the authentication state.
 - If authenticated, render the requested component.
 - If not authenticated, redirect the user to the /login page.
- [ ] Wrap sensitive routes (Dashboard, Client list, etc.) in ProtectedRoute.
- [ ] Update App Structure: Set up routes using react-router-dom for `login`, `registration`, `dashboard`, and other protected areas.
- [ ] Include Login/Registration forms on public routes.
- [ ] Include Logout button in the main layout for authenticated users.
- [ ] Attempt to fetch the current user on app load if a token exists in storage to maintain login state across page refreshes.

### General & Security
- [ ] HTTPS: Ensure your application is served over HTTPS in production.
- [ ] CSRF Protection: Ensure Django's CSRF protection is correctly configured and handled by `Axios` requests.
- [ ] Validation: Implement robust input validation on both frontend and backend.

## Models
This list outlines the Django models needed to support the application's features.
- [ ] `User` (Custom User auth model) - Trainer/Admin
- [ ] `ClientProfile` - Represents the dog owner/client and thier profile
- [ ] `Dog` - Represents the dog being trained - **Relationship:** Many `Dogs` belong to one `Client`. Many `Dogs` are managed by one `User` (Trainer).
- [ ] `Skill` - Represents a reusable skill or behavior that can be tracked or included in plans -  **Relationship:** Many Skills belong to one `Dog`
- [ ] `TrainingPlan` - Represents a reusable template for a training plan - **Relationship:** Many `TrainingPlan` belong to one `Dog`. Many-to-Many with `Skill`
- [ ] `Appointment` - Represents a scheduled training session - **Relationship:** Many `Appointment` for one `User`, `Client`. Many-to-Many with `Dog`. ForeignKey to `TrainingPlan`
- [ ] `SessionLog` - Records the details and progress from a completed training session - **Relationship:** One `SessionLog` per `Appointment`. Many `SessionLog` belong to one `User`/`Dog`