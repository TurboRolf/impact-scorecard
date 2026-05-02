import Navigation from "@/components/Navigation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Privacy = () => {
  useDocumentTitle("Integritetspolicy");

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Integritetspolicy för Ethisay</h1>
          <p className="text-sm text-muted-foreground mb-8">Senast uppdaterad: 2 maj 2026</p>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">1. Inledning</h2>
            <p className="text-sm leading-relaxed mb-2">
              Denna integritetspolicy beskriver hur Ethisay ("vi", "oss", "vår") samlar in, använder och skyddar dina personuppgifter när du använder vår tjänst på ethisay.com ("Tjänsten").
            </p>
            <p className="text-sm leading-relaxed mb-2">
              Personuppgiftsansvarig är Alexander Gombor, som driver Ethisay som privatperson. Du kan kontakta oss via <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a> vid frågor om denna policy eller dina personuppgifter.
            </p>
            <p className="text-sm leading-relaxed">
              Genom att använda Tjänsten godkänner du behandlingen av dina personuppgifter enligt denna policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">2. Vilka personuppgifter vi samlar in</h2>
            <p className="text-sm leading-relaxed mb-2">Vi samlar in följande typer av personuppgifter:</p>
            <h3 className="font-semibold text-sm mt-3 mb-1">Uppgifter du lämnar vid registrering och användning:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>E-postadress</li>
              <li>Lösenord (lagras krypterat)</li>
              <li>Användarnamn</li>
              <li>Profilbild (om du väljer att ladda upp en)</li>
              <li>Bio/profilbeskrivning (om du väljer att fylla i)</li>
            </ul>
            <h3 className="font-semibold text-sm mt-3 mb-1">Uppgifter som genereras av din användning:</h3>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Innehåll du skapar (recensioner, bedömningar, boykotter, kommentarer)</li>
              <li>Vilka företag, creators och boykotter du följer</li>
              <li>Tidpunkter för inloggning och aktivitet</li>
              <li>Teknisk information som IP-adress och webbläsartyp (för säkerhet)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">3. Varför vi behandlar dina personuppgifter</h2>
            <p className="text-sm leading-relaxed mb-2">Vi behandlar dina personuppgifter för följande ändamål:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Att tillhandahålla Tjänsten:</strong> Skapa och hantera ditt konto, möjliggöra inloggning, visa ditt innehåll för andra användare</li>
              <li><strong>Att förbättra Tjänsten:</strong> Förstå hur Tjänsten används så vi kan utveckla den vidare</li>
              <li><strong>Säkerhet:</strong> Förhindra missbruk, spam och olagligt innehåll</li>
              <li><strong>Kommunikation:</strong> Skicka viktiga meddelanden om ditt konto eller Tjänsten</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">4. Rättslig grund för behandlingen</h2>
            <p className="text-sm leading-relaxed mb-2">Vi behandlar dina personuppgifter med stöd av följande rättsliga grunder enligt GDPR:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Avtal:</strong> Behandling som krävs för att vi ska kunna tillhandahålla Tjänsten enligt våra användarvillkor</li>
              <li><strong>Samtycke:</strong> För frivilliga uppgifter som profilbild och bio</li>
              <li><strong>Berättigat intresse:</strong> För att skydda Tjänsten mot missbruk och förbättra den</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">5. Hur länge vi sparar dina uppgifter</h2>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Kontouppgifter:</strong> Sparas så länge ditt konto är aktivt</li>
              <li><strong>Vid kontoradering:</strong> Personuppgifter raderas inom 30 dagar, men anonymiserade aggregerade data kan sparas längre</li>
              <li><strong>Innehåll du publicerat:</strong> Tas bort när du raderar det eller ditt konto</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">6. Vem vi delar dina uppgifter med</h2>
            <p className="text-sm leading-relaxed mb-2">Vi säljer aldrig dina personuppgifter. Dina uppgifter lagras hos:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li><strong>Supabase</strong> (databas och autentisering) – uppgifter kan lagras inom EU/EES eller i USA. Supabase följer GDPR och har lämpliga skyddsåtgärder.</li>
              <li><strong>Vercel</strong> (hosting) – tekniska loggar för att Tjänsten ska fungera.</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">Vi kan även lämna ut uppgifter om det krävs enligt lag eller för att skydda våra eller andras rättigheter.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">7. Dina rättigheter</h2>
            <p className="text-sm leading-relaxed mb-2">Enligt GDPR har du rätt att:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Få tillgång till dina personuppgifter (registerutdrag)</li>
              <li>Rätta felaktiga uppgifter</li>
              <li>Radera dina uppgifter ("rätten att bli glömd")</li>
              <li>Begränsa behandlingen av dina uppgifter</li>
              <li>Invända mot behandling baserad på berättigat intresse</li>
              <li>Dataportabilitet – få ut dina uppgifter i ett maskinläsbart format</li>
              <li>Återkalla samtycke när som helst</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">
              För att utöva dina rättigheter, kontakta oss på <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a>.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Du har också rätt att lämna in klagomål till Integritetsskyddsmyndigheten (IMY) om du anser att vi behandlar dina personuppgifter felaktigt: <a href="https://imy.se" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">imy.se</a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">8. Säkerhet</h2>
            <p className="text-sm leading-relaxed mb-2">Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina personuppgifter, inklusive:</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              <li>Krypterad lagring av lösenord</li>
              <li>HTTPS-kryptering vid all dataöverföring</li>
              <li>Begränsad åtkomst till personuppgifter</li>
            </ul>
            <p className="text-sm leading-relaxed mt-2">Trots detta kan ingen överföring eller lagring av data garanteras vara 100 % säker.</p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">9. Cookies</h2>
            <p className="text-sm leading-relaxed">
              Tjänsten använder endast nödvändiga cookies för att hantera inloggning och säkerhet. Vi använder inte spårningscookies eller analysverktyg från tredje part.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">10. Ändringar i denna policy</h2>
            <p className="text-sm leading-relaxed">
              Vi kan komma att uppdatera denna policy. Vid väsentliga ändringar informerar vi dig via e-post eller meddelande i Tjänsten. Den senaste versionen finns alltid tillgänglig på ethisay.com.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-2">11. Kontakt</h2>
            <p className="text-sm leading-relaxed">
              Vid frågor om denna policy eller dina personuppgifter, kontakta:
            </p>
            <p className="text-sm leading-relaxed mt-2">
              Alexander Gombor<br />
              E-post: <a href="mailto:ethisay.kontakt@gmail.com" className="text-primary hover:underline">ethisay.kontakt@gmail.com</a>
            </p>
          </section>
        </article>
      </main>
    </div>
  );
};

export default Privacy;