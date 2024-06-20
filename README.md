# ssr-sre-automark

An experiment leveraging [speech-rule-engine's](https://github.com/zorkow/speech-rule-engine/) automark feature to provide linearized output in server-side-rendered [mathjax](https://github.com/mathjax/mathjax/) output.

## first steps into SRE automark

From https://github.com/Speech-Rule-Engine/speech-rule-engine?tab=readme-ov-file#command-line-options

which is out of date - `-e` found via `$ npx sre -h`

`$ npx sre -e -k ssml < input` - "Walkable" speech

`$ npx sre -m < input` - enriched mml

walkable speech is "flat" SSML with mark elements @name pointing to enrich MML nodes

## Strategy 1:

- go through enriched MML leaves
  - `$0.querySelectorAll('[data-semantic-id]:not([data-semantic-children]')` (some nodes have no -id AND no -children, e.g. mrows)
- attach all ssml text up until that node

MEEP
DOESN'T WORK.
E.g., mitternachtsformel - (in "-b") is leaf aber kein mark zeigt darauf.

[we could start skipping until we find a leaf with a matching ID but let's try th reverse first]

## Strategy 2

- loop through SSML prosody element children (-- prosody only has leaf children (XML or text)?)

- let s = ''
- if current element is mark
  - if name ID matches a leaf
    - s += mark.sibling.text (either plain text or say-as -- correct?)
    - add aria-label=s to leaf
    - reset s=''
    - continue with element after sibling
  - else
    - s += element.text
    - continue with next element

Problems:

- ssml might not start (nor end) with mark
- might have END marks
- mark targets might need some text from before and some from after


Other problems:

- mathjax output might not have correct DOM order (over/under/base, tables)
  - e.g. labeled equations (without SVG table hack for LHS, non-stretchy tags)
  - I think I saw some issues with CSS layout (-\sigma_x^y having "- sigma" after limits) - would need confirmation

examples

- `x = {-b \pm \sqrt{b^2-4ac} \over 2a}.` - ok
- `ax^2 + bx + c = 0` -- dropped `0`  (fixed)
- `x^2 + \int_0^\infty f(y) dy = \frac{1}{2\pi i};` -- dropped trailing `;` (fixed)
- `\begin{multline} H_l(N) = \frac{(-1)^{l-1}}{\pi } \sqrt {-\frac{z_0(1-e^{z_0})}{\rho ^2e^{z_0}}} \Bigg (\Im \left( \frac{\rho (-z_0)^{l-1/2}}{\sqrt {1-e^{z_0}}}\right)\cos (2\pi N/p)) \\ +\Re \left(\frac{\rho (-z_0)^{l-1/2}}{\sqrt {1-e^{z_0}}}\right)\sin (2\pi N /p)\Bigg ). \end{multline}` - remove \Im, \Re to avoid font crashes (fixed)
- `\begin{align} a \tag{18a}\\ b \tag{18b} \end{align}` - tags out of order; very poor result (but hack available by giving up on "stretchy SVG tags")

aria

- maybe add roles?
  - role=image on nodes with label
  - maybe presentation on everything else
  - maybe group on svg

