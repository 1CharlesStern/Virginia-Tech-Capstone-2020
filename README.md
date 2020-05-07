NOTE: When migrating application, change apiUrl in src/environments/environment.ts and environment.prod.ts.  CORS headers must also be changed in the backend server.
For local development specifically, backend CORS headers must include "localhost" for local development.

DEVELOPMENT ENVIRONMENT
1. Install node.js
2. Run “npm install @angular/cli”
2. Run “git clone https://github.com/1CharlesStern/capstone.git”
3. Run “cd capstone”
4. Run “ng add @angular/material”
Use Indigo/Pink theme
Do not set up global Angular Material typography styles
Do not set up browser animations
5. Run “ng add angular-calendar”
Use Moment date adapter
Hit enter when prompted for a project name and path
6. Run “npm install js-sha256”
7. Run “ng serve” and navigate to localhost:4200


DEPLOYMENT TO VM
Run “git pull” on the project folder in the VM (/home/admin/CareerFairAngularApp as of this writing)
Run “ng build --prod”
Copy the contents of the “test-app” folder in “dist” into “/var/www/html”
Navigate to epsilon.cs.vt.edu