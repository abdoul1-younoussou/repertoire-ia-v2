const DATA_FILES = { tools: "data/tools.json", courses: "data/formations.json", tutorials: "data/tutorials.json" };
const catalog = { tools: [], courses: [], tutorials: [] };
const $ = (id) => document.getElementById(id);
let language = "fr";

const I18N = {
  fr: {
    skip:"Aller au contenu", menu:"Menu", nav_tools:"Outils", nav_learning:"Apprentissage", nav_tutorials:"Tutoriels", nav_monitor:"Surveillance",
    hero_eyebrow:"Explorer · Apprendre · Créer", hero_title:'L’intelligence artificielle, <span>à portée de main.</span>',
    hero_lead:"Un catalogue organisé d’outils IA, de ressources d’apprentissage et de tutoriels pour apprendre et passer à l’action.",
    hero_cta_tools:"Explorer les outils", hero_cta_learning:"Voir les ressources", hero_proof:"Ressources classées · liens à vérifier",
    chip_creativity:"✦ Créativité", chip_productivity:"⌘ Productivité", chip_learning:"◈ Apprentissage",
    stat_tools:"Outils répertoriés", stat_categories:"Catégories", stat_learning:"Ressources d’apprentissage", stat_tutorials:"Tutoriels vérifiés",
    catalog_eyebrow:"Le catalogue", catalog_title:"Trouver le bon outil", catalog_desc:"Parcourez les ressources ou combinez les filtres pour affiner votre recherche.",
    search_label:"Rechercher un outil", search_placeholder:"Rechercher par nom, catégorie ou description…", category:"Catégorie", all_categories:"Toutes les catégories",
    priority:"Priorité", all_priorities:"Tous les niveaux", reset:"Réinitialiser", loading_tools:"Chargement des outils…", sort_alpha:"Tri alphabétique",
    learning_eyebrow:"Monter en compétences", learning_title:"Ressources d’apprentissage", learning_desc:"Des liens vers les ressources pédagogiques des éditeurs et organismes.",
    tutorial_eyebrow:"Apprendre en pratique", tutorial_title:"Tutoriels & guides", tutorial_desc:"Des guides et tutoriels officiels pour apprendre à utiliser les outils IA.",
    monitor_eyebrow:"Qualité des ressources", monitor_title:"Surveillance des liens", monitor_desc:"Consultez le dernier rapport généré par le vérificateur automatique.",
    report_pending:"Rapport en attente", dash_total:"Total vérifié", dash_ok:"Fonctionnels", dash_broken:"Liens morts", dash_redirect:"Redirections",
    dash_nonverifiable:"Non vérifiables", dash_temporary:"Erreurs temporaires", report_none:"Aucun rapport de surveillance publié. Lancez le workflow de vérification dans GitHub Actions, puis republiez le rapport.",
    refresh:"Recharger le rapport", monitor_note:"Les réponses 401, 403 et 429 sont classées « non vérifiables » et ne sont pas assimilées à des liens morts. Aucun lien n’est modifié automatiquement.",
    footer_text:"Un répertoire indépendant pour découvrir des outils et ressources d’intelligence artificielle. Les marques et services référencés appartiennent à leurs éditeurs.",
    back_top:"Retour en haut ↑", tool_sheet:"Fiche outil", count_tools:(n,total)=>`${n} outil(s) affiché(s) sur ${total}`,
    empty_tools:"Aucun outil ne correspond à ces critères.", no_courses:"Aucune ressource d’apprentissage disponible.",
    no_tutorials:"Aucun tutoriel n’est disponible pour le moment.", site_official:"Site officiel ↗", training_link:"Ressource d’apprentissage ↗",
    details:"Voir la fiche →", category_label:"Catégorie", priority_label:"Priorité", status_label:"État éditorial", status_value:"À vérifier",
    id_label:"Identifiant", learning_available:"Lien d’apprentissage indiqué", learning_missing:"Aucun lien d’apprentissage indiqué",
    official_link_missing:"Aucun lien externe valide n’est renseigné.", details_fallback:"Aucune description complémentaire n’a été fournie.",
    status_report_loaded:"Rapport chargé", status_report_pending:"Rapport en attente", report_date:"Dernière vérification : ", tutorial_meta:"Niveau", tutorial_language:"Langue", tutorial_duration:"Durée", tutorial_format:"Format", tutorial_provider:"Éditeur", report_details:"Résultats détaillés", report_empty_results:"Aucun détail de lien dans ce rapport.", report_status:{ok:"Fonctionnel",redirect:"Redirection",broken:"Lien mort",non_verifiable:"Non vérifiable",temporary_error:"Erreur temporaire",connection_error:"Erreur de connexion",invalid_url:"URL invalide"}, report_run_help:"Pour produire un nouveau rapport : GitHub → Actions → Vérification hebdomadaire des liens → Run workflow. Cette action nécessite que le projet soit dans un dépôt GitHub.",
    report_load_error:"Aucun rapport disponible. Le site statique ne peut pas exécuter le vérificateur : lancez le workflow GitHub Actions, puis rechargez ce rapport.",
    resource_notice:"Lien répertorié dans le catalogue source. Vérifiez les fonctionnalités, les tarifs, la langue et les conditions d’accès auprès de l’éditeur.",
    data_error:"Certaines données n’ont pas pu être chargées : ", language_name:"Français", close:"Fermer la fiche",
    priorities:{"Niveau 1 — Indispensables":"Niveau 1 — Indispensables","Niveau 2 — Très utiles":"Niveau 2 — Très utiles","Niveau 3 — Spécialisés":"Niveau 3 — Spécialisés","À classer":"À classer"},
    categories:{}
  },
  en: {
    skip:"Skip to content", menu:"Menu", nav_tools:"Tools", nav_learning:"Learning", nav_tutorials:"Tutorials", nav_monitor:"Link status",
    hero_eyebrow:"Explore · Learn · Create", hero_title:'Artificial intelligence, <span>within reach.</span>',
    hero_lead:"An organized directory of AI tools and learning resources to help you explore and take action.",
    hero_cta_tools:"Explore tools", hero_cta_learning:"Browse resources", hero_proof:"Organized listings · links require verification",
    chip_creativity:"✦ Creativity", chip_productivity:"⌘ Productivity", chip_learning:"◈ Learning",
    stat_tools:"Listed tools", stat_categories:"Categories", stat_learning:"Learning resources", stat_tutorials:"Verified tutorials",
    catalog_eyebrow:"The directory", catalog_title:"Find the right tool", catalog_desc:"Browse resources or combine filters to refine your search.",
    search_label:"Search for a tool", search_placeholder:"Search by name, category or description…", category:"Category", all_categories:"All categories",
    priority:"Priority", all_priorities:"All levels", reset:"Reset filters", loading_tools:"Loading tools…", sort_alpha:"Alphabetical order",
    learning_eyebrow:"Build your skills", learning_title:"Learning resources", learning_desc:"Links to learning resources published by providers and organizations.",
    tutorial_eyebrow:"Learn by doing", tutorial_title:"Tutorials & guides", tutorial_desc:"Official guides and tutorials to learn how to use AI tools.",
    monitor_eyebrow:"Resource quality", monitor_title:"Link monitoring", monitor_desc:"View the latest report generated by the automated link checker.",
    report_pending:"Report pending", dash_total:"Checked", dash_ok:"Working", dash_broken:"Broken links", dash_redirect:"Redirects",
    dash_nonverifiable:"Not verifiable", dash_temporary:"Temporary errors", report_none:"No monitoring report has been published. Run the link-check workflow in GitHub Actions, then publish the report.",
    refresh:"Reload report", monitor_note:"HTTP 401, 403 and 429 responses are marked as not verifiable, not as broken links. Links are never changed automatically.",
    footer_text:"An independent directory for discovering AI tools and resources. Listed brands and services belong to their respective providers.",
    back_top:"Back to top ↑", tool_sheet:"Tool details", count_tools:(n,total)=>`${n} of ${total} tool(s) shown`,
    empty_tools:"No tools match these filters.", no_courses:"No learning resources are currently available.",
    no_tutorials:"No tutorials are currently available.", site_official:"Official website ↗", training_link:"Learning resource ↗",
    details:"View details →", category_label:"Category", priority_label:"Priority", status_label:"Editorial status", status_value:"Needs review",
    id_label:"Identifier", learning_available:"Learning link listed", learning_missing:"No learning link listed",
    official_link_missing:"No valid external link is listed.", details_fallback:"No additional description was provided.",
    status_report_loaded:"Report loaded", status_report_pending:"Report pending", report_date:"Last checked: ", tutorial_meta:"Level", tutorial_language:"Language", tutorial_duration:"Duration", tutorial_format:"Format", tutorial_provider:"Provider", report_details:"Detailed results", report_empty_results:"No link details in this report.", report_status:{ok:"Working",redirect:"Redirect",broken:"Broken link",non_verifiable:"Not verifiable",temporary_error:"Temporary error",connection_error:"Connection error",invalid_url:"Invalid URL"}, report_run_help:"To create a new report: GitHub → Actions → Weekly link check → Run workflow. The project must be in a GitHub repository.",
    report_load_error:"No report is available. A static site cannot run the checker: start the GitHub Actions workflow, then reload this report.",
    resource_notice:"Listed in the source catalogue. Confirm features, pricing, languages and access conditions with the provider.",
    data_error:"Some data could not be loaded: ", language_name:"English", close:"Close tool details",
    priorities:{"Niveau 1 — Indispensables":"Level 1 — Essential","Niveau 2 — Très utiles":"Level 2 — Useful","Niveau 3 — Spécialisés":"Level 3 — Specialized","À classer":"Unclassified"},
    categories:{
      "IA et rédaction":"AI & writing","IA rédaction":"AI writing","Design et contenu visuel":"Design & visual content",
      "Vidéo et audio":"Video & audio","Stockage et collaboration":"Storage & collaboration","Productivité":"Productivity",
      "Documents":"Documents","Tableurs et données":"Spreadsheets & data","Présentations":"Presentations","Email":"Email",
      "Réunions":"Meetings","Gestion de projet":"Project management","Réseaux sociaux":"Social media","Sécurité":"Security",
      "SEO":"SEO","Data visualization":"Data visualization","Développement":"Development","Site web":"Website",
      "Automatisation":"Automation","IA images":"AI images","No-code":"No-code","Collaboration":"Collaboration",
      "Emailing":"Email marketing","IA vidéo":"AI video","Base de données":"Database","Publicité":"Advertising",
      "CRM":"CRM","SEO et contenu":"SEO & content","E-commerce":"E-commerce","Paiement":"Payments","PDF":"PDF",
      "Rédaction":"Writing","IA audio":"AI audio","Suivi du temps":"Time tracking","Tableau blanc":"Whiteboard",
      "Recherche de mots-clés":"Keyword research","Vente de produits numériques":"Digital product sales","Comptabilité":"Accounting",
      "IA musique":"AI music","Notes":"Notes","Rendez-vous":"Appointments","Cartes mentales":"Mind maps",
      "Tableurs":"Spreadsheets","Bureautique":"Office productivity","Hébergement web":"Web hosting","SEO WordPress":"WordPress SEO",
      "Performance web":"Web performance","Analyse utilisateur":"User analytics","Facturation":"Invoicing",
      "Design":"Design","Vidéo":"Video","CRM et vente":"CRM & sales","IA et recherche":"AI & research",
      "Traduction":"Translation","Site web et design":"Website & design","Analyse de données":"Data analysis",
      "SEO technique":"Technical SEO","Analyse concurrentielle":"Competitor analysis","Newsletter":"Newsletter",
      "Finance":"Finance","Organisation créative":"Creative organization","Sécurité web":"Web security",
      "Certificats SSL":"SSL certificates","Transfert de fichiers":"File transfer","Stockage":"Storage",
      "Marketing et CRM":"Marketing & CRM","Design IA":"AI design","Formation Google":"Google training",
      "Plateforme IA":"AI platform","Analytics":"Analytics","SEO et recherche":"SEO & research","Vidéo et communication":"Video & communication"
    }
  }
};

