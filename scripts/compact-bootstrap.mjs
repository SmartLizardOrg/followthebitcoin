// Static exports contain one classic script per streamed RSC chunk. Only join
// adjacent, attribute-free, known Vinext string-push statements. No DOM-reading
// code, module scripts, attributes or intervening markup may cross a boundary.
const pushPrefix =
  '((self[Symbol.for("vinext.navigationRuntime")]??={bootstrap:{routeManifest:null},functions:{}}).bootstrap.rsc??={rsc:[]}).rsc.push(';

function isChunk(script) {
  if (
    script[1] !== '' ||
    !script[2].startsWith(pushPrefix) ||
    !script[2].endsWith(')')
  )
    return false;
  try {
    return (
      typeof JSON.parse(script[2].slice(pushPrefix.length, -1)) === 'string'
    );
  } catch {
    return false;
  }
}

export function compactBootstrap(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  let result = '';
  let cursor = 0;
  for (let index = 0; index < scripts.length; index++) {
    const first = scripts[index];
    if (!isChunk(first)) continue;
    let last = first;
    const statements = [first[2]];
    while (index + 1 < scripts.length) {
      const next = scripts[index + 1];
      if (
        !isChunk(next) ||
        html.slice(last.index + last[0].length, next.index).trim() !== ''
      )
        break;
      statements.push(next[2]);
      last = next;
      index++;
    }
    if (statements.length === 1) continue;
    result +=
      html.slice(cursor, first.index) +
      `<script>${statements.join(';\n')}</script>`;
    cursor = last.index + last[0].length;
  }
  return result + html.slice(cursor);
}
