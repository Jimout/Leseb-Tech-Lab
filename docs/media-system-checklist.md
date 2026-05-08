## Media System Checklist

### Environment

- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- Ensure `DATABASE_URL` points to production DB before migration scripts.
- Confirm admin auth is configured (`ADMIN_EMAIL`, session signing secret).

### Migration Order

- Run Prisma migration to apply `heroMedia` and `mediaAssets` schema.
- Regenerate Prisma client.
- Run dry run migration: `npm run db:migrate-legacy-media`.
- Apply migration: `npx tsx scripts/migrate-legacy-media.ts --apply`.
- Optional base64 conversion upload: add `--upload-base64`.

### Integrity Validation

- Run: `npm run db:validate-media`.
- Apply auto-fixes: `npx tsx scripts/validate-media-integrity.ts --fix`.
- Verify output has zero errors and expected warning-only legacy notices.

### Cloudinary Lifecycle

- Run orphan scan dry-run: `npm run db:find-orphaned-media`.
- Delete confirmed orphans: `npx tsx scripts/find-orphaned-cloudinary-assets.ts --delete`.
- Re-run orphan scan to confirm cleanup.

### API Smoke Checks

- Start app in target environment.
- Set `MEDIA_SMOKE_BASE_URL` and `MEDIA_SMOKE_SESSION`.
- Run: `npm run api:smoke-media`.
- Confirm upload/delete and CRUD payload rejection behave as expected.

### Runtime Verification

- Validate Work/Insight/Resource cards and details render hero media correctly.
- Validate mixed gallery items (image/video/gif/embed360) render and degrade gracefully.
- Verify invalid embed URLs render fallback, not iframe.
- Confirm broken media URLs show fallback UI without runtime errors.

### Admin UX Verification

- Upload image/video/gif and confirm progress updates.
- Test network interruption and retry path.
- Confirm replacement removes old asset from Cloudinary when `publicId` exists.
- Confirm delete actions remove media and persist cleanly.

### Security Checks

- Verify `/api/upload-media` requires admin auth.
- Verify upload rejects unsupported MIME types and oversized files.
- Verify embed URL sanitization accepts only whitelisted providers over HTTPS.
- Verify malformed JSON/form payloads fail with safe error responses.

### Performance Checks

- Confirm Cloudinary URL optimizations (`f_auto,q_auto`) applied for images.
- Confirm video uses metadata preload unless autoplay is enabled.
- Validate lazy loading on media-heavy pages.
- Watch network payload sizes for large `mediaAssets` documents.

### Rollback Notes

- Roll back deploy first if runtime failures are detected.
- Restore DB backup if migration produced invalid media JSON.
- Re-run integrity script in dry-run to identify broken rows before retry.

### Operational Warnings

- Keep orphan cleanup in dry-run mode until verified by a human.
- Avoid deleting Cloudinary assets created in the last deployment window.
- Monitor Cloudinary storage and transformation quotas after migration.
