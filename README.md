# Aanhangerverhuur Nijkerk

Website voor één aanhanger, offerte-/reserveringsaanvragen en beschikbaarheidskalender. Geen online betalingen.

## Snel starten
1. Installeer Node.js 20+ en voer `npm install` uit.
2. Maak een gratis Supabase-project, open SQL Editor en voer `schema.sql` uit.
3. Kopieer `.env.example` naar `.env` en vul Supabase Project URL en publishable/anon key in (nooit de service_role key).
4. Start lokaal met `npm run dev`.
5. Publiceer via Vercel (importeer deze map/repository); voeg dezelfde twee omgevingsvariabelen toe aan Vercel en koppel je domein.

## Reserveringen beheren
Open Supabase → Table Editor → booking_requests. Nieuwe aanvragen hebben status `pending`. Controleer de gewenste data en contactgegevens. Voor goedkeuring: voeg alle huurdata toe aan `blocked_dates` en wijzig daarna de status naar `approved`. Doe dit bij voorkeur in één SQL-transactie (voorbeeld in schema.sql). Bij afwijzing: wijzig de status naar `rejected`. Om een boeking te annuleren: verwijder bijbehorende `blocked_dates` en wijzig de status.

**Let op:** er is nog geen automatische e-mailmelding of beheerscherm gebouwd. Nieuwe aanvragen staan veilig in Supabase, maar je moet ze daar bekijken. Voor automatische e-mailmeldingen is een extra server-side e-mailintegratie nodig. De kalender blokkeert alleen goedgekeurde aanvragen, dus twee gelijktijdige open aanvragen kunnen overlappen. Controleer dit bij goedkeuring.

## Voor livegang verplicht
- Bevestig echte dag-, weekend- en weekprijzen in `src.js` én in de zichtbare tariefkaarten.
- Voeg echte aanhangergegevens toe (type, afmetingen, maximaal laadgewicht, rijbewijsvereisten, borg, afhaaladres, openingstijden).
- Voeg privacyverklaring en bewaartermijn voor persoonsgegevens toe.
- Configureer e-mailnotificaties via een beveiligde server-side integratie, als berichten direct naar info@4allriders.nl moeten.
- Test een aanvraag, goedkeuring, geblokkeerde dag en mobiele weergave.
- Voor productie: voeg spambeveiliging/rate limiting en een server-side validatie van de beschikbaarheid toe.

Deze versie is een werkende starter, maar nog niet productierijp zonder bovenstaande stappen.
