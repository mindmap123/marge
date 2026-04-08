# Calculateur Chantier

Outil de calcul de marge pour artisans du bâtiment.

## Déploiement sur Vercel

1. Connecte ton repo GitHub à Vercel
2. Configure les variables d'environnement :
   - `RESEND_API_KEY` : ta clé API Resend
3. Déploie !

## Variables d'environnement

```
RESEND_API_KEY=re_xxx
```

## Structure

- `index.html` : Page d'atterrissage avec formulaire de capture
- `outil.html` : Calculateur interactif
- `api/inscription.js` : Fonction serverless pour l'envoi d'emails
