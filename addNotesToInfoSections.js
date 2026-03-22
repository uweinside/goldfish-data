// Script to add long Markdown test notes to two info sections in each JSON file in the current directory
// Usage: node addNotesToInfoSections.js

const fs = require('fs');
const path = require('path');

// Pool of 10 generic test notes with varied Markdown elements.
// These are intentionally generic — content is for scroll/rendering tests only.
const NOTE_POOL = [
  // Note 0 — headings, ordered list, blockquote, inline code
  `## Test Note Alpha

This note is used to verify that **heading rendering** and *italic emphasis* both display correctly in the UI.

### Section One: Ordered Steps

1. Initialise the test environment.
2. Load the fixture data into memory.
3. Run the validation pass.
4. Assert that \`result.status\` equals \`"OK"\`.
5. Tear down and log output.

### Section Two: Observations

> "A UI that cannot render Markdown reliably is a UI that cannot communicate reliably."

> — Generic Test Quote, 2026

### Section Three: Edge Cases to Watch

- Empty strings in label fields.
- Unicode characters: é, ñ, ü, 中文, 日本語.
- Very long single-line strings without whitespace.
- Nested arrays with zero items \`[]\`.

---

**End of note alpha.**`,

  // Note 1 — fenced code block, table, blockquote
  `## Test Note Beta

This note checks that **fenced code blocks** and **tables** render without breaking layout.

### Sample Code Block

\`\`\`json
{
  "id": "test-001",
  "status": "pending",
  "retries": 3,
  "tags": ["alpha", "beta", "gamma"],
  "meta": {
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": null
  }
}
\`\`\`

### Comparison Table

| Property   | Expected Value | Actual Value | Pass? |
|------------|----------------|--------------|-------|
| \`status\`   | \`"pending"\`    | \`"pending"\`  | ✓     |
| \`retries\`  | \`3\`            | \`3\`          | ✓     |
| \`tags[0]\`  | \`"alpha"\`      | \`"alpha"\`    | ✓     |
| \`meta.id\`  | \`undefined\`    | \`undefined\`  | ✓     |

> **Reviewer note:** All assertions passed on first run. No environment tweaks needed.

---

*End of note beta.*`,

  // Note 2 — nested bullet lists, horizontal rules, bold/italic mix
  `## Test Note Gamma

Verify that **nested bullet lists** and **horizontal rules** render with correct indentation.

### Nested List Structure

- Top-level item A
  - Sub-item A1
    - Deep item A1a
    - Deep item A1b
  - Sub-item A2
- Top-level item B
  - Sub-item B1
- Top-level item C (no children)

---

### Mixed Emphasis

This paragraph uses ***bold italic***, plain text, \`inline code\`, and ~~strikethrough~~ all on the same line to stress-test inline parsing.

---

### Long Paragraph for Vertical Scroll Testing

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.

Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum semper, nisi lorem egestas odio, vitae scelerisque enim ligula venenatis dolor. Maecenas nisl est, ultrices nec congue eget, auctor vitae massa.

---

*End of note gamma.*`,

  // Note 3 — shell code block, warning blockquote, checklist-style bullets
  `## Test Note Delta

This note tests **shell code blocks** and **warning-style blockquotes**.

### Setup Commands

\`\`\`bash
# Install dependencies
npm install

# Run tests in watch mode
npm test -- --watch

# Build for production
npm run build -- --mode=production

# Check for outdated packages
npm outdated
\`\`\`

### Pre-Flight Checklist

- [x] Environment variables configured
- [x] Database seed applied
- [ ] Integration endpoints reachable
- [ ] Load balancer health checks passing
- [ ] Monitoring alerts silenced for deployment window

### Warning

> ⚠️ **Do not run these commands on a production database without a verified backup.**
> Snapshot the volume first, confirm the snapshot ID, then proceed.

### Notes on Idempotency

Ensure every step in the setup sequence is **idempotent** — running it twice should produce the same result as running it once. This is critical for automated CI pipelines where steps may be retried on transient failure.

---

*End of note delta.*`,

  // Note 4 — TypeScript code block, multi-level headings, inline quotes
  `## Test Note Epsilon

Verifying **TypeScript code block** rendering with syntax that includes generics and decorators.

### Example: Generic Repository Pattern

\`\`\`typescript
interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

class InMemoryRepository<T extends { id: string }>
  implements Repository<T, string> {

  private readonly store = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    return this.store.get(id) ?? null;
  }

  async findAll(filter?: Partial<T>): Promise<T[]> {
    const all = [...this.store.values()];
    if (!filter) return all;
    return all.filter(item =>
      Object.entries(filter).every(([k, v]) => (item as any)[k] === v)
    );
  }

  async save(entity: T): Promise<T> {
    this.store.set(entity.id, entity);
    return entity;
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }
}
\`\`\`

### Key Design Decisions

- **Interface-first:** the contract is defined before implementation, enabling mock substitution in tests.
- **Generic ID type:** allows \`number\`, \`string\`, or \`UUID\` without duplication.
- **Async throughout:** even in-memory operations return promises for consistent consumer code.

> "Design for the interface, not the implementation." — Generic Principle

---

*End of note epsilon.*`,

  // Note 5 — definition-style list, multi-line blockquote, footnote-style text
  `## Test Note Zeta

This note uses **definition-style formatting** and **multi-paragraph blockquotes**.

### Terminology Reference

**Alpha Phase**
: The earliest stage of testing. Functionality is incomplete; the focus is on discovering crashes and data-loss bugs.

**Beta Phase**
: Feature-complete testing with external participants. Performance and usability issues are the primary targets.

**Release Candidate (RC)**
: A build that is considered production-ready unless a blocker is found. Code freeze is in effect.

**General Availability (GA)**
: The version shipped to all users. Patch releases from this point follow semantic versioning strictly.

---

### Extended Blockquote

> This is the first paragraph of a multi-paragraph blockquote. It sets the context for what follows and should wrap across multiple lines in a narrow viewport to test reflow behaviour.
>
> This is the second paragraph. It continues the thought with additional detail. The renderer should preserve the blank line between paragraphs inside the blockquote.
>
> — *Anonymous Test Author, Test Suite v1.0*

---

### Footnote-Style Annotations

The primary metric used here is **p99 latency**¹, measured at the load-balancer edge, not at the application layer.

¹ *p99 latency: the response time below which 99% of requests fall. A high p99 with a low p50 usually indicates outlier requests, not systemic slowness.*

---

*End of note zeta.*`,

  // Note 6 — Python code, numbered + bulleted mix, emphasis patterns
  `## Test Note Eta

Testing **Python code block** rendering alongside mixed list formats.

### Utility Function Example

\`\`\`python
from __future__ import annotations
from typing import Any, Generator
import json
import pathlib


def stream_json_objects(file_path: str) -> Generator[dict[str, Any], None, None]:
    """Yield top-level objects from a newline-delimited JSON file."""
    path = pathlib.Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"No such file: {file_path!r}")

    with path.open(encoding="utf-8") as fh:
        for line_number, line in enumerate(fh, start=1):
            line = line.strip()
            if not line:
                continue
            try:
                yield json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(
                    f"Invalid JSON on line {line_number}: {exc}"
                ) from exc
\`\`\`

### When to Use This Pattern

1. **Large files** that cannot fit in memory as a single parsed object.
2. **Streaming pipelines** where each record should be processed independently.
3. **Incremental writes** where the file is still being appended to by another process.

Additional caveats:

- Does **not** support multi-line JSON objects (each object must be on a single line).
- The caller is responsible for closing the file — the generator handles it via context manager.
- Errors on individual lines raise immediately; there is no skip-and-continue mode.

---

*End of note eta.*`,

  // Note 7 — SQL code, comparison table, inline emphasis
  `## Test Note Theta

Validates **SQL code block** rendering and column-aligned tables with special characters.

### Query Example

\`\`\`sql
-- Retrieve the top 10 sessions by event count in the last 30 days
SELECT
    s.session_id,
    s.user_id,
    u.email,
    COUNT(e.event_id)   AS event_count,
    MIN(e.occurred_at)  AS first_event,
    MAX(e.occurred_at)  AS last_event
FROM sessions          AS s
JOIN users             AS u  ON u.user_id   = s.user_id
JOIN events            AS e  ON e.session_id = s.session_id
WHERE
    e.occurred_at >= NOW() - INTERVAL '30 days'
    AND s.is_deleted  = FALSE
    AND u.is_active   = TRUE
GROUP BY
    s.session_id,
    s.user_id,
    u.email
ORDER BY
    event_count DESC
LIMIT 10;
\`\`\`

### Index Strategy

| Column(s)            | Index Type | Notes                                      |
|----------------------|------------|--------------------------------------------|
| \`events.occurred_at\` | BRIN       | Effective for append-only time-series data |
| \`events.session_id\`  | B-tree     | Foreign key — always index FK columns      |
| \`users.is_active\`    | Partial    | \`WHERE is_active = TRUE\` reduces size       |
| \`sessions.user_id\`   | B-tree     | Required for the JOIN path                 |

> **Performance note:** Without the \`occurred_at\` index, this query performs a full table scan on \`events\`, which may take several seconds on large datasets.

---

*End of note theta.*`,

  // Note 8 — YAML/config block, warning list, reflective questions
  `## Test Note Iota

Testing **YAML code block** rendering alongside reflective question prompts.

### Sample Configuration

\`\`\`yaml
service:
  name: test-service
  version: "2.4.1"
  environment: staging

server:
  host: 0.0.0.0
  port: 8080
  timeouts:
    read: 30s
    write: 30s
    idle: 120s

database:
  driver: postgres
  host: db.internal
  port: 5432
  name: testdb
  pool:
    min: 2
    max: 20
    acquire_timeout: 5s

logging:
  level: info
  format: json
  outputs:
    - stdout
    - file:/var/log/test-service/app.log
\`\`\`

### Known Configuration Pitfalls

- Setting \`pool.max\` too high exhausts database connections across multiple replicas.
- \`timeouts.idle\` should exceed the load balancer's keep-alive timeout by at least 10 seconds.
- Never commit credentials in YAML — use environment variable interpolation (\`\${DB_PASSWORD}\`).
- The \`format: json\` setting requires a log aggregator that can parse structured logs.

### Reflective Questions

1. Does your staging configuration differ significantly from production? If so, how do you track divergence?
2. Are your timeout values tested under realistic network latency, or only on localhost?
3. What is your rollback plan if a configuration change causes a silent failure?

---

*End of note iota.*`,

  // Note 9 — diff code block, two-column analogy, closing summary list
  `## Test Note Kappa

This note tests **diff code block** rendering and analogy-style two-column comparisons.

### Example Diff

\`\`\`diff
--- a/src/config/defaults.ts
+++ b/src/config/defaults.ts
@@ -12,7 +12,7 @@ export const DEFAULT_CONFIG: Config = {
   server: {
     host: '0.0.0.0',
-    port: 3000,
+    port: 8080,
     timeouts: {
-      read: 15_000,
+      read: 30_000,
       write: 30_000,
     },
   },
@@ -24,6 +24,10 @@ export const DEFAULT_CONFIG: Config = {
   logging: {
     level: 'warn',
+    format: 'json',
+    outputs: ['stdout'],
   },
 };
\`\`\`

### Analogy: Old Approach vs New Approach

| Old Approach                             | New Approach                                  |
|------------------------------------------|-----------------------------------------------|
| Hard-coded values scattered across files | Single source-of-truth config object           |
| Changes require touching multiple files  | One file to update, types enforce completeness |
| No visibility into defaults at runtime   | Config logged (redacted) on startup            |
| Unit tests mock individual constants     | Tests inject a full config fixture             |

### Summary of Changes in This Note

- Port updated from \`3000\` to \`8080\` to align with internal routing rules.
- Read timeout doubled to handle upstream latency spikes observed in staging.
- Logging format standardised to JSON for compatibility with the log aggregator.
- Outputs array introduced to allow writing to both stdout and rotating file sinks.

> "Small configuration changes can have large operational consequences — treat them like code."

---

*End of note kappa.*`,
];

