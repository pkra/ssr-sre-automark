# ssr-sre-automark

An experiment leveraging [speech-rule-engine's](https://github.com/zorkow/speech-rule-engine/) automark feature to provide linearized output in server-side-rendered [mathjax](https://github.com/mathjax/mathjax/) output.

## first steps into SRE automark

From https://github.com/Speech-Rule-Engine/speech-rule-engine?tab=readme-ov-file#command-line-options

which is out of date - `-e` found via `$ npx sre -h`

`$ npx sre -e -k ssml < input`  - "Walkable" speech

`$ npx sre -m < input` - enriched mml

walkable speech is "flat" SSML with mark elements @name pointing to enrich MML nodes

