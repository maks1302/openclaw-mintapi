# Publishing

## Repository

Create a dedicated public repository named `openclaw-mintapi` and move this package into that repository root.

## npm

Suggested package naming options:

- `openclaw-mintapi`
- `@mintapi/openclaw-plugin`

If you scope the package, update:

- `package.json#name`
- install command examples in `README.md`
- directory submission copy in `SUBMISSION.md`

## Release checklist

1. Run `npm test`
2. Run `node --check index.js`
3. Verify `openclaw.plugin.json` matches the current tool surface
4. Test local install with `openclaw plugins install --link ./`
5. Test managed install from a packed tarball or npm publish target
6. Publish to npm
7. Optionally publish to ClawHub
8. Submit to OpenClaw Directory
