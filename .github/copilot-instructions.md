# Goldfish Data — Copilot Authoring Instructions

This repository contains structured training segment data in JSON format. When adding or editing segments, follow the schema and authoring guidelines below.

---

## JSON Schema

Each training file has a top-level `title` and a `segments` array. Every segment follows this shape:

```json
{
  "title": "Short descriptive title for this moment in the session",
  "duration": 120,          // seconds derived from transcript timestamps
  "type": "lecture",        // "lecture" | "demo" | "activity" | "qa"
  "info": [
    {
      "label": "Flow-appropriate label",
      "items": ["..."],     // optional high-level bullet points
      "notes": ["..."]      // optional markdown trainer script blocks
    }
  ]
}
```

### Duration
Compute `duration` in **seconds** from the transcript timestamps. For example, `(1:02 - 4:01)` = 179 seconds.

### Segment type
Choose `type` based on the dominant activity in the segment:

| Type | Use when |
|---|---|
| `lecture` | The trainer is speaking — explaining concepts, walking through slides, or introducing a topic |
| `demo` | The trainer is live in a product interface — clicking, navigating, or showing something on screen |
| `activity` | Participants are doing something themselves — a hands-on exercise or worksheet |
| `qa` | An open Q&A exchange — live questions from participants, not pre-scripted content |

### Segment granularity
Do not create a segment for every timestamp break in the transcript. Merge short passages (roughly under 45 seconds) into an adjacent segment when:
- They introduce or lead into the same topic as the next passage, or
- They form one continuous thought that would feel artificially split.

Only create a new segment when there is a clear topic shift, a mode change (e.g. lecture → demo), or a slide transition.

---

## Info Block Labels

Labels must reflect the **actual function** of the block within the flow of the session — not generic roles. Choose from these patterns (or invent a new one that fits):

| Block function | Example labels |
|---|---|
| Verbal narrative at the start of a segment | `Opening Narration`, `Narration` |
| Walking through a slide's content | `Slide Content`, `Agenda Walkthrough`, `Module Outline` |
| Live product demonstration | `Demo`, `Demo Steps` |
| Background or conceptual explanation | `Concept Explanation` |
| Side-by-side feature or product comparison | `License Comparison` |
| Interactive element (polls, reactions, chat) | `Reaction Prompts`, `Chat Prompts` |
| Key takeaways or summary | `Key Points`, `Summary` |
| Transition to the next segment | `Transition` |

Never use generic labels like `"Trainer Focus"` or `"Talking Points"` — they do not convey *what the block is for*.

---

## The Two-Layer Delivery Design

Every segment is authored with two layers so trainers can choose their delivery style:

1. **`items` — bullet points for confident trainers**  
   Short, scannable cues. The trainer reads the room and finds their own voice. These should be enough to deliver the segment without reading a script.

2. **`notes` — markdown script for nervous or first-time trainers**  
   Full sentences, formatted as markdown with `###` headings per sub-topic. A trainer can read this verbatim if needed, or use it as a safety net. Write `notes` as first-person trainer speech.

Include both layers in any block that involves verbal delivery. Omit `notes` for purely structural blocks like `Reaction Prompts`.

---

## Meta Blocks vs Transcript Blocks

Info blocks fall into two categories based on whether they carry `notes`:

### Transcript blocks (`notes` present)
These contain a `notes` array with a full markdown script. The client app's **transcript mode** surfaces only these blocks — they form the navigable, readable flow of the session. A trainer can jump from one transcript block to the next and deliver the entire session from notes alone.

Examples: `Opening Narration`, `Narration`, `Concept Explanation`, `Demo Steps`, `Agenda Walkthrough`, `License Comparison`

### Meta blocks (`notes` absent)
These contain only `items` — structural or visual cues that only make sense at the planning/overview level. The transcript mode skips them entirely. They exist to help authors and producers understand the session structure at a glance.

Examples: `Slide Content`, `Module Outline`, `Reaction Prompts`, `Chat Prompts`, `Key Points`

**Authoring rule:** If a block involves the trainer speaking at length, it must be a transcript block with `notes`. If it is a checklist, a slide reference, or an interaction prompt, it is a meta block with `items` only.

---

## Reaction Prompts

Use the `Reaction Prompts` label for blocks that prompt the audience to interact via Teams React buttons, chat, or polls. These are short imperative sentences, e.g.:

```json
{
  "label": "Reaction Prompts",
  "items": [
    "Ready for Module 1? Give me a thumbs up!"
  ]
}
```

The session convention is: 👍 = Yes, 😲 = No.

---

## Workflow for Converting Transcript Segments

When adding new content from a timestamped transcript:

1. **Identify natural breaks** in the transcript — topic shifts, slide transitions, or clear pauses.
2. **Create one segment per break.** Give it a descriptive `title` and compute `duration` in seconds.
3. **Split each segment into labelled `info` blocks** — one block per distinct function (narration, slide walk-through, demo, reaction check, etc.).
4. **Write `items`** first as high-level bullets capturing what the trainer says.
5. **Write `notes`** as a flowing markdown script in first-person trainer voice, using the transcript as the source of truth for phrasing and intent.
6. **Do not invent content** not present in the transcript. Paraphrase and structure; do not fabricate talking points.

---

## Reference Files

- `reference.json` — purpose-built reference file demonstrating every authoring principle: all four segment types, all label patterns, transcript blocks vs meta blocks, the two-layer delivery design, and segment merging. Use this to understand correct structure before authoring new content.
- `swm-4023.json` — active working file for the M365 Copilot Chat Training session.
