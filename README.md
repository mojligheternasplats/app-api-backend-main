# Node + Express Service Starter

This is a simple API sample in Node.js with express.js based on [Google Cloud Run Quickstart](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service).

## Getting Started

Server should run automatically when starting a workspace. To run manually, run:
```sh
npm run dev
```


this to next

[]Do you want me to also add an automatic cleanup step (delete the file from /uploads/media/ when DELETE /api/media/:id is called)? That way your uploads folder won’t get cluttered.
src/
 ├── config/
 │    ├── swagger.ts
 │    └── multer.ts              # Multer configuration (local now, switchable later)
 │
 ├── controllers/
 │    ├── auth.controller.ts
 │    ├── user.controller.ts
 │    ├── project.controller.ts
 │    ├── partner.controller.ts
 │    ├── event.controller.ts
 │    ├── news.controller.ts
 │    ├── contact.controller.ts
 │    └── media.controller.ts    # NEW: handle file upload + linking
 │
 ├── middlewares/
 │    ├── auth.middleware.ts
 │    ├── error.middleware.ts
 │    └── validate.middleware.ts
 │
 ├── repositories/
 │    ├── user.repository.ts
 │    ├── project.repository.ts
 │    ├── partner.repository.ts
 │    ├── event.repository.ts
 │    ├── news.repository.ts
 │    ├── contact.repository.ts
 │    └── media.repository.ts    # NEW: save media metadata in DB
 │
 ├── routes/
 │    ├── auth.routes.ts
 │    ├── user.routes.ts
 │    ├── project.routes.ts
 │    ├── partner.routes.ts
 │    ├── event.routes.ts
 │    ├── news.routes.ts
 │    ├── contact.routes.ts
 │    └── media.routes.ts        # NEW: endpoints for upload & media CRUD
 │
 ├── services/
 │    ├── user.service.ts
 │    ├── project.service.ts
 │    ├── partner.service.ts
 │    ├── event.service.ts
 │    ├── news.service.ts
 │    ├── contact.service.ts
 │    └── media.service.ts       # NEW: orchestrates upload + repo save
 │
 ├── lib/
 │    └── prisma.ts              # Prisma client
 │
 ├── uploads/                    # Local uploads folder (publicly served)
 │    ├── media/
 │    └── avatars/
 │
 ├── app.ts                      # Express setup
 └── index.ts                    # Entry point
