# Prisma Client initialization fix

This version addresses `@prisma/client did not initialize yet`.

Changes:
- Added `postinstall`, `predev`, and `prebuild` scripts to generate Prisma Client.
- Kept Prisma 6 `prisma-client-js` generator and the matching `@prisma/client` import.
- Added recovery instructions to README.

After extracting, run from the `oneatlas` folder:

```powershell
npm install
npx prisma generate
```

Ensure `.env` contains a valid PostgreSQL `DATABASE_URL`, then run:

```powershell
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

If the old `.next` cache persists, remove it and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```
