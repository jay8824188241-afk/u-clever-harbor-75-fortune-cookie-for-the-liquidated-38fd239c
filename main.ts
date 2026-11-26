// Fortune Cookie for the Liquidated Trader
// Deterministically writes exactly one fortune-cookie line to
// $MAKEFUN_OUTPUT_DIR/entry.txt, then reads it back and self-checks.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORTUNE =
  "The market took your margin, not your future — trade smaller, learn faster, and let patience rebuild what leverage destroyed.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
const expected = FORTUNE + "\n";
writeFileSync(outPath, expected, "utf8");

// Self-check: read back and verify.
const actual = readFileSync(outPath, "utf8");
if (actual !== expected) {
  console.error("Self-check failed: file content differs from expected");
  process.exit(1);
}
if (FORTUNE.length === 0) {
  console.error("Self-check failed: fortune is empty");
  process.exit(1);
}
if (FORTUNE.length > 280) {
  console.error("Self-check failed: fortune exceeds 280 characters");
  process.exit(1);
}
const lines = actual.split("\n");
if (lines.length !== 2 || lines[1] !== "" || lines[0] !== FORTUNE) {
  console.error("Self-check failed: output is not exactly one line");
  process.exit(1);
}
if (FORTUNE.includes("\n") || FORTUNE.includes("\r")) {
  console.error("Self-check failed: fortune contains an internal line break");
  process.exit(1);
}
// Byte-length check: the written file must be exactly the UTF-8 bytes of
// the expected string (no BOM, no extra whitespace, no trailing blank line).
const actualBytes = readFileSync(outPath);
const expectedBytes = Buffer.from(expected, "utf8");
if (!actualBytes.equals(expectedBytes)) {
  console.error("Self-check failed: file bytes differ from expected UTF-8 bytes");
  process.exit(1);
}
if (actualBytes.length > 280 + 1) {
  console.error("Self-check failed: file byte length exceeds 281 bytes");
  process.exit(1);
}

console.log(`Wrote ${outPath} (${FORTUNE.length} chars, 1 line)`);
