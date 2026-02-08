# NutriTrack - Nutrition & Food Tracking System

NutriTrack is a comprehensive web application for tracking nutrition, managing food intake, and analyzing health data. It features a robust user system, food database, meal planning, and an administrative interface for content management.

## System Test Results

The following table summarizes the verification results for key system features:

| Category           | Feature      | Test Case                         | Status  | Notes                                                           |
| :----------------- | :----------- | :-------------------------------- | :------ | :-------------------------------------------------------------- |
| **Authentication** | Registration | User registration with validation | ✅ Pass | Verified backend validation for invalid inputs.                 |
|                    | Login        | User login & JWT generation       | ✅ Pass | Token storage and session management confirmed.                 |
|                    | Profile      | Update user profile               | ✅ Pass | Profile updates reflect immediately.                            |
| **Food System**    | Search       | Food search functionality         | ✅ Pass | SQL `LIKE` and full-text search logic verified.                 |
|                    | Details      | View food details                 | ✅ Pass | Correct response structure from `getById`.                      |
|                    | Add Food     | User adds new food                | ✅ Pass | Defaults to 'pending' status for admin approval.                |
|                    | CRUD         | Admin food management             | ✅ Pass | Approve, reject, and delete endpoints functional.               |
| **Tracking**       | Meal Planner | Add/Remove items from planner     | ✅ Pass | Date handling and item referencing verified.                    |
|                    | Progress     | Weekly stats calculation          | ✅ Pass | Correct logic for weekly summaries.                             |
|                    | Weight/Water | Track body metrics                | ✅ Pass | Data persistence verified (localStorage/Database).              |
| **Admin Panel**    | UI/UX        | Sidebar Toggle & Layout           | ✅ Pass | Collapsible sidebar with persistent state; Header layout fixed. |
|                    | Visuals      | Charts & Theme                    | ✅ Pass | Charts updated to Orange theme; Height increased to 400px.      |
|                    | Dashboard    | Statistics Display                | ✅ Pass | Real-time stats calculation verified.                           |
|                    | User Mgmt    | User Role Management              | ✅ Pass | Admin can manage user roles and access.                         |
| **Database**       | Integrity    | Foreign Key Constraints           | ✅ Pass | `ON DELETE CASCADE` ensures no orphan records.                  |
|                    | Schema       | Table Structure                   | ✅ Pass | User_id and food_id relationships correctly defined.            |

## Verification Summary

All core features including Authentication, Food Management, Tracking, and Admin tools have been verified and are fully functional. Recent UI/UX refinements for the Admin Panel (color themes, chart visibility, sidebar behavior) have also been successfully implemented and tested.
