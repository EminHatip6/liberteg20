// G20Zirve Frontend Interactions
// - Smooth scrolling for navbar links
// - 100-day live countdown timer
// - Section + hero animations via Intersection Observer
// - Language switching for tüm metinler (hero metinleri hariç)

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScroll();
  setupCountdown("June 23, 2026 09:00:00");
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
      "hero.join_team": "Ekip üyesi olarak başvur!",
      "section.about.title": "HAKKIMIZDA",
      "section.about.body":
        "Liberte G20 ekibi olarak bizler günümüz küresel problemlerine \"Group of Twenty\" yani \"Yirmililer Grubu\" ülkeleri perspektifinden çözüm bulmaya çalışan bir grup liseli genciz. Etkinliğimizi diğer G20 etkinliklerinden ayıran şey ise dört farklı dilde (Türkçe, İngilizce, Fransızca ve Almanca) Türkiye'nin en büyük bağımsız G20 Simülasyonu olmasıdır. Bizler bu etkinlikle katılımcılara uluslararası diplomasi, ekonomik ve stratejik planlama alanlarında eşsiz bir deneyim sunmayı hedefliyoruz.",
      "section.about.date": "23 - 24 - 25 Haziran 2026",
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
      "team.pr.name": "Irmak Küçükaslan & Elanur Cömert",
      "team.pr.title": "Halkla İlişkiler",
      "team.pr.text": "Irmak Küçükaslan ve Elanur Cömert 2009 ve 2010 yılında doğmuş olup stratejik iletişim ve marka yönetimi alanında güçlü bir deneyime sahiptirler. G20 etkinliğimizin PR Başkanları olarak, organizasyonumuzun medya görünürlüğünden içerik stratejisine kadar tüm süreçleri titizlikle planlayarak etkinliğimizin prestijini güçlendirmektedirler.",
      "team.gs.name": "Işıl Işıklı",
      "team.gs.title": "Genel Sekreter",
      "team.gs.text": "Organizasyonun idari ve operasyonel süreçlerini titizlikle yönetmektedir. Stratejik planlama, ekip koordinasyonu ve kriz yönetimi konularındaki yetkinliğiyle etkinliğin sorunsuz ilerlemesini sağlamaktadır.",
      "team.hr.name": "Nisanur Zor",
      "team.hr.title": "İnsan Kaynakları",
      "team.hr.text": "İnsan ilişkilerine önem veren ve ekip çalışmasını ön planda tutan bir anlayışla görev yapmaktadır. Organizasyon sürecinde adil, düzenli ve uyumlu bir çalışma ortamı oluşturmayı hedeflemektedir.",
      "team.admin.name": "Başak Begüm Ateş",
      "team.admin.title": "Admin Başkanı",
      "team.admin.text": "Ben Başak Begüm Ateş Liberte G20 etkinliğinde Admin Başkanı olarak görev yapıyorum. Görevim, komite içindeki idari düzeni sağlayacak, delegelere destek olacak ve oturumların düzenli ilerlemesini sağlayacak adminlere başkanlık yaparak yardımcı olmaktır.",
      "team.saha.name": "Baran Eren Bayraktutar ve Yaren Yılmaz",
      "team.saha.title": "Saha Yönetimi",
      "team.saha.text": "G20 etkinliğimizin saha yönetiminden sorumlu olan Baran Eren Bayraktutar ve Yaren Yılmaz, etkinlik alanındaki düzenin sağlanması, ekiplerin koordinasyonu ve program akışının sorunsuz ilerlemesinden sorumludur. Kriz anlarında hızlı karar alma becerisi ve güçlü iletişimi sayesinde ekibimize saha yönetiminde disiplinli ve güvenilir bir yapı kazandırmaktadır.",
      "team.it.name": "Sare Nisan Danışmaz",
      "team.it.title": "Tasarım-IT Başkanı",
      "team.it.text": "2011 doğumlu Sare Nisan Danışmaz, 4 yıllık tasarım eğitimiyle G20 etkinliğimizin Tasarım-IT Başkanı olarak görev almaktadır. Sosyal medya ve tasarım süreçlerini yöneterek ekibimize yaratıcı uzmanlığıyla değer katmaktadır. Büyük bir Şebnem Ferah dinleyicisidir.",
      "team.security.name": "Mehmet Emin Özcan",
      "team.security.title": "Güvenlik Başkanı",
      "team.security.text": "Mehmet Emin Özcan, güvenlik stratejileri ve saha operasyonları alanında derin bir tecrübeye sahiptir. G20 Güvenlik Başkanı olarak, etkinlik boyunca üst düzey güvenlik protokollerinin uygulanmasını ve tüm katılımcıların emniyetini sağlamaktadır.",
      "team.member8.name": "Zeynep Uyanık",
      "team.member8.title": "Akademi Başkanı",
      "team.member8.text": "Akademi alanında lise hayatının başından beri etkin rol almış olup fazlaca deneyime sahiptir. Asıl alanı psikiyatri ve nörobilimdir. Etkinliğimizin akademik düzeninden ve kalitesinden sorumludur. Sizlere kaliteli bir deneyim sunmayı ve bu etkinliği akademik açıdan herkes için besleyici, üst segmentte hale getirmeyi dört gözle bekliyor.",
      "team.member9.name": "Kaan Yalçın",
      "team.member9.title": "Akademi Eş Başkanı",
      "team.member9.text": "Lise yıllarının başından itibaren akademik çalışmalara ilgi göstermiş ve çeşitli etkinliklerde görev almıştır. İktisat ve finansal alanlarda yoğunlaşmakta olup, bu doğrultuda çalışmalar yürütmektedir. Organizasyonumuzda akademik planlama ve içerik sürecinden sorumludur. Etkinliğin düzenli, anlaşılır ve katılımcılar açısından faydalı bir şekilde ilerlemesini hedeflemektedir.",
      "team.member10.name": "Ahmet Tarık Kabasakal",
      "team.member10.title": "Kriz Başkanı",
      "team.member10.text": "Akademi ve kriz alanında 3 senelik derin bir tecrübeye sahiptir. G20 Etkinliğimizde kriz başkanı olarak akademik oturumları düzenlemek ve katılımcılarımıza hem akademik hem eğlenceli oturumlar düzenlemekle görevlidir. Kendisi 2008 doğumlu Mümtaz Turhan Sosyal Bilimler Lisesi 11. sınıf öğrencisidir."
    },
    en: {
      "nav.about": "About Us",
      "nav.committees": "Our Committees",
      "nav.team": "Our Team",
      "nav.contact": "Contact",
      "hero.title": "Welcome",
      "hero.join_team": "Join as a team member!",
      "section.about.title": "ABOUT US",
      "section.about.body":
        "As the Liberte G20 team, we are a group of high school students trying to find solutions to today's global problems from the perspective of the \"Group of Twenty\" countries. What distinguishes our event from other G20 events is that it is Turkey's largest independent G20 Simulation in four different languages (Turkish, English, French, and German). With this event, we aim to offer participants a unique experience in the fields of international diplomacy, economic and strategic planning.",
      "section.about.date": "June 23 - 24 - 25, 2026",
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
      "team.pr.name": "Irmak Küçükaslan & Elanur Cömert",
      "team.pr.title": "Public Relations",
      "team.pr.text": "Irmak Küçükaslan and Elanur Cömert, born in 2009 and 2010, have strong experience in strategic communication and brand management. As the PR Heads of our G20 event, they strengthen the prestige of our event by meticulously planning all processes from media visibility to content strategy.",
      "team.gs.name": "Işıl Işıklı",
      "team.gs.title": "General Secretary",
      "team.gs.text": "Meticulously manages the administrative and operational processes of the organization. Ensures the smooth progress of the event with her competence in strategic planning, team coordination, and crisis management.",
      "team.hr.name": "Nisanur Zor",
      "team.hr.title": "Human Resources",
      "team.hr.text": "Works with an understanding that values human relations and prioritizes teamwork. Aims to create a fair, orderly, and harmonious working environment during the organization process.",
      "team.admin.name": "Başak Begüm Ateş",
      "team.admin.title": "Admin Head",
      "team.admin.text": "I am Başak Begüm Ateş, serving as the Admin Head in the Liberte G20 event. My duty is to lead and assist admins who will ensure administrative order within the committee, support delegates, and ensure the sessions progress smoothly.",
      "team.saha.name": "Baran Eren Bayraktutar & Yaren Yılmaz",
      "team.saha.title": "Field Management",
      "team.saha.text": "Responsible for the field management of our G20 event, Baran Eren Bayraktutar and Yaren Yılmaz are in charge of ensuring order in the event area, coordinating teams, and the smooth progress of the program flow. They provide a disciplined and reliable structure thanks to their quick decision-making and strong communication.",
      "team.it.name": "Sare Nisan Danışmaz",
      "team.it.title": "Design-IT Head",
      "team.it.text": "Born in 2011, Sare Nisan Danışmaz, with 4 years of design education, serves as the Design-IT Head of our G20 event. She adds value to our team with her creative expertise by managing social media and design processes. She is a big fan of Şebnem Ferah.",
      "team.security.name": "Mehmet Emin Özcan",
      "team.security.title": "Head of Security",
      "team.security.text": "Mehmet Emin Özcan has deep experience in the field of security strategies and field operations. As the G20 Head of Security, he ensures the implementation of high-level security protocols and the safety of all participants throughout the event.",
      "team.member8.name": "Zeynep Uyanık",
      "team.member8.title": "Academy President",
      "team.member8.text": "Has been active in the academic field since the beginning of high school. Her main focus is psychiatry and neuroscience. Responsible for academic order and quality.",
      "team.member9.name": "Kaan Yalçın",
      "team.member9.title": "Academy Co-President",
      "team.member9.text": "Interested in academic studies since early high school years. Concentrates on economics and finance, responsible for academic planning and content process.",
      "team.member10.name": "Ahmet Tarık Kabasakal",
      "team.member10.title": "Crisis Head",
      "team.member10.text": "Has 3 years of deep experience in academy and crisis management. Responsible for organizing academic and fun crisis sessions. Born in 2008, 11th-grade student at Mümtaz Turhan Social Sciences High School."
    },
    fr: {
      "nav.about": "À Propos",
      "nav.committees": "Nos Comités",
      "nav.team": "Notre Équipe",
      "nav.contact": "Contact",
      "hero.title": "Bienvenue",
      "hero.join_team": "Postulez en tant que membre !",
      "section.about.title": "À PROPOS DE NOUS",
      "section.about.body": "En tant qu'équipe Liberte G20, nous sommes un groupe de lycéens qui tentent de trouver des solutions aux problèmes mondiaux actuels du point de vue des pays du « Groupe des Vingt ». Ce qui distingue notre événement des autres événements du G20, c'est qu'il s'agit de la plus grande simulation indépendante du G20 en Turquie dans quatre langues différentes (turc, anglais, français et allemand). Avec cet événement, nous visons à offrir aux participants une expérience unique dans les domaines de la diplomatie internationale, de la planification économique et stratégique.",
      "section.about.date": "23 - 24 - 25 Juin 2026",
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
      "team.pr.name": "Irmak Küçükaslan & Elanur Cömert",
      "team.pr.title": "Relations Publiques",
      "team.pr.text": "Irmak Küçükaslan et Elanur Cömert, nées en 2009 et 2010, possèdent une solide expérience en communication stratégique et en gestion de marque. En tant que responsables PR de notre événement G20, elles renforcent le prestige de notre événement en planifiant méticuleusement tous les processus.",
      "team.gs.name": "Işıl Işıklı",
      "team.gs.title": "Secrétaire Générale",
      "team.gs.text": "Gère méticuleusement les processus administratifs et opérationnels de l'organisation. Assure le bon déroulement de l'événement grâce à sa compétence en planification stratégique et coordination d'équipe.",
      "team.hr.name": "Nisanur Zor",
      "team.hr.title": "Ressources Humaines",
      "team.hr.text": "Travaille avec une compréhension qui valorise les relations humaines et donne la priorité au travail d'équipe. Vise à créer un environnement de travail équitable, ordonné et harmonieux.",
      "team.admin.name": "Başak Begüm Ateş",
      "team.admin.title": "Responsable Admin",
      "team.admin.text": "Je suis Başak Begüm Ateş, responsable administrative de l'événement Liberte G20. Mon devoir est de diriger et d'assister les administrateurs qui assureront l'ordre administratif au sein du comité.",
      "team.saha.name": "Baran Eren Bayraktutar & Yaren Yılmaz",
      "team.saha.title": "Gestion de Terrain",
      "team.saha.text": "Responsables de la gestion de terrain de notre événement G20, Baran Eren Bayraktutar et Yaren Yılmaz sont chargés d'assurer l'ordre, de coordonner les équipes et du bon déroulement du programme.",
      "team.it.name": "Sare Nisan Danışmaz",
      "team.it.title": "Responsable Design-IT",
      "team.it.text": "Née en 2011, Sare Nisan Danışmaz, avec 4 ans de formation en design, est la responsable Design-IT de notre événement. Elle apporte une valeur ajoutée avec son expertise créative. Elle est une grande fan de Şebnem Ferah.",
      "team.security.name": "Mehmet Emin Özcan",
      "team.security.title": "Chef de la Sécurité",
      "team.security.text": "Mehmet Emin Özcan possède une vaste expérience dans le domaine des stratégies de sécurité et des opérations sur le terrain. En tant que chef de la sécurité du G20, il assure la mise en œuvre de protocoles de sécurité de haut niveau et la sécurité de tous les participants tout au long de l'événement.",
      "team.member8.name": "Zeynep Uyanık",
      "team.member8.title": "Présidente de l'Académie",
      "team.member8.text": "Active dans le domaine académique depuis le début du lycée, passionnée par la psychiatrie et les neurosciences.",
      "team.member9.name": "Kaan Yalçın",
      "team.member9.title": "Co-président de l'Académie",
      "team.member9.text": "Concentré sur l'économie et la finance, responsable de la planification académique et du contenu.",
      "team.member10.name": "Ahmet Tarık Kabasakal",
      "team.member10.title": "Chef de Crise",
      "team.member10.text": "Possède 3 ans d'expérience approfondie dans l'académie et la gestion de crise. Responsable de l'organisation des sessions."
    },
    de: {
      "nav.about": "Über Uns",
      "nav.committees": "Ausschüsse",
      "nav.team": "Unser Team",
      "nav.contact": "Kontakt",
      "hero.title": "Willkommen",
      "hero.join_team": "Als Mitglied bewerben!",
      "section.about.title": "ÜBER UNS",
      "section.about.body": "Als Liberte G20-Team sind wir eine Gruppe von Gymnasiasten, die versuchen, Lösungen für die heutigen globalen Probleme aus der Perspektive der „Gruppe der Zwanzig“-Länder zu finden. Was unsere Veranstaltung von anderen G20-Veranstaltungen unterscheidet, ist, dass sie die größte unabhängige G20-Simulation in der Türkei in vier verschiedenen Sprachen (Türkisch, Englisch, Französisch und Deutsch) ist.",
      "section.about.date": "23. - 24. - 25. Juni 2026",
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
      "team.pr.name": "Irmak Küçükaslan & Elanur Cömert",
      "team.pr.title": "Öffentlichkeitsarbeit",
      "team.pr.text": "Irmak Küçükaslan und Elanur Cömert verfügen über langjährige Erfahrung in strategischer Kommunikation und Markenmanagement. Als PR-Leiter unseres G20-Events stärken sie das Prestige unserer Veranstaltung.",
      "team.gs.name": "Işıl Işıklı",
      "team.gs.title": "Generalsekretärin",
      "team.gs.text": "Verwaltet akribisch die administrativen und operativen Prozesse der Organisation. Sowie die Koordination des gesamten Teams.",
      "team.hr.name": "Nisanur Zor",
      "team.hr.title": "Personalwesen",
      "team.hr.text": "Arbeitet mit einem Verständnis, das menschliche Beziehungen schätzt und Teamarbeit priorisiert. Ziel ist ein faires Arbeitsumfeld.",
      "team.admin.name": "Başak Begüm Ateş",
      "team.admin.title": "Admin-Leiterin",
      "team.admin.text": "Ich bin Başak Begüm Ateş, Admin-Leiterin beim Liberte G20 Event. Meine Aufgabe ist es, die Admins zu leiten, die die Ordnung im Komitee gewährleisten.",
      "team.saha.name": "Baran Eren Bayraktutar & Yaren Yılmaz",
      "team.saha.title": "Feldmanagement",
      "team.saha.text": "Verantwortlich für das Feldmanagement unserer G20-Veranstaltung. Baran Eren Bayraktutar und Yaren Yılmaz sorgen für Ordnung im Veranstaltungsbereich.",
      "team.it.name": "Sare Nisan Danışmaz",
      "team.it.title": "Design-IT Leiterin",
      "team.it.text": "Sare Nisan Danışmaz, mit 4 Jahren Designausbildung, ist die Design-IT-Leiterin unseres G20-Events. Sie verwaltet Social Media und Designprozesse.",
      "team.security.name": "Mehmet Emin Özcan",
      "team.security.title": "Leiter der Sicherheit",
      "team.security.text": "Mehmet Emin Özcan verfügt dabeit über fundierte Erfahrung im Bereich der Sicherheitsstrategien und Feldeinsätze. Als G20-Sicherheitschef sorgt er für die Umsetzung hochkarätiger Sicherheitsprotokolle und die Sicherheit aller Teilnehmer während der gesamten Veranstaltung.",
      "team.member8.name": "Zeynep Uyanık",
      "team.member8.title": "Akademie-Präsidentin",
      "team.member8.text": "Seit Beginn der High School im akademischen Bereich tätig. Fokus auf Psychiatrie und Neurowissenschaften.",
      "team.member9.name": "Kaan Yalçın",
      "team.member9.title": "Akademie-Co-Präsident",
      "team.member9.text": "Konzentriert sich auf Wirtschaft und Finanzen, verantwortlich für die akademische Planung.",
      "team.member10.name": "Ahmet Tarık Kabasakal",
      "team.member10.title": "Krisenchef",
      "team.member10.text": "Verfügt über 3 Jahre fundierte Erfahrung in Akademie ve Krisenmanagement. Verantwortlich für die Organisation der Sitzungen."
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
