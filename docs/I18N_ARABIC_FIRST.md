# Internationalization — Arabic First

## Language policy
- Arabic and English are the two primary product languages.
- All other supported world languages are optional and can be added through translation packs.
- Users can change the interface language at any time without losing account data or preferences.
- Interface direction must follow language: Arabic RTL; English and other LTR languages LTR, with support for scripts that require special handling.

## Arabic companion translation rule
Every language-learning item must offer an Arabic companion translation. This applies to:
- words, phrases, sentences, dialogues, and reading passages
- grammar explanations and usage notes
- exercises, questions, hints, corrections, and assessment feedback
- transcripts and learning instructions

## User-controlled display modes
1. Always show Arabic translation.
2. Reveal Arabic translation on tap.
3. Hide Arabic translation (user can reveal it again).
4. Side-by-side bilingual display where screen size allows.

## Translation quality
- Prefer meaning-based, natural Arabic over literal word substitution.
- Provide a simple Arabic explanation for idioms, context, and culturally specific expressions.
- Keep source text visible so learners can compare both languages.
- Clearly distinguish machine-generated translations from reviewed learning content where relevant.
- Do not claim every language is fully supported until translation, fonts, layout, and quality checks pass.

## Interface localization
- Translate all navigation, controls, onboarding, notifications, error messages, accessibility labels, and help content.
- Support RTL mirroring without mirroring media, numbers, or code incorrectly.
- Use Unicode-safe storage and fonts with broad script coverage.
- Store locale preferences separately from learning-language preferences.

## Learning-language model
A user may use the app interface in Arabic while learning Japanese, or use English while learning Arabic. Interface locale and target learning language must remain independent settings.

## Acceptance criteria
- Arabic is the default first-run interface language unless the user chooses otherwise.
- English is available as a primary alternative.
- Additional language packs are optional.
- Every language-learning content item exposes an Arabic translation mode.
- RTL/LTR switching does not break layout, navigation, or saved progress.
- Users can access pronunciation audio when available.
