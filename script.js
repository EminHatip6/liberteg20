// G20Zirve Frontend Interactions
// - Smooth scrolling for navbar links
// - 100-day live countdown timer
// - Section + hero animations via Intersection Observer
// - Language switching for tüm metinler (hero metinleri hariç)

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupCountdown("July 6, 2026 09:00:00");
  setupSectionObserver();
  setupLanguageSwitcher();
  setupMobileMenu();
  setCurrentYear();
  initInteractiveBackground(); // Interactive background for About and Team
  
});

/**
 * Attach smooth scrolling to internal anchor links
 * for consistent behavior across browsers.
 */
function setupSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const navbar = document.querySelector(".navbar");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();

      // Flawless scroll logic: Get navbar height and calculate precise target position
      const navHeight = navbar ? navbar.offsetHeight : 0;
      const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPos,
        behavior: "smooth"
      });
    });
  });
}

/**
 * Initialize a countdown timer for a specific target date,
 * updating every second.
 *
 * @param {string} targetDate - The date string to count down to.
 */
function setupCountdown(targetDate) {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const timeBoxes = document.querySelectorAll(".time-box");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  const target = new Date(targetDate);

  function update() {
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs <= 0) {
      // Countdown finished
      daysEl.textContent = "0";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      clearInterval(timerId);
      return;
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds / (60 * 60)) % 24);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const seconds = totalSeconds % 60;

    daysEl.textContent = String(days);
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");

    // Subtle pulse on each tick
    timeBoxes.forEach((box) => {
      box.classList.add("tick");
      setTimeout(() => box.classList.remove("tick"), 140);
    });
  }

  // Initial render
  update();
  const timerId = setInterval(update, 1000);
}

/**
 * Animate sections and hero content when entering the viewport.
 * Animations re-trigger when scrolling back.
 */
function setupSectionObserver() {
  const sections = document.querySelectorAll(".js-section");
  if (sections.length) {
    // Bu observer section görünürlüğünü takip eder
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target;
          const isVisible = entry.isIntersecting;

          if (isVisible) {
            section.classList.add("section-visible");
            section.classList.add("is-visible"); // Supporting both legacy and new classes
            const title = section.querySelector(".section-title");
            if (title) title.classList.add("is-visible");
          } else {
            section.classList.remove("section-visible");
            section.classList.remove("is-visible");
            const title = section.querySelector(".section-title");
            if (title) title.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.05, // Trigger earlier on mobile/smaller screens
        rootMargin: "0px"
      }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const heroSection = document.getElementById("hero");
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          const heroLines = heroSection.querySelectorAll(".hero-line");

          if (isVisible) {
            heroLines.forEach((line, index) => {
              line.style.transitionDelay = `${0.15 * index}s`;
              line.classList.add("is-visible");
            });
          } else {
            heroLines.forEach((line) => {
              line.style.transitionDelay = "0s";
              line.classList.remove("is-visible");
            });
          }
        });
      },
      {
        threshold: 0.15
      }
    );
    heroObserver.observe(heroSection);
  }
}

/**
 * Dil sistemini yönetir ve tüm çevirileri uygular (hero metinleri sabit kalır).
 */
