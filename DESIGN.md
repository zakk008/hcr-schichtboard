# DESIGN.md — SchichtBoard
> Système de design pour Claude Code. Lire ce fichier avant toute génération d'interface.

---

## Identité

- **App** : SchichtBoard — PWA pour chauffeurs HCR (Herne-Castrop-Rauxel)
- **Public** : Chauffeurs de bus, usage mobile exclusivement
- **Ton** : Professionnel, industriel, sombre, précis
- **Langue** : Allemand (labels UI), parfois français (commentaires internes)

---

## Couleurs

```css
--bg:           #080C14;   /* Fond principal — noir profond */
--card:         #0F1520;   /* Cartes et surfaces */
--card-border:  #1A2235;   /* Bordures de cartes */
--border:       #1E293B;   /* Séparateurs */
--border-dim:   #334155;   /* Éléments inactifs */

--accent:       #F97316;   /* Orange HCR — couleur principale */
--accent-dim:   #7C3D13;   /* Orange atténué (badges, backgrounds) */
--accent-glow:  rgba(249,115,22,0.15); /* Glow / halo orange */

--blue:         #3B82F6;   /* Info, Ferien, états secondaires */
--blue-dim:     #1E3A5F;
--green:        #22C55E;   /* Succès, actif, confirmé */
--green-dim:    #14532D;
--red:          #EF4444;   /* Erreur, annulé */
--red-dim:      #7F1D1D;
--yellow:       #EAB308;   /* Avertissement, temps restant */

--text:         #F1F5F9;   /* Texte principal */
--text-muted:   #64748B;   /* Labels, sous-titres */
--text-dim:     #334155;   /* Texte très discret */
```

---

## Typographie

- **Données & codes** : `'Courier New', monospace` — heures, IDs de service (D-117), numéros de ligne
- **Interface** : `'Segoe UI', system-ui, sans-serif` — tous les autres textes
- **Tailles** :
  - Grande horloge : 52px, weight 700, letter-spacing 4px
  - ID Dienst : 32px, weight 800
  - Titre carte : 20px, weight 700
  - Label section : 11px, weight 700, uppercase, letter-spacing 2px
  - Corps : 13–15px
  - Badge / micro-label : 10–11px, uppercase, letter-spacing 1px

---

## Composants

### Card
```css
background: var(--card);
border: 1px solid var(--card-border);
border-radius: 14px;
padding: 16px 18px;
/* Variante accent (carte active) : */
border-color: rgba(249,115,22,0.4);
box-shadow: 0 0 20px var(--accent-glow);
```

### Badge / StatusBadge
```css
background: {color}20;
border: 1px solid {color}40;
color: {color};
border-radius: 6px;
padding: 2px 10px;
font-size: 11px;
font-weight: 700;
letter-spacing: 1px;
text-transform: uppercase;
```

### Bouton primaire
```css
background: linear-gradient(135deg, #F97316, #FBBF24);
color: #000;
font-weight: 800;
border-radius: 14px;
padding: 16px;
border: none;
```

### Bouton secondaire
```css
background: var(--accent-glow);
border: 1px solid rgba(249,115,22,0.4);
color: var(--accent);
border-radius: 8px;
padding: 10px;
font-weight: 700;
```

### Barre de progression
```css
background: var(--border);        /* track */
border-radius: 4px;
height: 6px;
/* fill : */
background: linear-gradient(90deg, #F97316, #FBBF24);
```

### Pill de filtre (actif)
```css
background: var(--accent);
color: #000;
border: 1px solid var(--accent);
border-radius: 8px;
padding: 6px 16px;
font-size: 12px;
font-weight: 700;
letter-spacing: 1px;
```

### Navigation bas (bottom nav)
```css
background: rgba(8,12,20,0.95);
backdrop-filter: blur(20px);
border-top: 1px solid var(--card-border);
/* Indicateur tab actif : barre orange 3px en haut, width 28px */
/* Icône active : var(--accent) | inactive : var(--text-muted) */
/* Label actif : weight 700 | inactif : weight 500 */
```

---

## Layout & Espacement

- **Container max-width** : 430px, centré, `margin: 0 auto`
- **Padding horizontal** : 16px
- **Gap entre cartes** : 14px
- **Gap grille 3 colonnes** : 10px
- **Border-radius** :
  - Cartes : 14px
  - Boutons/chips : 8–14px
  - Avatars ronds : 50%
  - Petits éléments : 6–8px

---

## Effets visuels

- **Ambient glow** : cercle radial `rgba(249,115,22,0.15)` fixé en haut, width/height 300px, pointer-events none, z-index 0
- **Glassmorphism** : uniquement sur la bottom nav (`backdrop-filter: blur(20px)`)
- **Transitions** : `all 0.2s` sur les éléments interactifs (cartes, boutons)
- **Ombre sur texte horloge** : `text-shadow: 0 0 30px rgba(249,115,22,0.15)`

---

## Écrans (Screens)

| # | ID | Nom | Description |
|---|-----|-----|-------------|
| 1 | `home` | Home | Horloge live, Dienst actif, prochaine fahrt, météo |
| 2 | `fahrerkarte` | Dienst | Liste des services par type (Mo–Fr / Ferien / Sa / So) |
| 3 | `planer` | Planer | Calendrier mensuel avec dot indicators |
| 4 | `tausch` | FahrerTausch | Échange de services entre chauffeurs (backend Node.js requis) |
| 5 | `mehr` | Mehr | Profil, FahrerGeld, FahrerSchutz, Einstellungen |

---

## Règles impératives pour Claude Code

1. **Mobile first** — tout est conçu pour 430px max, padding 16px
2. **Monospace pour les données** — heures, IDs, km, compteurs → toujours `Courier New`
3. **Textes d'interface en allemand** — labels, boutons, titres de section
4. **Pas de blanc sur fond clair** — thème 100% sombre, jamais de fond blanc
5. **Accent orange = HCR** — utiliser `#F97316` uniquement pour les éléments actifs/importants, pas partout
6. **Éviter les gradients inutiles** — gradient uniquement sur les boutons primaires et la barre de progression
7. **Labels de section** : toujours `11px uppercase letter-spacing 2px color: var(--text-muted)`
8. **FahrerTausch** : ne pas implémenter le backend inline — prévoir les appels `fetch('/api/...')` vers le VPS Node.js
9. **localStorage** : utiliser la clé versionnée `schichtboard_v3_` pour éviter les conflits de cache
10. **Service Worker** : incrémenter `CACHE_VERSION` à chaque mise à jour majeure

---

## Stack technique

- **Framework** : React (PWA) ou HTML/CSS/JS vanilla
- **Déploiement** : Vercel — `hcr-app-xi.vercel.app`
- **Backend FahrerTausch** : Node.js + SQLite sur VPS Hostinger
- **Données météo** : Open-Meteo API (pas de clé requise)
- **Stockage local** : localStorage avec versioning forcé
