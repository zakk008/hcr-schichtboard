# CLAUDE.md — SchichtBoard (HCR Fahrer)

## Projet
Application mobile PWA pour les chauffeurs de bus HCR (Herne).
Permet de consulter son dienstplan, ses fahrerkarten, et des outils du quotidien.

- **URL** : http://187.124.172.79/zak2026/
- **Répertoire** : `/Zak 2026/`
- **Servi par** : Nginx (alias statique, pas de PM2)
- **Rechargement** : aucun redémarrage nécessaire — modifier `index.html` suffit

## Architecture

Monolithique : **tout est dans `index.html`** (9 500+ lignes, 131 fonctions).
Pas de framework, pas de build — HTML/CSS/JS vanilla pur.

```
/Zak 2026/
├── index.html              ← app complète
├── sw-3.js                 ← Service Worker (cache PWA)
├── manifest-1.json         ← PWA manifest
├── icon-192x192-1.png
├── icon-512x512-2.png
├── landing.html            ← page d'accueil HCR
├── Fahrerkarten-*.PDF      ← PDFs officiels HCR (5 fichiers)
└── *.mp4                   ← vidéos (landing page)
```

## Écrans (screens)

Navigation via `go(id)`. Un seul écran actif à la fois (classe `.on`).

| ID | Écran | Description |
|----|-------|-------------|
| `s-dash` | Dashboard | Vue principale : prochain service, timer, stats |
| `s-plan` | Wochenplan | Planning semaine (navigation semaines) |
| `s-det` | Dienstdetail | Détail d'un service (onglets : Dienst / Fahrerkarte) |
| `s-alr` | Alarme | Alertes HCR Live + notes personnelles |
| `s-edit` | Bearbeiten | Saisie/modification du dienstplan |
| `s-jahres` | Jahresübersicht | Vue annuelle |
| `s-mehr` | Mehr | Outils extras (voir tabs ci-dessous) |

### Onglets de `s-mehr`
Wetter · Wecker · Kontakte · Checkliste · Vorfall · Monat · Ausgaben · Straßen

## Fonctions clés

```js
go(id)               // naviguer vers un écran
refreshDash()        // rafraîchir le dashboard
renderPlan()         // afficher le planning semaine
renderDet(key)       // afficher le détail d'un service
renderFahrer(svc)    // afficher la fahrerkarte d'un service
genParts(s)          // générer les parties d'un service (départ, pause, fin)
tick()               // timer live (appelé toutes les secondes)
switchTab(tab)       // changer onglet dans s-det ('info' | 'fk')
switchAlrTab(tab)    // changer onglet dans s-alr ('hcr' | 'man')
switchMehrTab(tab)   // changer onglet dans s-mehr
sk(k, v)             // localStorage.setItem (avec namespace)
lk(k, fb)            // localStorage.getItem (avec namespace)
```

## Données

- **`DB`** : objet JS — tous les services HCR (clé = code service ex: `"A1"`, `"B3"`)
- **`FK`** : fahrerkarten — données des lignes/arrêts par umlauf
- **`FK_PLANS`** : plans fahrerkarten (Schule, Ferien, E-Wagen, Samstag, Sonntag-Feiertag)
- **`_NS`** : namespace localStorage (`"hcr-"`)
- Tout est persisté via `localStorage` (dienstplan, alarmes, contacts, dépenses, etc.)

## PWA

- Service Worker : `sw-3.js` (mise en cache assets)
- Manifest : `manifest-1.json`
- Notifications Web : réveil matin + rappel J-1
- Installable sur Android/iOS (Add to Home Screen)
- Thème dark/light — persisté dans `localStorage` clé `hcr-theme`

## Fonts

- **Outfit** (400–900) — UI générale
- **JetBrains Mono** (400–700) — horaires, codes service

## Variables CSS principales

```css
--cyan: #22D3EE      /* couleur primaire */
--amber: #F59E0B     /* avertissement */
--green: #10B981     /* succès / actif */
--red: #F43F5E       /* erreur / alerte */
--bg: #04060D        /* fond dark */
--card: #0B0F1E      /* cartes dark */
```

## Règles de travail

- Toujours lire la section concernée avant de modifier
- Le fichier est monolithique — chercher la fonction avec `grep -n` avant d'éditer
- Pas de build, pas de transpilation — le JS doit être ES5/ES6 compatible navigateur
- Tester sur mobile (l'app est conçue mobile-first)
- Après modification : vider le cache du navigateur ou incrémenter la version du SW si changement critique
- Ne pas toucher à `sw-3.js` sans raison — un bug de cache peut bloquer toute l'app

## Commande utile pour trouver du code

```bash
grep -n "nomFonction\|mot-clé" "/Zak 2026/index.html"
```