// Bu kısım dil değişimini kontrol eder
function setupLanguageSwitcher() {
  const wrapper = document.querySelector(".language-switcher");
  const toggle = document.querySelector(".lang-toggle");
  const currentLabel = document.querySelector("[data-current-lang]");
  const options = document.querySelectorAll(".lang-option");
  if (!wrapper || !toggle || !currentLabel || !options.length) return;

  const translations = {
    tr: {
      "nav.about": "Hakkımızda",
      "nav.committees": "Komitelerimiz",
      "nav.team": "Ekibimiz",
      "nav.contact": "İletişim",
      "hero.title": "Hoşgeldiniz",
      "hero.join_team": "Yoğun ilginiz için teşekkür ederiz.",
      "section.about.title": "HAKKIMIZDA",
      "section.about.body":
        "Liberte G20 ekibi olarak bizler günümüz küresel problemlerine \"Group of Twenty\" yani \"Yirmililer Grubu\" ülkeleri perspektifinden çözüm bulmaya çalışan bir grup liseli genciz. Etkinliğimizi diğer G20 etkinliklerinden ayıran şey ise dört farklı dilde (Türkçe, İngilizce, Fransızca ve Almanca) Türkiye'nin en büyük bağımsız G20 Simülasyonu olmasıdır. Bizler bu etkinlikle katılımcılara uluslararası diplomasi, ekonomik ve stratejik planlama alanlarında eşsiz bir deneyim sunmayı hedefliyoruz.",
      "section.about.date": "6 - 7 - 8 Temmuz 2026",
      "section.committees.title": "Komitelerimiz",
      "section.committees.body":
        "G20Zirve kapsamındaki ana komiteleri, çalışma alanlarını ve temel önceliklerini burada tanıtabilirsiniz.",
      "section.team.title": "EKİBİMİZ",
      "section.team.intro":
        "Zirvenin koordinasyonunu üstlenen ekibimizi ve uzmanlık alanlarını keşfedin.",
      "section.contact.title": "İLETİŞİM",
      "countdown.days": "Gün",
      "countdown.hours": "Saat",
      "countdown.minutes": "Dakika",
      "countdown.seconds": "Saniye",
      "team.coordinator.name": "Ahmed Faruk Kabar",
      "team.coordinator.title": "Genel Koordinatör",
      "team.coordinator.text": "Liberte G20 etkinliğimizin vizyoner mimarı Ahmed Faruk Kabar, sahip olduğu geniş deneyim ve birikimiyle katılımcılarımıza eşsiz bir tecrübe sunmayı hedeflemektedir. 17 yaşında olan ve literatüre, özellikle de George Orwell’ın kült eseri 1984'e duyduğu ilgiyle tanınan Ahmed, entelektüel derinliğini organizasyonun her aşamasına yansıtmaktadır.",
      "team.coordinator.quote_intro": "Değerli katılımcılarımıza bir mesajı olan Ahmed Faruk Kabar, etkinliğin temel felsefesini şu sözlerle özetliyor:",
      "team.coordinator.quote": "“Liberte G20’nin asıl mimarları, siz değerli katılımcıların özgün fikirleridir. Bizim önceliğimiz, bu fikirlerin en verimli şekilde gün yüzüne çıkabileceği profesyonel zemini hazırlamaktır.”",
      "team.coordinator.footer": "Organizasyon ekibimiz adına, etkinlik günü sizlerle bir araya gelmeyi büyük bir heyecanla bekliyoruz.",
      "team.org_head.name": "Mehmet İbrahim Güler",
      "team.org_head.title": "G20 Organizasyon Başkanı",
      "team.org_head.text": "G20 Organizasyon Başkanı olarak, küresel meselelere çözüm üretmek ve geleceğin liderleriyle bir araya gelmekten büyük gurur duyuyorum. Ekibimle birlikte, diplomasi ve iş birliği ruhunu en üst seviyeye taşıyarak fark yaratan bir etkinliğe imza atmaya hazırız.",
      "team.co_coordinator.name": "Musa Demirbilek",
      "team.co_coordinator.title": "Eş Genel Koordinatör",
      "team.co_coordinator.text": "Liberte G20 etkinliğinde eş genel kordinatörlük görevini üstlenmektedir. Etkinliğin organizasyonu ve yönetimde uyum ve düzen içerisinde ilerlenmesinde genel kordinatör Ahmed Faruk Kabar’a yardımcı olacaktır.",
      "team.field_head.name": "Berra Tezcan",
      "team.field_head.title": "Saha Başkanı",
      "team.field_head.text": "Berra Tezcan, Liberte G20 etkinliğinde Saha Başkanı olarak görev yapmaktadır. Görevi, etkinlik süresince saha düzenini sağlamak, katılımcıların yönlendirilmesini koordine etmek ve organizasyonun sahadaki akışının sorunsuz ilerlemesini temin etmektir. Aynı zamanda saha ekibini yöneterek olası aksaklıklara hızlı çözümler üretmek ve etkinlik deneyiminin düzenli, güvenli ve verimli bir şekilde gerçekleşmesine katkı sağlamaktır.",
      "team.admin_head.name": "Başak Begüm Ateş",
      "team.admin_head.title": "Admin Başkanı",
      "team.admin_head.text": "Başak Begüm Ateş, Liberte G20 etkinliğinde Admin Başkanı olarak görev yapmakta. Görevi, komite içindeki idari düzeni sağlayacak, delegelere destek olacak ve oturumların düzenli ilerlemesini sağlayacak adminlere başkanlık yaparak yardımcı olmaktır.",
      "team.pr_heads.name": "Elanur Cömert & Irmak Küçükaslan",
      "team.pr_heads.title": "Halkla İlişkiler Başkanları",
      "team.pr_heads.text": "Elanur Cömert & Irmak Küçükaslan 2010 ve 2009 yılında doğmuş olup stratejik iletişim ve marka yönetimi alanında güçlü bir deneyime sahiptirler. G20 etkinliğimizin PR Başkanları olarak, organizasyonumuzun medya görünürlüğünden içerik stratejisine kadar tüm süreçleri titizlikle planlayarak etkinliğimizin prestijini güçlendirmektedirler. Ekibimize vizyoner bakış açılarıyla değer katmaktadırlar.",
      "team.security_head.name": "Mehmet Emin Özcan",
      "team.security_head.title": "Güvenlik Başkanı",
      "team.security_head.text": "Mehmet Emin Özcan, güvenlik stratejileri ve saha operasyonları alanında derin bir tecrübeye sahiptir. G20 Güvenlik Başkanı olarak, etkinlik boyunca üst düzey güvenlik protokollerinin uygulanmasını ve tüm katılımcıların emniyetini sağlamaktadır.",
      "team.finance_head.name": "Eylül Saral",
      "team.finance_head.title": "Finans Başkanı",
      "team.finance_head.text": "Eylül Saral, Liberte G20 etkinliğinde Finans Başkanı olarak görev yapmaktadır. Görevi, etkinliğin finansal planlamasını yürütmek, bütçe yönetimini sağlamak ve mali kaynakların verimli kullanılmasını koordine etmektir. Etkinlik sürecinde gelir-gider dengesini takip ederek finansal düzenin sürdürülebilirliğini sağlamak, gerekli bütçe organizasyonlarını gerçekleştirmek ve olası mali aksaklıklara stratejik çözümler üretmekle sorumludur. Aynı zamanda finans ekibini yöneterek organizasyonun ekonomik süreçlerinin düzenli, güvenilir ve etkin bir şekilde ilerlemesine katkı sağlamaktadır.",
      "team.finance_head2.name": "Hanife Gören",
      "team.finance_head2.title": "Finans Başkanı",
      "team.finance_head2.text": "Hanife Gören, Liberte G20 etkinliğinde Finans Başkanı olarak görev yapmakta. Bu kapsamda sponsorluk süreçlerinin yürütülmesi, etkinlik bütçesinin planlanması ve gelir-gider dengesinin sağlanmasından sorumlu. Aynı zamanda tüm finansal süreçlerin düzenli, şeffaf ve sürdürülebilir bir şekilde ilerlemesini koordine ediyor.",

      "team.empty.name": "Yakında",
      "team.empty.title": "Yeni Üye",
      "team.empty.text": "Ekibimize katılmak için takipte kalın."
    },
    en: {
      "nav.about": "About Us",
      "nav.committees": "Our Committees",
      "nav.team": "Our Team",
      "nav.contact": "Contact",
      "hero.title": "Welcome",
      "hero.join_team": "Thank you for your intense interest.",
      "section.about.title": "ABOUT US",
      "section.about.body":
        "As the Liberte G20 team, we are a group of high school students trying to find solutions to today's global problems from the perspective of the \"Group of Twenty\" countries. What distinguishes our event from other G20 events is that it is Turkey's largest independent G20 Simulation in four different languages (Turkish, English, French, and German). With this event, we aim to offer participants a unique experience in the fields of international diplomacy, economic and strategic planning.",
      "section.about.date": "July 6 - 7 - 8, 2026",
      "section.committees.title": "Our Committees",
      "section.committees.body": "Explore the main committees, study areas, and core priorities within the scope of G20Zirve.",
      "section.team.title": "OUR TEAM",
      "section.team.intro": "Discover our team coordinating the summit and their areas of expertise.",
      "section.contact.title": "CONTACT",
      "countdown.days": "Days",
      "countdown.hours": "Hours",
      "countdown.minutes": "Minutes",
      "countdown.seconds": "Seconds",
      "team.coordinator.name": "Ahmed Faruk Kabar",
      "team.coordinator.title": "General Coordinator",
      "team.coordinator.text": "Ahmed Faruk Kabar, the visionary architect of our Liberte G20 event, aims to provide a unique experience to our participants with his extensive experience. Ahmed, who is 17 years old and known for his interest in literature, especially George Orwell's cult work 1984, reflects his intellectual depth into every stage of the organization.",
      "team.coordinator.quote_intro": "With a message to our valued participants, Ahmed Faruk Kabar summarizes the main philosophy of the event in these words:",
      "team.coordinator.quote": "“The real architects of Liberte G20 are your original ideas. Our priority is to prepare the professional ground where these ideas can come to light in the most efficient way.”",
      "team.coordinator.footer": "On behalf of our organization team, we look forward to meeting you on the event day with great excitement.",
      "team.org_head.name": "Mehmet İbrahim Güler",
      "team.org_head.title": "G20 Organization Head",
      "team.org_head.text": "As the G20 Organization Head, I am immensely proud to find solutions to global issues and bring together the leaders of the future. Together with my team, we are ready to create a difference-making event by elevating the spirit of diplomacy and cooperation to the highest level.",
      "team.co_coordinator.name": "Musa Demirbilek",
      "team.co_coordinator.title": "Co-General Coordinator",
      "team.co_coordinator.text": "He serves as the Co-General Coordinator for the Liberte G20 event. He will assist General Coordinator Ahmed Faruk Kabar in ensuring harmony and order in the organization and management of the event.",
      "team.field_head.name": "Berra Tezcan",
      "team.field_head.title": "Field Head",
      "team.field_head.text": "Berra Tezcan serves as the Field Head for the Liberte G20 event. Her duty is to ensure order on the field during the event, coordinate the guidance of participants, and ensure the smooth progress of the organization's field flow. At the same time, she manages the field team to produce quick solutions to potential problems and contributes to the event experience being orderly, safe, and efficient.",
      "team.admin_head.name": "Başak Begüm Ateş",
      "team.admin_head.title": "Admin Head",
      "team.admin_head.text": "Başak Begüm Ateş serves as the Admin Head for the Liberte G20 event. Her duty is to lead and assist admins who will ensure administrative order within the committee, support delegates, and ensure the sessions progress smoothly.",
      "team.pr_heads.name": "Elanur Cömert & Irmak Küçükaslan",
      "team.pr_heads.title": "Public Relations Heads",
      "team.pr_heads.text": "Elanur Cömert and Irmak Küçükaslan, born in 2010 and 2009, have strong experience in strategic communication and brand management. As the PR Heads of our G20 event, they strengthen the prestige of our organization by meticulously planning all processes from media visibility to content strategy. They add value to our team with their visionary perspectives.",
      "team.security_head.name": "Mehmet Emin Özcan",
      "team.security_head.title": "Security Head",
      "team.security_head.text": "Mehmet Emin Özcan has deep experience in security strategies and field operations. As the G20 Security Head, he ensures the implementation of high-level security protocols and the safety of all participants throughout the event.",
      "team.finance_head.name": "Eylül Saral",
      "team.finance_head.title": "Finance Head",
      "team.finance_head.text": "Eylül Saral serves as the Finance Head at the Liberte G20 event. Her duty is to carry out the financial planning of the event, ensure budget management, and coordinate the efficient use of financial resources. During the event, she is responsible for ensuring the sustainability of the financial order by monitoring the income-expenditure balance, organizing the necessary budgets, and producing strategic solutions to possible financial setbacks. At the same time, she contributes to the regular, reliable, and effective progress of the organization's economic processes by managing the finance team.",
      "team.finance_head2.name": "Hanife Gören",
      "team.finance_head2.title": "Finance Head",
      "team.finance_head2.text": "Hanife Gören serves as the Finance Head at the Liberte G20 event. In this context, she is responsible for managing sponsorship processes, planning the event budget, and ensuring the income-expenditure balance. At the same time, she coordinates all financial processes to proceed in a regular, transparent, and sustainable manner.",

      "team.empty.name": "Coming Soon",
      "team.empty.title": "New Member",
      "team.empty.text": "Stay tuned to join our team."
    },
    fr: {
      "nav.about": "À Propos",
      "nav.committees": "Nos Comités",
      "nav.team": "Notre Équipe",
      "nav.contact": "Contact",
      "hero.title": "Bienvenue",
      "hero.join_team": "Merci de votre vif intérêt.",
      "section.about.title": "À PROPOS DE NOUS",
      "section.about.body": "En tant qu'équipe Liberte G20, nous sommes un groupe de lycéens qui tentent de trouver des solutions aux problèmes mondiaux actuels du point de vue des pays du « Groupe des Vingt ». Ce qui distingue notre événement des autres événements du G20, c'est qu'il s'agit de la plus grande simulation indépendante du G20 en Turquie dans quatre langues différentes (turc, anglais, français et allemand). Avec cet événement, nous visons à offrir aux participants une expérience unique dans les domaines de la diplomatie internationale, de la planification économique et stratégique.",
      "section.about.date": "6 - 7 - 8 Juillet 2026",
      "section.committees.title": "Nos Comités",
      "section.committees.body": "Explorez les principaux comités, les domaines d'étude et les priorités fondamentales dans le cadre de G20Zirve.",
      "section.team.title": "NOTRE ÉQUIPE",
      "section.team.intro": "Découvrez notre équipe coordinatrice du sommet et leurs domaines d'expertise.",
      "section.contact.title": "CONTACT",
      "countdown.days": "Jours",
      "countdown.hours": "Heures",
      "countdown.minutes": "Minutes",
      "countdown.seconds": "Secondes",
      "team.coordinator.name": "Ahmed Faruk Kabar",
      "team.coordinator.title": "Coordinateur Général",
      "team.coordinator.text": "Ahmed Faruk Kabar, l'architecte visionnaire de notre événement Liberte G20, vise à offrir une expérience unique à nos participants grâce à sa vaste expérience. Ahmed, qui a 17 ans et est connu pour son intérêt pour la littérature, notamment l'œuvre culte de George Orwell, 1984, reflète sa profondeur intellectuelle dans chaque étape de l'organisation.",
      "team.coordinator.quote_intro": "Dans un message adressé à nos précieux participants, Ahmed Faruk Kabar résume la philosophie principale de l'événement en ces mots :",
      "team.coordinator.quote": "« Les véritables architectes de Liberte G20 sont vos idées originales. Notre priorité est de préparer le terrain professionnel où ces idées pourront voir le jour de la manière la plus efficace possible. »",
      "team.coordinator.footer": "Au nom de notre équipe d'organisation, nous avons hâte de vous rencontrer le jour de l'événement avec beaucoup d'enthousiasme.",
      "team.org_head.name": "Mehmet İbrahim Güler",
      "team.org_head.title": "Chef de l'Organisation du G20",
      "team.org_head.text": "En tant que chef de l'organisation du G20, je suis extrêmement fier de trouver des solutions aux problèmes mondiaux et de réunir les leaders de demain. Avec mon équipe, nous sommes prêts à créer un événement marquant en élevant l'esprit de diplomatie et de coopération au plus haut niveau.",
      "team.co_coordinator.name": "Musa Demirbilek",
      "team.co_coordinator.title": "Co-coordinateur Général",
      "team.co_coordinator.text": "Il occupe le poste de co-coordinateur général pour l'événement Liberte G20. Il assistera le coordinateur général Ahmed Faruk Kabar pour assurer l'harmonie et l'ordre dans l'organisation et la gestion de l'événement.",
      "team.field_head.name": "Berra Tezcan",
      "team.field_head.title": "Chef de Terrain",
      "team.field_head.text": "Berra Tezcan occupe le poste de chef de terrain pour l'événement Liberte G20. Sa mission est d'assurer l'ordre sur le terrain pendant l'événement, de coordonner l'orientation des participants et de veiller au bon déroulement du flux de terrain de l'organisation. En même temps, elle gère l'équipe de terrain pour apporter des solutions rapides aux problèmes potentiels et contribue à ce que l'expérience de l'événement soit ordonnée, sûre et efficace.",
      "team.admin_head.name": "Başak Begüm Ateş",
      "team.admin_head.title": "Responsable Administrative",
      "team.admin_head.text": "Başak Begüm Ateş occupe le poste de responsable administrative pour l'événement Liberte G20. Sa mission est de diriger et d'assister les administrateurs qui assureront l'ordre administratif au sein du comité, soutiendront les délégués et veilleront au bon déroulement des sessions.",
      "team.pr_heads.name": "Elanur Cömert & Irmak Küçükaslan",
      "team.pr_heads.title": "Responsables des Relations Publiques",
      "team.pr_heads.text": "Elanur Cömert et Irmak Küçükaslan, nées en 2010 et 2009, possèdent une solide expérience en communication stratégique et en gestion de marque. En tant que responsables PR de notre événement G20, elles renforcent le prestige de notre organisation en planifiant méticuleusement tous les processus, de la visibilité médiatique à la stratégie de contenu. Elles apportent une valeur ajoutée à notre équipe grâce à leurs perspectives visionnaires.",
      "team.security_head.name": "Mehmet Emin Özcan",
      "team.security_head.title": "Chef de la Sécurité",
      "team.security_head.text": "Mehmet Emin Özcan possède une vaste expérience dans les stratégies de sécurité et les opérations sur le terrain. En tant que chef de la sécurité du G20, il assure la mise en œuvre de protocoles de sécurité de haut niveau et la sécurité de tous les participants tout au long de l'événement.",
      "team.finance_head.name": "Eylül Saral",
      "team.finance_head.title": "Chef des Finances",
      "team.finance_head.text": "Eylül Saral occupe le poste de chef des finances lors de l'événement Liberte G20. Sa mission est d'assurer la planification financière de l'événement, d'assurer la gestion budgétaire et de coordonner l'utilisation efficace des ressources financières. Au cours de l'événement, elle est responsable d'assurer la pérennité de l'ordre financier en surveillant l'équilibre recettes-dépenses, en organisant les budgets nécessaires et en apportant des solutions stratégiques aux éventuels revers financiers. En même temps, elle contribue au déroulement régulier, fiable et efficace des processus économiques de l'organisation en gérant l'équipe financière.",
      "team.finance_head2.name": "Hanife Gören",
      "team.finance_head2.title": "Chef des Finances",
      "team.finance_head2.text": "Hanife Gören occupe le poste de chef des finances lors de l'événement Liberte G20. Dans ce contexte, elle est responsable de la gestion des processus de parrainage, de la planification du budget de l'événement et de l'assurance de l'équilibre recettes-dépenses. En même temps, elle coordonne tous les processus financiers afin qu'ils se déroulent de manière régulière, transparente et durable.",
      "team.empty.name": "À venir",
      "team.empty.title": "Nouveau membre",
      "team.empty.text": "Restez à l'écoute pour rejoindre notre équipe."
    },
    de: {
      "nav.about": "Über Uns",
      "nav.committees": "Ausschüsse",
      "nav.team": "Unser Team",
      "nav.contact": "Kontakt",
      "hero.title": "Willkommen",
      "hero.join_team": "Vielen Dank für Ihr großes Interesse.",
      "section.about.title": "ÜBER UNS",
      "section.about.body": "Als Liberte G20-Team sind wir eine Gruppe von Gymnasiasten, die versuchen, Lösungen für die heutigen globalen Probleme aus der Perspektive der „Gruppe der Zwanzig“-Länder zu finden. Was unsere Veranstaltung von anderen G20-Veranstaltungen unterscheidet, ist, dass sie die größte unabhängige G20-Simulation in der Türkei in vier verschiedenen Sprachen (Türkisch, Englisch, Französisch und Deutsch) ist.",
      "section.about.date": "6. - 7. - 8. Juli 2026",
      "section.committees.title": "Unsere Ausschüsse",
      "section.committees.body": "Entdecken Sie die Hauptausschüsse, Studienbereiche und Kernprioritäten im Rahmen von G20Zirve.",
      "section.team.title": "UNSER TEAM",
      "section.team.intro": "Entdecken Sie unser Team, das den Gipfel koordiniert, und ihre Fachgebiete.",
      "section.contact.title": "KONTAKT",
      "countdown.days": "Tage",
      "countdown.hours": "Stunden",
      "countdown.minutes": "Minuten",
      "countdown.seconds": "Sekunden",
      "team.coordinator.name": "Ahmed Faruk Kabar",
      "team.coordinator.title": "Generalkoordinator",
      "team.coordinator.text": "Ahmed Faruk Kabar, der visionäre Architekt unserer Liberte G20-Veranstaltung, möchte unseren Teilnehmern mit seiner umfangreichen Erfahrung ein einzigartiges Erlebnis bieten. Ahmed, der 17 Jahre alt ist, spiegelt seine intellektuelle Tiefe in jeder Phase der Organisation wider.",
      "team.coordinator.quote_intro": "Mit einer Nachricht an unsere geschätzten Teilnehmer fasst Ahmed Faruk Kabar die Hauptphilosophie der Veranstaltung wie folgt zusammen:",
      "team.coordinator.quote": "„Die eigentlichen Architekten der Liberte G20 sind Ihre originellen Ideen. Unsere Priorität ist es, den professionellen Boden zu bereiten.“",
      "team.coordinator.footer": "Im Namen unseres Organisationsteams freuen wir uns sehr darauf, Sie am Veranstaltungstag mit großer Begeisterung zu treffen.",
      "team.org_head.name": "Mehmet İbrahim Güler",
      "team.org_head.title": "G20-Organisationsleiter",
      "team.org_head.text": "Als G20-Organisationsleiter bin ich sehr stolz darauf, Lösungen für globale Probleme zu finden und die Führungskräfte der Zukunft zusammenzubringen. Gemeinsam mit meinem Team sind wir bereit, eine wegweisende Veranstaltung zu gestalten, indem wir den Geist der Diplomatie und Zusammenarbeit auf die höchste Ebene heben.",
      "team.co_coordinator.name": "Musa Demirbilek",
      "team.co_coordinator.title": "Co-Generalkoordinator",
      "team.co_coordinator.text": "Er fungiert als Co-Generalkoordinator für die Veranstaltung Liberte G20. Er wird den Generalkoordinator Ahmed Faruk Kabar dabei unterstützen, Harmonie und Ordnung in der Organisation und Leitung der Veranstaltung zu gewährleisten.",
      "team.field_head.name": "Berra Tezcan",
      "team.field_head.title": "Feldleiterin",
      "team.field_head.text": "Berra Tezcan fungiert als Feldleiterin für die Liberte G20-Veranstaltung. Ihre Aufgabe ist es, während der Veranstaltung für Ordnung auf dem Feld zu sorgen, die Einweisung der Teilnehmer zu koordinieren und den reibungslosen Ablauf des organisatorischen Feldflusses sicherzustellen. Gleichzeitig leitet sie das Feldteam, um schnelle Lösungen für potenzielle Probleme zu finden, und trägt dazu bei, dass die Veranstaltung ordnungsgemäß, sicher und effizient verläuft.",
      "team.admin_head.name": "Başak Begüm Ateş",
      "team.admin_head.title": "Admin-Leiterin",
      "team.admin_head.text": "Başak Begüm Ateş fungiert als Admin-Leiterin für die Liberte G20-Veranstaltung. Ihre Aufgabe ist es, die Admins zu leiten und zu unterstützen, die für die administrative Ordnung im Komitee sorgen, die Delegierten unterstützen und den reibungslosen Ablauf der Sitzungen gewährleisten.",
      "team.pr_heads.name": "Elanur Cömert & Irmak Küçükaslan",
      "team.pr_heads.title": "Leiterinnen für Öffentlichkeitsarbeit",
      "team.pr_heads.text": "Elanur Cömert und Irmak Küçükaslan, geboren 2010 und 2009, verfügen über fundierte Erfahrung in strategischer Kommunikation und Markenmanagement. Als PR-Leiterinnen unserer G20-Veranstaltung stärken sie das Ansehen unserer Organisation, indem sie alle Prozesse von der Medienpräsenz bis zur Content-Strategie akribisch planen. Mit ihren visionären Perspektiven bereichern sie unser Team.",
      "team.security_head.name": "Mehmet Emin Özcan",
      "team.security_head.title": "Sicherheitsleiter",
      "team.security_head.text": "Mehmet Emin Özcan verfügt über fundierte Erfahrung in Sicherheitsstrategien und Feldeinsätzen. Als G20-Sicherheitsleiter sorgt er für die Umsetzung hochkarätiger Sicherheitsprotokolle und die Sicherheit aller Teilnehmer während der gesamten Veranstaltung.",
      "team.finance_head.name": "Eylül Saral",
      "team.finance_head.title": "Finanzleiterin",
      "team.finance_head.text": "Eylül Saral fungiert als Finanzleiterin bei der Liberte G20-Veranstaltung. Ihre Aufgabe ist es, die Finanzplanung der Veranstaltung durchzuführen, die Budgetverwaltung sicherzustellen und die effiziente Nutzung der finanziellen Ressourcen zu koordinieren. Während der Veranstaltung ist sie dafür verantwortlich, die Nachhaltigkeit der Finanzordnung sicherzustellen, indem sie den Einnahmen-Ausgaben-Saldo überwacht, die notwendigen Budgets organisiert und strategische Lösungen für mögliche finanzielle Rückschläge erarbeitet. Gleichzeitig trägt sie durch die Leitung des Finanzteams zum ordnungsgemäßen, zuverlässigen und effektiven Fortschritt der wirtschaftlichen Prozesse der Organisation bei.",
      "team.finance_head2.name": "Hanife Gören",
      "team.finance_head2.title": "Finanzleiterin",
      "team.finance_head2.text": "Hanife Gören fungiert als Finanzleiterin bei der Liberte G20-Veranstaltung. In diesem Zusammenhang ist sie für die Verwaltung von Sponsoringprozessen, die Planung des Veranstaltungsbudgets und die Sicherstellung des Einnahmen-Ausgaben-Saldos verantwortlich. Gleichzeitig koordiniert sie alle finanziellen Prozesse, um einen ordnungsgemäßen, transparenten und nachhaltigen Ablauf zu gewährleisten.",
      "team.empty.name": "Demnächst",
      "team.empty.title": "Neues Mitglied",
      "team.empty.text": "Bleiben Sie dran, um unserem Team beizutreten."
    },
  };

  let currentLang = "tr";

  const applyTranslations = (lang) => {
    const dict = translations[lang] || translations.tr;
    const fallBack = translations.tr;
    const nodes = document.querySelectorAll("[data-i18n]");

    nodes.forEach((el) => {
      if (!(el instanceof HTMLElement)) return;
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      const value = dict[key] ?? fallBack[key];
      if (!value) return;

      el.classList.add("lang-changing");
      setTimeout(() => {
        el.textContent = value;
        el.classList.remove("lang-changing");
      }, 300);
    });
  };

  const closeMenu = () => {
    wrapper.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    // Close mobile menu if open
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".mobile-nav");
    if (menuBtn && mobileNav) {
      menuBtn.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
    }

    wrapper.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      closeMenu();
    }
  });

  options.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = opt.getAttribute("data-lang");
      if (!lang || lang === currentLang || !(lang in translations)) {
        closeMenu();
        return;
      }

      currentLang = lang;

      options.forEach((o) =>
        o.setAttribute("aria-selected", o === opt ? "true" : "false")
      );
      currentLabel.textContent = lang.toUpperCase();

      applyTranslations(lang);

      closeMenu();
    });
  });

  // Sayfa ilk yüklendiğinde varsayılan dili uygula
  applyTranslations(currentLang);
}

