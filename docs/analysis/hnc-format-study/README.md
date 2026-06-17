# Hancom Office Format Study (lofice v2.25)

Read-only analysis of Hancom Office 2022 install layout — **format and UI structure only**.
License bypass, DLL patching, and install-folder modification are out of scope.

## Applicable to lofice

| Source (install folder) | lofice module |
|-------------------------|---------------|
| `application/hwp+zip` MIME | `src/lib/hwp/extract-hwp-package.ts` |
| OLE magic `D0 CF 11 E0` | `src/lib/document/hwp-detect.ts` |
| `HML2DAISY3.xsl` HWPML paths | `src/lib/hwp/hwpml-paths.ts` |
| UxXml dialog inventory | `src/lib/hwp/hancom-parity-checklist.ts` |
| HWPX ZIP entries (mimetype, container.xml, content.hpf) | `scripts/dvc-validate.mjs` |

## Not applicable

- `HncCertMngr.dll`, `HncTrialUtil.dll` — commercial license; lofice is free OSS
- Registry `ProductID` — SaaS products use server-side entitlements instead
- Binary HNCFilter — use `@ssabrojs/hwpxjs` and `@rhwp/core`

## Full upgrade spec

See [LOFFICE_v2.25_HANCOM_STUDY_UPGRADE_SPEC.md](../LOFFICE_v2.25_HANCOM_STUDY_UPGRADE_SPEC.md).

## Related study (LawyGo license architecture)

License-specific notes live in the separate LawyGo repo under `docs/analysis/hnc-license-study/`.
They informed SaaS design, not lofice runtime code.
