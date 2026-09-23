# Writing rules

## Scope

Every piece of text written for a project: READMEs, `docs/`, UI copy (headings, buttons, empty states, footers), error messages, PR descriptions, code comments, and Claude's own chat replies. Text should read like a person wrote it, not like a model did.

## Hard ban: em dashes

Never use an em dash ("—") or an en dash ("–") as punctuation. Not in READMEs, not in docs, not in UI copy, not in chat.

- Replace it with a period, a comma, a colon, or parentheses, or rewrite the sentence.
- Do not swap in a spaced hyphen (" - ") as a stand-in. That is the same tic with a different character.
- Plain hyphens stay for compound words (`client-side`) and numeric ranges (`3-5s`).

Before finishing any text, search it for "—" and "–" and remove every hit.

## Patterns to avoid

- **The contrastive tag:** "X, not Y." / "It's not just X, it's Y." Says what the thing isn't instead of what it is.
- **Throat-clearing openers:** "In today's fast-paced world...", "In the ever-evolving landscape of...".
- **Marketing verbs on a tool nobody is marketing:** "unlock", "boost", "supercharge", "elevate", "empower", "streamline".
- **Hollow superlatives:** "seamless", "effortless", "game-changing", "cutting-edge", "comprehensive", "robust". Fine only when specifically true.
- **Corporate padding:** "leverage", "utilize", "harness", "facilitate" where a plain verb would do.
- **Stock vocabulary:** "delve", "tapestry", "realm", "landscape", "crucial", "pivotal", "navigate" used as a metaphor.
- **Hedge-everything openers:** "Whether you're a beginner or an expert, ..."
- **Rhetorical-question filler:** "Ever wondered how...?"
- **Sign-posting and filler transitions:** "Moreover", "Furthermore", "Additionally", "It's worth noting that", "Let's dive in", "Here's the thing".
- **Reflexive triplets:** three adjectives or clauses because three sounds finished ("fast, simple, and powerful").
- **Closing recaps:** "In summary", "Ultimately", "At its core", or a last paragraph that restates the ones above it.
- **Bold-lead bullets on every list item** and headers on documents short enough not to need them.
- **Decorative emoji and exclamation marks.** Fine only when they are a deliberate part of the project's voice.
- **Stacked hedges:** "can potentially help", "may often be useful".

## Do instead

Say the specific true thing, plainly, in the voice of a person. Short sentences. Concrete nouns, real names, real numbers. Say what the thing is and does, and skip what it isn't. Give it a point of view: a dry joke or a plain opinion beats safe, balanced copy that could have been written about anything.

## Code comments: default to none

Default to writing no comments. A comment that restates what the next line does is noise, not documentation: `// increment i` above `i++`, `// loop over users` above a `for (const user of users)`. Well-named variables and functions already say what the code does; a comment repeating that just gives the reader two things to keep in sync instead of one.

Write a comment only when it carries something the code itself can't: a non-obvious constraint, a subtle invariant, a workaround for a specific bug or upstream quirk, or a reason a reader would otherwise have to go dig for (a linked issue, a decision recorded elsewhere). Before adding a comment, ask whether removing it would confuse a future reader. If not, don't write it. Don't reference the current task, fix, or caller in a comment ("used by the X flow", "added for issue #123"): that belongs in the commit, not in code that outlives it.

This applies everywhere code is written for a project, same as the rest of this file: application code, scripts, config, tests.

**Origin:** every project in this workspace ended up with comments that just narrated the line below them, especially in generated or first-draft code. The rule that survived is the same one this whole file already applies to prose: say only what the reader can't already see.

## Self-check before finishing any text or code

1. Search for "—" and "–". Remove every hit.
2. Scan for the patterns above.
3. Ask: could this sentence sit unchanged in a random other project's README? If yes, rewrite it with something only true of this project.
4. For code: does every comment explain something removing it would lose? Delete the ones that don't.

**Origin:** the copy tells were first caught in Coined's footer ("search real, public code, not a suggestion engine") and lived inside `design.md`. Em dashes kept showing up in READMEs and docs anyway, so text rules became their own file where they can be loaded and enforced on their own.

## This project's voice

Sarcastic, and at the owner's own expense. The page makes fun of the projects and of the person who made them, never of the visitor. Two limits:

- **The joke can't make a factual claim that is false.** A blurb still has to say what the thing is. Coined does find variable names, Caffeinated does keep the screen on. The sarcasm goes around the fact and doesn't replace it.
- **Numbers are real.** A fake statistic is not a joke.

UI labels are uppercase mono and short. Status words: `working`, `half done`, `dead`. Theme names in the picker are jokes, and the accessible names stay plain color names.
