// Resolves each talent's Workable email from their candidate ID.
// Usage: WORKABLE_API_KEY=xxx npm run fetch-emails
// Prints a block you can paste back into data/talents.ts.
//
// Workable SPI v3: GET /spi/v3/candidates/{id}
// (same hex IDs used by workable-profile.lovable.app)

const KEY = process.env.WORKABLE_API_KEY;
if (!KEY) {
  console.error("Set WORKABLE_API_KEY first.");
  process.exit(1);
}

const IDS = [
  ["2550a857", "Paul"],
  ["25b7cf68", "MJ"],
  ["258bfb9f", "Chin"],
  ["25a08972", "Glo"],
  ["25bb2af7", "Chrisanne"],
  ["252891c0", "Jaspher"],
  ["259f4b3d", "Angela"],
  ["254e01e1", "Kaycee"],
  ["2578106a", "Harsh"],
  ["2184dee4", "Annmarie"],
  ["24a333ce", "Abdus"],
  ["24b7eab4", "Yago"],
];

for (const [id, name] of IDS) {
  try {
    const res = await fetch(`https://coconutva.workable.com/spi/v3/candidates/${id}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) {
      console.log(`${name} (${id}): HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    const c = data.candidate ?? data;
    console.log(`${name} (${id}): ${c.email ?? "no email"} — stage: ${c.stage ?? "?"}`);
  } catch (err) {
    console.log(`${name} (${id}): error ${err.message}`);
  }
  await new Promise((r) => setTimeout(r, 300));
}
