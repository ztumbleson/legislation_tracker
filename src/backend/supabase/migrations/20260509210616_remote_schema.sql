


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."legislation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" character varying NOT NULL,
    "text" character varying NOT NULL
);


ALTER TABLE "public"."legislation" OWNER TO "postgres";


COMMENT ON TABLE "public"."legislation" IS 'Pieces of legislation that have been introduced by legislators';



CREATE TABLE IF NOT EXISTS "public"."legislation_sponsors" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "legislator_id" "uuid" NOT NULL,
    "legislation_id" "uuid" NOT NULL
);


ALTER TABLE "public"."legislation_sponsors" OWNER TO "postgres";


COMMENT ON TABLE "public"."legislation_sponsors" IS 'Join table for mapping the many-to-many legislators->legislation';



CREATE TABLE IF NOT EXISTS "public"."legislator" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "first_name" character varying NOT NULL,
    "last_name" character varying NOT NULL,
    "hometown" character varying NOT NULL
);


ALTER TABLE "public"."legislator" OWNER TO "postgres";


COMMENT ON TABLE "public"."legislator" IS 'Represents a elected representative (legislator)';



ALTER TABLE ONLY "public"."legislation"
    ADD CONSTRAINT "legislation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legislation_sponsors"
    ADD CONSTRAINT "legislation_sponsors_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legislator"
    ADD CONSTRAINT "legislator_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."legislation_sponsors"
    ADD CONSTRAINT "legislation_sponsors_legislation_id_fkey" FOREIGN KEY ("legislation_id") REFERENCES "public"."legislation"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."legislation_sponsors"
    ADD CONSTRAINT "legislation_sponsors_legislator_id_fkey" FOREIGN KEY ("legislator_id") REFERENCES "public"."legislator"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Enable read access for all users" ON "public"."legislation" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."legislation_sponsors" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."legislator" USING (true);



ALTER TABLE "public"."legislation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."legislation_sponsors" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."legislator" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";





































































































































































GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation_sponsors" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation_sponsors" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislation_sponsors" TO "service_role";



GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislator" TO "anon";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislator" TO "authenticated";
GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLE "public"."legislator" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT REFERENCES,TRIGGER,TRUNCATE,MAINTAIN ON TABLES TO "service_role";































drop extension if exists "pg_net";

revoke delete on table "public"."legislation" from "anon";

revoke insert on table "public"."legislation" from "anon";

revoke select on table "public"."legislation" from "anon";

revoke update on table "public"."legislation" from "anon";

revoke delete on table "public"."legislation" from "authenticated";

revoke insert on table "public"."legislation" from "authenticated";

revoke select on table "public"."legislation" from "authenticated";

revoke update on table "public"."legislation" from "authenticated";

revoke delete on table "public"."legislation" from "service_role";

revoke insert on table "public"."legislation" from "service_role";

revoke select on table "public"."legislation" from "service_role";

revoke update on table "public"."legislation" from "service_role";

revoke delete on table "public"."legislation_sponsors" from "anon";

revoke insert on table "public"."legislation_sponsors" from "anon";

revoke select on table "public"."legislation_sponsors" from "anon";

revoke update on table "public"."legislation_sponsors" from "anon";

revoke delete on table "public"."legislation_sponsors" from "authenticated";

revoke insert on table "public"."legislation_sponsors" from "authenticated";

revoke select on table "public"."legislation_sponsors" from "authenticated";

revoke update on table "public"."legislation_sponsors" from "authenticated";

revoke delete on table "public"."legislation_sponsors" from "service_role";

revoke insert on table "public"."legislation_sponsors" from "service_role";

revoke select on table "public"."legislation_sponsors" from "service_role";

revoke update on table "public"."legislation_sponsors" from "service_role";

revoke delete on table "public"."legislator" from "anon";

revoke insert on table "public"."legislator" from "anon";

revoke select on table "public"."legislator" from "anon";

revoke update on table "public"."legislator" from "anon";

revoke delete on table "public"."legislator" from "authenticated";

revoke insert on table "public"."legislator" from "authenticated";

revoke select on table "public"."legislator" from "authenticated";

revoke update on table "public"."legislator" from "authenticated";

revoke delete on table "public"."legislator" from "service_role";

revoke insert on table "public"."legislator" from "service_role";

revoke select on table "public"."legislator" from "service_role";

revoke update on table "public"."legislator" from "service_role";


