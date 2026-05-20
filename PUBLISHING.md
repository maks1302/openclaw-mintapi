# Publishing

## Repository

Create a dedicated public repository named `openclaw-mintapi` and move this package into that repository root.

## npm

Chosen package name:

- `@mintapi/openclaw-mintapi`

This is better than an unscoped package because it reduces collision risk and keeps ownership aligned with the MintAPI npm scope.

## Release checklist

1. Run `npm test`
2. Run `npm run check`
3. Run `npm run pack:dry-run`
4. Verify `openclaw.plugin.json` matches the current tool surface
5. Test local install with `openclaw plugins install --link ./`
6. Test managed install from a packed tarball or npm publish target
7. Publish to npm
8. Optionally publish to ClawHub
9. Submit to OpenClaw Directory

## First publish

For the first release, publish manually from your machine after you have:

1. created the GitHub repo
2. pushed the initial code
3. created the npm scope/package access
4. logged in with `npm login`

Manual first publish:

```bash
npm test
npm run check
npm run pack:dry-run
npm publish --access public
```

Reason: this claims the package name and lets you verify npm-side access before relying on GitHub trusted publishing.

## After the first publish

Use the tag-based GitHub Actions workflow in `.github/workflows/publish.yml`.

Release flow:

1. update `package.json#version`
2. update `CHANGELOG.md`
3. commit and push to `main`
4. push a git tag like `v0.1.0`
5. let GitHub Actions publish

Commands:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Trusted publishing setup

Preferred long-term setup is npm trusted publishing from GitHub Actions.

Before tag-based publishing can work:

1. ensure the `@mintapi` npm scope exists
2. ensure your npm user has publish rights for `@mintapi/openclaw-mintapi`
3. add a trusted publisher in npm for:
4. GitHub owner/repo: `maks1302/openclaw-mintapi`
5. workflow file: `.github/workflows/publish.yml`

Reference:

- https://docs.npmjs.com/trusted-publishers/
