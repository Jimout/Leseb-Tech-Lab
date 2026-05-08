-- Remove Resources feature: table, subscriber preference, and enum variant.

-- Drop the Resource table (and its indexes / FKs).
DROP TABLE IF EXISTS "Resource" CASCADE;

-- Drop subscriber resource preference.
ALTER TABLE "Subscriber" DROP COLUMN IF EXISTS "notifyResources";

-- Remove RESOURCE_PUBLISHED from NotificationType enum.
-- (Postgres can't drop enum values directly; recreate the enum.)
DELETE FROM "NotificationEvent" WHERE "type" = 'RESOURCE_PUBLISHED';

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NotificationType') THEN
    CREATE TYPE "NotificationType_new" AS ENUM ('WORK_PUBLISHED', 'INSIGHT_PUBLISHED', 'IMPORTANT_UPDATE');

    ALTER TABLE "NotificationEvent"
      ALTER COLUMN "type" TYPE "NotificationType_new"
      USING ("type"::text::"NotificationType_new");

    DROP TYPE "NotificationType";
    ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
  END IF;
END $$;