function t(key) { return I18N[language][key] ?? I18N.fr[key] ?? key; }
function safeHttpUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function localizedName(item) {
  return language === "en" ? (item.name_en || item.name || "—") : (item.name || "—");
}
function localizedDescription(item) {
  return language === "en" ? (item.description_en || item.description_fr || item.description || t("resource_notice"))
    : (item.description_fr || item.description || t("resource_notice"));
}
function categoryName(value) {
  return language === "en" ? (I18N.en.categories[value] || value) : value;
}
function priorityName(value) {
  return language === "en" ? (I18N.en.priorities[value] || value) : value;
}
function makeLink(label, value) {
  const href = safeHttpUrl(value);
  if (!href) return null;
  const a = element("a", "text-link", label);
  a.href = href;
  // Ouvrir dans le même onglet pour permettre le retour au catalogue avec le navigateur.
  a.removeAttribute("target");
  return a;
}
function openToolDetails(item) {
  const dialog = $("tool-dialog"), content = $("dialog-content");
  content.replaceChildren();
  content.append(element("h2", "", item.name || "—"));
  content.append(element("p", "detail-description", localizedDescription(item)));
  const meta = element("div", "detail-meta");
  const fields = [
    [t("category_label"), categoryName(item.category || "—")],
    [t("priority_label"), priorityName(item.priority || "—")],
    [t("status_label"), t("status_value")],
    [t("id_label"), item.id || "—"],
    [t("training_link"), item.training_url ? t("learning_available") : t("learning_missing")]
  ];
  fields.forEach(([label,value]) => {
    const cell = element("div"); cell.append(element("small","",label),element("strong","",value)); meta.append(cell);
  });
  content.append(meta);
  const note = element("p","verification-note",t("resource_notice"));
  content.append(note);
  const links = element("div", "dialog-links");
  const official = makeLink(t("site_official"), item.url); if (official) links.append(official);
  const training = makeLink(t("training_link"), item.training_url); if (training) links.append(training);
  if (!links.childElementCount) links.append(element("p","empty",t("official_link_missing")));
  content.append(links);
  if (typeof dialog.showModal === "function") dialog.showModal();
}
function createToolCard(item) {
  const card = element("article","card");
  const top = element("div","card-top");
  top.append(element("span","category-label",categoryName(item.category || "Other")));
  const flags = element("span","card-flags");
  if (item.priority) flags.append(element("span","priority",priorityName(item.priority)));
  flags.append(element("span","verification-badge",t("status_value")));
  top.append(flags);
  card.append(top,element("h3","",localizedName(item)),element("p","card-description",localizedDescription(item)));
  const actions = element("div","card-actions");
  const official = makeLink(t("site_official"),item.url); if (official) actions.append(official);
  const details = element("button","details-button",t("details"));
  details.type = "button"; details.addEventListener("click",()=>openToolDetails(item)); actions.append(details);
  card.append(actions);
  return card;
}
function createResourceCard(item, type) {
  const card = element("article","card");
  card.append(element("div","card-top",categoryName(item.category || "Resource")));
  card.append(element("h3","",localizedName(item)),element("p","card-description",localizedDescription(item)));
  if (type === "tutorial") {
    const meta = element("dl","tutorial-meta");
    const entries = [[t("tutorial_provider"),item.provider],[t("tutorial_meta"),language === "en" ? (item.level_en || item.level) : item.level],[t("tutorial_language"),item.language],[t("tutorial_format"),item.format],[t("tutorial_duration"),item.duration]];
    entries.filter(([,value])=>value).forEach(([label,value])=>{meta.append(element("dt","",label),element("dd","",value));});
    card.append(meta);
    card.append(element("p","verification-note",item.verification_status || t("status_value")));
  } else {
    card.append(element("p","verification-note",t("resource_notice")));
  }
  const link = makeLink(type === "course" ? t("training_link") : t("site_official"),item.url);
  if (link) card.append(link);
  return card;
}
function renderTools(items) {
  const target = $("tools-list"); target.replaceChildren();
  if (!items.length) { target.append(element("p","empty",t("empty_tools"))); return; }
  const groups = new Map();
  items.slice().sort((a,b)=>(a.name||"").localeCompare(b.name||"",language))
    .forEach(item=>{const category=item.category||"Other";if(!groups.has(category))groups.set(category,[]);groups.get(category).push(item);});
  [...groups.entries()].sort((a,b)=>categoryName(a[0]).localeCompare(categoryName(b[0]),language))
    .forEach(([name,list])=>{
      const section=element("section","category-group");
      const heading=element("h3","category-heading");
      heading.append(document.createTextNode(categoryName(name)),element("span","category-count",String(list.length)));
      const grid=element("div","grid"); list.forEach(item=>grid.append(createToolCard(item)));
      section.append(heading,grid); target.append(section);
    });
}
function renderResources(targetId, items, type) {
  const target=$(targetId); target.replaceChildren();
  if (!items.length) {
    target.append(element("p","empty",type==="course" ? t("no_courses") : t("no_tutorials")));
    return;
  }
  const grid=element("div","resource-grid"); items.forEach(item=>grid.append(createResourceCard(item,type))); target.append(grid);
}
function populateFilters() {
  const categorySelect=$("category-filter"), prioritySelect=$("priority-filter");
  const selectedCategory=categorySelect.value, selectedPriority=prioritySelect.value;
  categorySelect.replaceChildren(new Option(t("all_categories"),""));
  prioritySelect.replaceChildren(new Option(t("all_priorities"),""));
  [...new Set(catalog.tools.map(x=>x.category).filter(Boolean))]
    .sort((a,b)=>categoryName(a).localeCompare(categoryName(b),language))
    .forEach(value=>categorySelect.add(new Option(categoryName(value),value)));
  [...new Set(catalog.tools.map(x=>x.priority).filter(Boolean))]
    .sort((a,b)=>a.localeCompare(b,language))
    .forEach(value=>prioritySelect.add(new Option(priorityName(value),value)));
  categorySelect.value=selectedCategory; prioritySelect.value=selectedPriority;
}
function applyFilters() {
  const query=$("search").value.trim().toLocaleLowerCase(language);
  const category=$("category-filter").value, priority=$("priority-filter").value;
  const filtered=catalog.tools.filter(item=>{
    const haystack=[item.name,item.category,categoryName(item.category||""),item.description_fr,item.description_en,item.priority,priorityName(item.priority||"")].join(" ").toLocaleLowerCase(language);
    return haystack.includes(query)&&(!category||item.category===category)&&(!priority||item.priority===priority);
  });
  $("tools-count").textContent=t("count_tools")(filtered.length,catalog.tools.length);
  renderTools(filtered);
}
function setStats() {
  $("stat-tools").textContent=catalog.tools.length;
  $("stat-categories").textContent=new Set(catalog.tools.map(x=>x.category).filter(Boolean)).size;
  $("stat-courses").textContent=catalog.courses.length;
  $("stat-tutorials").textContent=catalog.tutorials.length;
}
async function loadJson(path) {
  const response=await fetch(path);
  if(!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  const data=await response.json();
  if(!Array.isArray(data)) throw new Error(`${path}: ${language==="en"?"expected a JSON array":"format attendu : liste JSON"}`);
  return data;
}
async function loadCatalog() {
  const errors=[];
  for(const [key,path] of Object.entries(DATA_FILES)) {
    try { catalog[key]=await loadJson(path); }
    catch(error) { catalog[key]=[]; errors.push(error.message); }
  }
  populateFilters(); setStats(); applyFilters();
  renderResources("courses-list",catalog.courses,"course");
  renderResources("tutorials-list",catalog.tutorials,"tutorial");
  if(errors.length) $("app-message").textContent=t("data_error")+errors.join("; ");
}
function renderReportDetails(results) {
  const target = $("report-results");
  if (!target) return;
  target.replaceChildren();
  if (!Array.isArray(results) || !results.length) {
    target.append(element("p","empty",t("report_empty_results")));
    return;
  }
  const ordered = results.slice().sort((a,b) => {
    const rank = {broken:0,invalid_url:1,connection_error:2,temporary_error:3,non_verifiable:4,redirect:5,ok:6};
    return (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || String(a.name||"").localeCompare(String(b.name||""));
  });
  const list = element("div","report-results-list");
  ordered.slice(0,30).forEach(item => {
    const row = element("article","report-result");
    const info = element("div","report-result-info");
    info.append(element("strong","",item.name || item.id || "Ressource"));
    const url = makeLink(item.url,item.url);
    if (url) info.append(url);
    const status = element("span",`report-result-status status-${item.status||"unknown"}`,t("report_status")[item.status] || item.status || "—");
    row.append(info,status);
    if (item.http_status) row.append(element("small","report-http-status",`HTTP ${item.http_status}`));
    list.append(row);
  });
  target.append(element("h3","report-details-title",t("report_details")),list);
}

async function loadReport() {
  const state=$("report-state"), date=$("report-date");
  try {
    const response=await fetch(`reports/status.json?ts=${Date.now()}`,{cache:"no-store"});
    if(!response.ok) throw new Error("No report");
    const report=await response.json(), summary=report.summary||{};
    if(!report.generated_at) throw new Error("Report not generated");
    $("dash-total").textContent=report.total??0;
    $("dash-ok").textContent=summary.ok??0;
    $("dash-broken").textContent=summary.broken??0;
    $("dash-redirect").textContent=summary.redirect??0;
    $("dash-nonverifiable").textContent=summary.non_verifiable??0;
    $("dash-temporary").textContent=(summary.temporary_error||0)+(summary.connection_error||0);
    state.textContent=t("status_report_loaded"); state.classList.add("report-loaded");
    date.textContent=t("report_date")+new Date(report.generated_at).toLocaleString(language==="en"?"en-GB":"fr-FR");
    renderReportDetails(report.results);
  } catch {
    ["dash-total","dash-ok","dash-broken","dash-redirect","dash-nonverifiable","dash-temporary"].forEach(id=>$(id).textContent="—");
    state.textContent=t("status_report_pending"); state.classList.remove("report-loaded");
    date.textContent=t("report_load_error");
    renderReportDetails([]);
  }
}
function applyLanguage() {
  document.documentElement.lang=language;
  document.title=language==="en"?"AI Directory — Explore and learn":"Répertoire IA — Explorer et apprendre";
  const description=document.querySelector('meta[name="description"]');
  if(description) description.content=language==="en"?"Explore an independent directory of AI tools and learning resources.":"Explorez un répertoire indépendant d’outils d’intelligence artificielle et de ressources d’apprentissage.";
  $("main-nav").setAttribute("aria-label",language==="en"?"Main navigation":"Navigation principale");
  document.querySelectorAll("[data-i18n]").forEach(node=>{
    const key=node.dataset.i18n;
    if(I18N[language][key]!==undefined) node.innerHTML=I18N[language][key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(node=>node.placeholder=t(node.dataset.i18nPlaceholder));
  $("language-toggle").textContent=language==="fr"?"EN":"FR";
  $("language-toggle").setAttribute("aria-label",language==="fr"?"Switch to English":"Passer en français");
  $("dialog-close").setAttribute("aria-label",t("close"));
  populateFilters(); applyFilters();
  renderResources("courses-list",catalog.courses,"course");
  renderResources("tutorials-list",catalog.tutorials,"tutorial");
  loadReport();
}
function setupInteractions() {
  ["search","category-filter","priority-filter"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",applyFilters));
  $("reset-filters").addEventListener("click",()=>{
    $("search").value=""; $("category-filter").value=""; $("priority-filter").value=""; applyFilters();
  });
  $("refresh-report").addEventListener("click",loadReport);
  $("dialog-close").addEventListener("click",()=>$("tool-dialog").close());
  $("tool-dialog").addEventListener("click",event=>{if(event.target===$("tool-dialog"))$("tool-dialog").close();});
  $("language-toggle").addEventListener("click",()=>{
    language=language==="fr"?"en":"fr";
    try { localStorage.setItem("repertoire-ia-language",language); } catch {}
    applyLanguage();
  });
  const toggle=$("menu-toggle"),nav=$("main-nav");
  toggle.addEventListener("click",()=>{
    const open=nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded",String(open));
  });
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
    nav.classList.remove("open"); toggle.setAttribute("aria-expanded","false");
  }));
}
try {
  const saved=localStorage.getItem("repertoire-ia-language");
  if(saved==="fr"||saved==="en") language=saved;
} catch {}
setupInteractions();
applyLanguage();
loadCatalog();
