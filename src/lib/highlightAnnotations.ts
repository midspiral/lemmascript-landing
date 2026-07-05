// Tiny, faithful code highlighter for case-study snippets (annotation/comment/keyword only).
// Directive coloring mirrors github.com/midspiral/lemmascript-vscode: only a recognized
// directive right after `//@` is colored — anything else (typos, wrapped continuation
// lines) falls back to plain comment, same as the real grammar.
const KW =
  /\b(export|function|return|const|let|while|for|if|else|break|true|false|type|interface|new)\b/g

const DIRECTIVES = [
  'requires', 'ensures', 'invariant', 'decreases', 'declare-type', 'contract',
  'done_with', 'backend', 'extern', 'verify', 'ghost', 'havoc', 'assume',
  'assert-shaped', 'assert', 'autohavoc', 'safe-slice', 'pure', 'type',
]

const DIR_CLASS: Record<string, string> = {
  requires: 't-dir-requires',
  ensures: 't-dir-ensures',
  contract: 't-dir-contract',
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function highlightLine(line: string): string {
  const escaped = esc(line)
  const anno = line.match(/^(\s*)\/\/(@)[ \t]+([A-Za-z_-]+)\b(.*)$/)
  if (anno) {
    const indent = anno[1]
    const word = anno[3]
    const rest = anno[4]
    if (DIRECTIVES.includes(word)) {
      const cls = DIR_CLASS[word] || 't-dir'
      const escapedRest = esc(rest)
      const body =
        word === 'contract'
          ? '<span class="t-prose">' + escapedRest + '</span>'
          : '<span class="t-annokw">' +
            escapedRest.replace(/\\result\b/g, '<span class="t-result">\\result</span>') +
            '</span>'
      return (
        indent +
        '<span class="t-cmt">' + '/' + '/' + '</span>' +
        '<span class="t-at">@</span> ' +
        '<span class="' + cls + '">' + word + '</span>' +
        body
      )
    }
  }
  if (/^\s*\/\//.test(line)) return '<span class="t-cmt">' + escaped + '</span>'
  return escaped.replace(KW, '<span class="t-kw">$1</span>')
}

export function highlightAnnotations(code: string): string {
  return code.split('\n').map(highlightLine).join('\n')
}
