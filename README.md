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
