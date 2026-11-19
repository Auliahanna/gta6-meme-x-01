// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is the X post named in POST.json: the house reads that
// post, and the judge sees its first picture and its text. This program's
// only job is to hand POST.json to the grader, unchanged, at
// /output/POST.json. Before copying, it validates the file: POST.json must
// be a JSON object whose "url" is the address of one X (or twitter.com)
// post, https://x.com/<handle>/status/<id>. A placeholder or a malformed
// address fails loudly here instead of being refused silently at the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// On success it prints nothing and exits 0, exactly as the gate expects.

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_FILE = join(BOT_DIR, 'POST.json');
const POST_URL_PATTERN = /^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/;

function readPostUrl(): string {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(POST_FILE, 'utf8'));
  } catch (err) {
    console.error(`POST.json is not readable JSON: ${(err as Error).message}`);
    process.exit(1);
  }
  const url = (parsed as { url?: unknown })?.url;
  if (typeof url !== 'string' || !POST_URL_PATTERN.test(url)) {
    console.error('POST.json must name one X post: {"url": "https://x.com/<handle>/status/<id>"}');
    process.exit(1);
  }
  return url;
}

readPostUrl();
mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(POST_FILE, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
