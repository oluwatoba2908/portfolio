# Workflow Preferences

- Instead of fixing a bug right away, give me some options so I can choose before you fix them
- If you can find an opportunity to improve the output and reliability of the ask, then please suggest. Example: if I ask you to add a field, and you notice the existing fields have inconsistencies or potential bugs, flag them
- Analyse the eslint.config.mjs file before thinking of a solution so we create the perfect architecture before writing code

## Git Commit Messages

- Commit messages describe **what changed and why** — never how it was built or what tools/processes were used
- Bad: `feat: added autonomous coding agent through orchestrate and outcomes`
- Good: `feat(campaigns): add profile resolution check to Send Now for LinkedIn contacts`
- Never mention AI agents, orchestrators, skills, or internal tooling in commit messages
- Focus on the user-facing or developer-facing value of the change

## Git Branch Safety

- **NEVER commit directly to `main`**. All work must go on a feature/sprint branch and be merged via PR
- When delegating to execution agents or PL agents, always instruct them to create or checkout a branch BEFORE committing
- If the current branch is `main`, create a new branch first — no exceptions
