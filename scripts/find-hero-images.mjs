// Openverse'ten telifsiz (CC0/PDM) aday görseller listeler.
const terms = {
  kasar: ["cheddar cheese block", "yellow cheese", "kashkaval cheese"],
  bal: ["honey jar", "honey glass jar", "honeycomb honey"],
  tereyagi: ["butter block", "homemade butter", "butter dish"],
  kavurma: ["roasted beef meat", "cooked beef", "beef confit"],
};

async function q(term) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(
    term
  )}&license=cc0,pdm&size=large&page_size=6&mature=false`;
  const r = await fetch(url, { headers: { "User-Agent": "suthum-site/1.0" } });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.results || [])
    .filter((x) => x.filetype === "jpg" || x.filetype === "jpeg" || x.filetype === "png")
    .map((x) => ({ title: x.title?.slice(0, 60), url: x.url, license: x.license, w: x.width, h: x.height, size: x.filesize }));
}

for (const [key, list] of Object.entries(terms)) {
  console.log(`\n==== ${key.toUpperCase()} ====`);
  for (const term of list) {
    const res = await q(term);
    for (const it of res.slice(0, 3)) {
      console.log(`- [${it.license}] ${it.w}x${it.h} ${it.title}`);
      console.log(`  ${it.url}`);
    }
  }
}
