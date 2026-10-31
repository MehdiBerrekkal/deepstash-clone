import { useCallback } from 'react';
import { Platform } from 'react-native';

import { useStore } from '@/lib/store';

/**
 * The app's interface in English or French. Strings are written in English in the code and wrapped in t('…');
 * the French text lives in FR below (anything missing simply shows in English). "{n}"-style placeholders are filled
 * from the second argument.
 */
export type UiLang = 'en' | 'fr';

/** The device's language, for the "Automatic" setting. */
export function deviceLang(): UiLang {
  const nav = Platform.OS === 'web' ? (globalThis.navigator as Navigator | undefined) : undefined;
  const tag = nav?.languages?.[0] ?? nav?.language ?? Intl.DateTimeFormat().resolvedOptions().locale ?? 'en';
  return tag.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

const FR: Record<string, string> = {
  // tabs and headers
  'For you': 'Pour vous',
  Library: 'Bibliothèque',
  Explore: 'Explorer',
  Brain: 'Cerveau',
  Stashes: 'Réserves',
  You: 'Vous',
  '{n} min to go': 'encore {n} min',
  'Goal reached': 'Objectif atteint',
  All: 'Tout',
  // card kinds
  'Book ideas': 'Idées de livres',
  Quotes: 'Citations',
  Poems: 'Poèmes',
  Knowledge: 'Savoir',
  Books: 'Livres',
  Highlights: 'Surlignages',
  // library
  'Find a free book': 'Trouver un livre gratuit',
  'Thousands of classics in English and French, one tap to download': 'Des milliers de classiques en anglais et en français, en un geste',
  'Search {n} books and authors': 'Rechercher parmi {n} livres et auteurs',
  '🎙 Read aloud by a real narrator': '🎙 Lus à voix haute par un vrai narrateur',
  '✨ Recently added': '✨ Ajouts récents',
  'Continue reading': 'Reprendre la lecture',
  'Your books': 'Vos livres',
  '＋ Open your own book (EPUB or PDF)': '＋ Ouvrir votre propre livre (EPUB ou PDF)',
  // explore
  'Search books, ideas, quotes, poems, highlights': 'Rechercher livres, idées, citations, poèmes, surlignages',
  // you
  "Today's reading": 'Lecture du jour',
  'Daily goal (minutes)': 'Objectif quotidien (minutes)',
  Appearance: 'Apparence',
  Automatic: 'Automatique',
  Light: 'Clair',
  Dark: 'Sombre',
  Language: 'Langue',
  'Reading calendar': 'Calendrier de lecture',
  'Day streak': 'Jours d’affilée',
  'Goal streak': 'Objectifs d’affilée',
  '🧠 Smart review': '🧠 Révision intelligente',
  '🔊 Voices': '🔊 Voix',
  '✎ Highlights and notes': '✎ Surlignages et notes',
  'Your topics': 'Vos thèmes',
  'Open ›': 'Ouvrir ›',
  'Choose the English and French voices that read books, idea cards and quizzes aloud, including the natural AI voices.':
    'Choisissez les voix anglaise et française qui lisent les livres, les cartes et les quiz, y compris les voix naturelles.',
  'The app’s menus and buttons. Books and cards keep their own language.': 'Les menus et boutons de l’app. Les livres et les cartes gardent leur propre langue.',
  // backup and reminder
  '💾 Backup & restore': '💾 Sauvegarde et restauration',
  'never backed up': 'jamais sauvegardé',
  'backed up today': 'sauvegardé aujourd’hui',
  '{n} days ago': 'il y a {n} jours',
  'Save backup': 'Sauvegarder',
  'Restore…': 'Restaurer…',
  'Merge with this device': 'Fusionner avec cet appareil',
  'Replace everything here': 'Tout remplacer ici',
  Cancel: 'Annuler',
  '⏰ Daily reminder': '⏰ Rappel quotidien',
  'Pick a time, then add it to your calendar. You’ll get a gentle alert every day, even when the app is closed.':
    'Choisissez une heure, puis ajoutez-la à votre calendrier. Vous recevrez une alerte douce chaque jour, même app fermée.',
  'Add to my calendar': 'Ajouter à mon calendrier',
  // brain hub
  'TODAY’S SESSION': 'SÉANCE DU JOUR',
  'Three games, picked for you': 'Trois jeux choisis pour vous',
  'Session complete': 'Séance terminée',
  '{n} of 3 done': '{n} sur 3 terminés',
  'Start session': 'Commencer la séance',
  'Continue · {name}': 'Continuer · {name}',
  '{n}-day streak': '{n} jours d’affilée',
  'about 6 min': 'environ 6 min',
  CONTINUE: 'REPRENDRE',
  'COGNITIVE PROFILE': 'PROFIL COGNITIF',
  'Play a few games to build it': 'Jouez quelques parties pour le construire',
  'YOUR PROGRESS': 'VOTRE PROGRESSION',
  '{n} XP to {rank}': '{n} XP avant {rank}',
  'Top rank': 'Rang maximal',
  ASSESSMENT: 'ÉVALUATION',
  'IQ-style test': 'Test de type QI',
  '38 items · 25 min · 4 sections': '38 questions · 25 min · 4 parties',
  QUICK: 'RAPIDE',
  '15-min test': 'Test de 15 min',
  '16 items': '16 questions',
  'Daily challenge': 'Défi du jour',
  '3 hard questions': '3 questions difficiles',
  'This week’s plan': 'Programme de la semaine',
  Training: 'Entraînement',
  Quizzes: 'Quiz',
  Standard: 'Standard',
  'Timed · 20 s': 'Chrono · 20 s',
  'Hard only': 'Difficile',
  Sound: 'Son',
  On: 'Oui',
  Off: 'Non',
  Soft: 'Doux',
  Loud: 'Fort',
  'Level {n}': 'Niveau {n}',
  New: 'Nouveau',
  'Best {n}': 'Record {n}',
  'Scores here are estimates for practice and fun. They are not a clinically validated IQ test.':
    'Ces scores sont des estimations pour s’entraîner et s’amuser. Ce n’est pas un test de QI validé cliniquement.',
  // areas
  Reasoning: 'Raisonnement',
  Spatial: 'Spatial',
  Memory: 'Mémoire',
  Speed: 'Vitesse',
  Numerical: 'Numérique',
  Verbal: 'Verbal',
  // game screens
  'How it works': 'Comment ça marche',
  Reminder: 'Rappel',
  WHY: 'POURQUOI',
  Start: 'Commencer',
  'Start over': 'Recommencer',
  'Try a practice round': 'Faire un essai',
  'Practice round (not scored)': 'Essai (non compté)',
  'Skip practice and start': 'Passer l’essai et commencer',
  'The level adapts as you play: two right in a row moves up, a mistake moves down. Streaks multiply your points up to ×3.':
    'Le niveau s’adapte : deux bonnes réponses d’affilée le font monter, une erreur le fait baisser. Les séries multiplient vos points jusqu’à ×3.',
  Difficulty: 'Difficulté',
  Best: 'Record',
  Played: 'Parties',
  Level: 'Niveau',
  'PRACTICE · NOT SCORED': 'ESSAI · NON COMPTÉ',
  'You’ve got it.': 'Vous avez compris.',
  'Now you know the trick.': 'Maintenant vous connaissez l’astuce.',
  'Start the real game': 'Commencer la vraie partie',
  'Not this one': 'Pas celle-ci',
  'So close': 'Presque',
  'Time’s up': 'Temps écoulé',
  Next: 'Suivant',
  'See results': 'Voir le résultat',
  Paused: 'En pause',
  Continue: 'Continuer',
  'Save and quit': 'Enregistrer et quitter',
  Quit: 'Quitter',
  points: 'points',
  Accuracy: 'Précision',
  'Per answer': 'Par réponse',
  XP: 'XP',
  'Against your best': 'Face à votre record',
  'This run': 'Cette partie',
  'Best before': 'Record précédent',
  'first score': 'premier score',
  'Review your mistakes': 'Revoir vos erreurs',
  Yours: 'La vôtre',
  Right: 'Bonne',
  'Play again · Level {n}': 'Rejouer · Niveau {n}',
  'Try {name}': 'Essayer {name}',
  Done: 'Terminé',
  'Keep going': 'Continuer',
  'Leave this game?': 'Quitter ce jeu ?',
  'Save & quit': 'Enregistrer et quitter',
  'Quit the test?': 'Quitter le test ?',
  'Quit the test': 'Quitter le test',
  NEW_RANK: 'NOUVEAU RANG',
  'Tap to continue': 'Touchez pour continuer',
};

const fill = (s: string, vars?: Record<string, string | number>) => (vars ? s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : s);

/** The interface language in use (the setting, or the device's language). */
export function useUiLang(): UiLang {
  const { uiLanguage } = useStore();
  return uiLanguage === 'fr' || uiLanguage === 'en' ? uiLanguage : deviceLang();
}

/** t('Start') → "Commencer" in French; t('Level {n}', { n: 3 }). */
export function useT() {
  const lang = useUiLang();
  return useCallback((s: string, vars?: Record<string, string | number>) => fill(lang === 'fr' ? (FR[s] ?? s) : s, vars), [lang]);
}