/**
 * Returns a note from the pool by cycling index, wrapping around.
 * counter is a shared object { value: number } so callers can mutate it.
 */
function nextNote(counter) {
  const note = NOTE_POOL[counter.value % NOTE_POOL.length];
  counter.value++;
  return note;
}

function addNotesToInfoSections(filePath, counter) {
  let data;
  try {
    data = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Failed to read ${filePath}:`, err);
    return;
  }
  let json;
  try {
    json = JSON.parse(data);
  } catch (err) {
    console.error(`Invalid JSON in ${filePath}:`, err);
    return;
  }
  if (!Array.isArray(json.segments)) return;

  // Collect all info sections that don't already have notes
  const infoSections = [];
  for (const segment of json.segments) {
    if (Array.isArray(segment.info)) {
      for (const info of segment.info) {
        if (!Array.isArray(info.notes)) {
          infoSections.push(info);
        }
      }
    }
  }

  // Add a distinct note to the first two eligible info sections
  for (let i = 0; i < 2 && i < infoSections.length; i++) {
    infoSections[i].notes = [nextNote(counter)];
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Failed to write ${filePath}:`, err);
  }
}

function main() {
  const dir = process.cwd();
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  // Shared counter so notes rotate across all files and sections
  const counter = { value: 0 };
  for (const file of files) {
    addNotesToInfoSections(path.join(dir, file), counter);
  }
}

main();