/**
 * Set the current year in the footer.
 */
function setCurrentYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Interactive mouse tracker for the Team section background.
 */
function initInteractiveBackground() {
  const sections = document.querySelectorAll("#about, #team");

  sections.forEach(section => {
    section.addEventListener("mousemove", (e) => {
      const rect = section.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      section.style.setProperty("--mouse-x", `${x}%`);
      section.style.setProperty("--mouse-y", `${y}%`);
      section.style.setProperty("--glow-opacity", "1");
    });

    section.addEventListener("mouseleave", () => {
      section.style.setProperty("--glow-opacity", "0");
    });
  });
}

/**
 * Handles the mobile navigation (hamburger menu) toggle and link interactions.
 */
function setupMobileMenu() {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (!menuBtn || !mobileNav) return;

  const toggleMenu = (e) => {
    if (e) e.stopPropagation();
    const isOpen = mobileNav.classList.contains("is-open");

    if (isOpen) {
      menuBtn.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
    } else {
      // Close language switcher if open
      const langWrapper = document.querySelector(".language-switcher");
      if (langWrapper) langWrapper.classList.remove("is-open");

      menuBtn.classList.add("is-active");
      mobileNav.classList.add("is-open");
    }
  };

  menuBtn.addEventListener("click", toggleMenu);

  // Close menu when a link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!mobileNav.contains(e.target) && !menuBtn.contains(e.target)) {
      menuBtn.classList.remove("is-active");
      mobileNav.classList.remove("is-open");
    }
  });
}
