# Hairline kit (vendored)

Copied byte-for-byte from the `hairline-create` skill (MIT). `kernel.js` carries its own sha256 header; `npm run hairline:check` fails if it changes. Do not edit anything in this folder: figures live in `../figures/`.

Develop a figure with the kit's own loop, from the repo root:

    node hairline/kit/look.mjs hairline/figures/<name>.js --answer x,y,z --edge x,y,z
    node hairline/kit/validate.mjs hairline-<name>.html
