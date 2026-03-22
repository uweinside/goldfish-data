# goldfish-data

Sample course timing data for [CuePilot](https://github.com) — a glanceable presentation timing assistant designed for instructors delivering structured sessions.

Each JSON file in this repository describes the full timing plan for one course. CuePilot loads a file and uses it to drive a countdown timer, segment-by-segment, on a secondary monitor.

---

## JSON Format Reference

### Root Object

| Property   | Type       | Required | Description                                      |
|------------|------------|----------|--------------------------------------------------|
| `title`    | `string`   | Yes      | Display name of the course.                      |
| `segments` | `array`    | Yes      | Ordered list of segment objects (see below).      |

```json
{
  "title": "GitHub Copilot Fundamentals",
  "segments": [ ... ]
}
```

---

### Segment Object

Each entry in `segments` represents one timed block of the session (a lecture, a demo, a break, etc.). CuePilot processes them in order and advances automatically when the countdown reaches zero.

| Property   | Type       | Required | Description                                                        |
|------------|------------|----------|--------------------------------------------------------------------|
| `title`    | `string`   | Yes      | Short name shown in the timer UI.                                  |
| `duration` | `number`   | Yes      | Length of the segment **in seconds**.                               |
| `type`     | `string`   | No       | One of `"lecture"`, `"demo"`, or `"break"`. Drives UI color accent. |
| `info`     | `array`    | No       | Ordered list of info-section objects displayed in the right panel.  |

```json
{
  "title": "Welcome & Framing",
  "duration": 600,
  "type": "lecture",
  "info": [ ... ]
}
```

#### Duration guidelines

Durations are always whole numbers in **seconds**. Common values:

| Human-readable | Seconds |
|----------------|---------|
| 5 minutes      | 300     |
| 7 minutes      | 420     |
| 8 minutes      | 480     |
| 10 minutes     | 600     |
| 15 minutes     | 900     |
| 20 minutes     | 1200    |
| 25 minutes     | 1500    |
| 30 minutes     | 1800    |
| 35 minutes     | 2100    |
| 45 minutes     | 2700    |

#### Segment types

| Type       | UI Accent | Typical use                          |
|------------|-----------|--------------------------------------|
| `lecture`  | Blue      | Presentations, discussions, wrap-ups |
| `demo`    | Purple    | Live demonstrations, hands-on shows  |
| `break`   | Gray      | Scheduled pauses (usually 600 s)     |

If `type` is omitted, no accent is applied.

---

### Info Section Object

Each entry in a segment's `info` array adds a labelled list to the right-hand panel. Sections are rendered in order; the first section gets the most visual prominence.

| Property | Type       | Required | Description                                                        |
|----------|------------|----------|--------------------------------------------------------------------|
| `label`  | `string`   | Yes      | Heading for the section. Also determines the accent color (below). |
| `items`  | `string[]` | Yes      | Bullet points displayed under the label.                           |
| `notes`  | `string[]` | No       | Optional long-form notes in Markdown, rendered as presenter guidance under the section. |

```json
{
  "label": "Trainer Focus",
  "items": [
    "Set expectations clearly upfront",
    "Explain delivery norms"
  ],
  "notes": [
    "### Delivery script\nOpen by stating the expected outcomes and timing.",
    "Use **bold** text for emphasis and lists for step-by-step reminders."
  ]
}
```

#### Notes field guidance

- `notes` is optional; omit it when no long-form guidance is needed.
- Each entry in `notes` is a Markdown string and can include headings, lists, emphasis, blockquotes, and fenced code blocks.
- Use multiple `notes` entries for separate presenter aids (for example: speaking script, demo runbook, and fallback plan).
- Keep `items` concise for on-screen scanning; place detailed facilitation content in `notes`.

#### Label accent colors

CuePilot picks an accent color by matching keywords in the `label` (case-insensitive):

| Keyword in label          | Color    | Hex       |
|---------------------------|----------|-----------|
| `focus` or `objective`    | Blue     | `#60A5FA` |
| `talking`                 | Teal     | `#2DD4BF` |
| `prompt`                  | Amber    | `#FBBF24` |
| `demo`                    | Purple   | `#A78BFA` |
| `rule`                    | Red      | `#F87171` |
| *(no match / default)*    | Gray     | `#6B7280` |

#### Common label conventions

These labels appear across the sample files. You can use any label text, but these are recognized by theme:

- **Trainer Focus** — internal cues for the presenter
- **Objective** — learning goal for the segment
- **Talking Points** — key topics to cover
- **Chat Prompts** — questions to post in the audience chat
- **Reaction Prompts** — quick polls or emoji reactions
- **Demos** — specific demonstrations to perform
- **Rules** — guardrails or safety reminders
- **Next Steps** — follow-up actions for participants

---

### Minimal Example

A valid file with two segments and no info sections:

```json
{
  "title": "Quick Workshop",
  "segments": [
    {
      "title": "Introduction",
      "duration": 600,
      "type": "lecture"
    },
    {
      "title": "Hands-on Demo",
      "duration": 1800,
      "type": "demo"
    }
  ]
}
```

### Full Example

A complete segment with multiple info sections:

```json
{
  "title": "Core Developer Workflows",
  "duration": 2700,
  "type": "demo",
  "info": [
    {
      "label": "Objective",
      "items": [
        "Show real productivity gains with Copilot"
      ]
    },
    {
      "label": "Demos",
      "items": [
        "Code generation: Generate code from natural language comment",
        "Refactoring: Improve readability and structure",
        "Documentation: Generate README or inline documentation"
      ]
    },
    {
      "label": "Rules",
      "items": [
        "Never troubleshoot live",
        "Switch to screenshots if demo fails"
      ]
    },
    {
      "label": "Chat Prompts",
      "items": [
        "Where do you lose the most time today?"
      ]
    }
  ]
}
```

---

## File Naming Convention

Files are named `{prefix}-{number}.json` where:

- **prefix** — short lowercase identifier for the course area (e.g., `az`, `gh`, `sec`, `wd`)
- **number** — course catalog number

Examples: `az-110.json`, `gh-300.json`, `devops-180.json`

---

## Sample Files

| File             | Course Title                           |
|------------------|----------------------------------------|
| `agile-200.json` | Agile Practices with AI                |
| `api-140.json`   | API Design and Development with AI     |
| `arch-250.json`  | Software Architecture with AI          |
| `az-110.json`    | Azure Cloud Operations with AI         |
| `db-170.json`    | Database Management with AI Assistance |
| `devops-180.json`| DevOps Pipeline Automation with AI     |
| `doc-120.json`   | Technical Documentation with AI        |
| `ds-150.json`    | Data Science Workflows with AI         |
| `gh-300.json`    | GitHub Copilot Fundamentals            |
| `ml-220.json`    | Machine Learning Model Deployment with AI |
| `mob-160.json`   | Mobile Development with AI             |
| `pm-130.json`    | AI-Assisted Team Productivity          |
| `sec-260.json`   | Secure Development with AI             |
| `test-190.json`  | Test Engineering with AI               |
| `wd-210.json`    | AI-Powered Web Development             |