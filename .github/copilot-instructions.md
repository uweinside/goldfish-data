# Goldfish Data - Copilot Authoring Instructions

This repository contains structured training course data in JSON format. When adding or editing content, follow the schema and authoring guidelines below.

---

## JSON Schema

Each training file has a top-level `title` and a `chapters` array. Every chapter contains a `title` and a `sections` array.

Each section follows this shape:

```json
{
  "title": "Short descriptive title for this section",
  "type": "Narration",          // "Narration" | "Demo" | "Prompt" | "Rule"
  "durationSeconds": 120,         // integer seconds
  "instructions": "## Guidance\n- bullet points",
  "transcript": "### Optional script" // optional
}
```

### Required fields
- Course: `title`, `chapters`
- Chapter: `title`, `sections`
- Section: `title`, `type`, `durationSeconds`, `instructions`

### Optional fields
- Section: `transcript`

### Duration
Use `durationSeconds` as an integer.

When converting timestamped source material, compute chapter-level duration first, then distribute section durations so they remain realistic and sum to the chapter's total duration.

---

## Section Types

Use the section type that matches the section's primary purpose:

| Type | Use when |
|---|---|
| `Narration` | Trainer-led spoken explanation, walkthrough, framing, or conceptual content |
| `Demo` | Live product interaction: clicking, navigating, configuring, showing outputs |
| `Prompt` | Audience interaction prompts: reactions, chat prompts, polls, Q&A invitations |
| `Rule` | Structural or reference guidance: slide bullets, summaries, checklists, constraints |

---

## Title And Content Strategy

### Chapter titles
Use chapter titles for the session flow moments (for example: "Agenda Overview", "Live Interface Walkthrough").

### Section titles
Use concise function-based titles (for example: "Opening Narration", "Demo Steps", "Key Points", "Reaction Prompts").

### Instructions
`instructions` is required for every section and should be markdown optimized for trainer execution:
- Start with a short heading (for example: `## Demo Steps`)
- Use concise bullet points
- Keep content actionable and scannable

### Transcript
Use `transcript` when the trainer needs a read-aloud script or safety-net wording.
- Write as first-person trainer speech
- Use markdown headings (`###`) for subtopics where helpful
- Omit `transcript` for purely structural sections

---

## Two-Layer Delivery Design (New Schema)

Each spoken section can provide two delivery layers:

1. `instructions` - short execution bullets for confident trainers
2. `transcript` - fuller script for less experienced trainers

For meta/structural sections (for example slide bullets), keep only `instructions`.

---

## Mapping Guidance For Legacy Data

When migrating old `segments/info` content to this schema:

1. Convert each old segment into a chapter.
2. Convert each old info block into a section.
3. Map `items` to `instructions` markdown bullets.
4. Join old transcript arrays into a single markdown string in `transcript`.
5. Map section type using intent:
   - Demo-like blocks -> `Demo`
   - Reaction/chat/Q&A prompt blocks -> `Prompt`
   - Structural slide/key-point blocks -> `Rule`
   - Spoken explanation blocks -> `Narration`

---

## Reaction Prompts Convention

Use `Prompt` sections for audience interaction moments (Teams React buttons, chat, polls).

Session convention example:
- 👍 = Yes
- 😲 = No

---

## Workflow For Converting Timestamped Transcript Content

1. Identify natural chapter breaks: topic shifts, major transitions, or mode changes.
2. Create one chapter per break.
3. Split each chapter into sections by delivery function (narration, demo, rule/prompt).
4. Write section-level `instructions` first.
5. Add `transcript` only where spoken scripting is needed.
6. Assign section `type` and `durationSeconds` values.
7. Keep wording faithful to source material; paraphrase for clarity, do not invent new claims.

---

## Reference Files

- `reference.json` - purpose-built reference for section type and structure patterns in the new schema.
- `swm-4023.json` - active working file for the M365 Copilot Chat Training session in the new schema.
