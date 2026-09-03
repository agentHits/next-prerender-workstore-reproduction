# Next.js Lightweight Benchmark & Prerendering Invariant Reproduction

> **Topic:** Next.js 16 & Turbopack Performance Benchmark — Towards a Lighter, Zero-Bloat App Router.
> **Issue:** InvariantError E1068 during static prerendering & RSC Flight CSS duplication.

## 📊 Benchmark Overview & Impact

![Next.js Benchmark Comparison (English)](https://raw.githubusercontent.com/agentHits/next-prerender-workstore-reproduction/main/nextjs-lightweight-benchmark-en.png)

![Next.js Benchmark Comparison (Russian)](https://raw.githubusercontent.com/agentHits/next-prerender-workstore-reproduction/main/nextjs-lightweight-benchmark-ru.png)

---

## 🎯 Purpose of this Benchmark Project

This repository serves two primary purposes:
1. **Lightweight Web Benchmark:** Analyzing how Next.js 16 (App Router + Turbopack) handles large-scale static site generation (140+ prerendered localized routes across 10 global languages) and measuring initial HTML / RSC payload overhead.
2. **Framework Bug Reproduction:** Documenting and reproducing the framework-level issue:
   `Error [InvariantError]: Invariant: Expected workStore to be initialized. This is a bug in Next.js.` (related to closed issue [#96261](https://github.com/vercel/next.js/issues/96261)).

---

## 🐛 Bug Analysis: The `workStore` Async Timing Bug

### Root Cause
In Next.js `packages/next/src/lib/metadata/resolve-metadata.ts`:

```ts
export async function resolveMetadata(
  tree,
  pathname,
  searchParams,
  errorConvention,
  interpolatedParams,
  metadataContext
) {
  // 1. Asynchronous segment and loader traversal
  const metadataItems = await resolveMetadataItems(tree, searchParams, errorConvention, interpolatedParams);

  // 2. BUG: workAsyncStorage.getStore() called AFTER the await!
  const workStore = workAsyncStorage.getStore();
  if (!workStore) {
    throw new InvariantError('Expected workStore to be initialized'); // E1068
  }
  return accumulateMetadata(workStore.route, metadataItems, pathname, metadataContext);
}
```

During cold static builds across multiple worker threads, `resolveMetadataItems` evaluates async module imports. After the `await`, execution resumes on a microtask continuation where the Node.js `AsyncLocalStorage` context can be lost or unset, causing `getStore()` to return `undefined`.

### Side Effect: HTML & RSC Payload Bloat
When projects attempt workarounds like `experimental.inlineCss: true`, Next.js forces synchronous CSS module evaluation before the await, avoiding the crash. However, this causes **severe payload bloat**:
- Hundreds of kilobytes of CSS are duplicated directly into the React Server Component (RSC) Flight stream (`self.__next_f`).
- Initial HTML size inflates from ~150 KB to >700 KB, degrading Core Web Vitals (FCP, LCP, Network Transfer).

### Proposed Fix
Read `workAsyncStorage.getStore()` **before** awaiting `resolveMetadataItems`:

```ts
export async function resolveMetadata(
  tree,
  pathname,
  searchParams,
  errorConvention,
  interpolatedParams,
  metadataContext
) {
  const workStore = workAsyncStorage.getStore();
  const metadataItems = await resolveMetadataItems(tree, searchParams, errorConvention, interpolatedParams);
  if (!workStore) {
    throw new InvariantError('Expected workStore to be initialized');
  }
  return accumulateMetadata(workStore.route, metadataItems, pathname, metadataContext);
}
```

---

## 🚀 Running the Project

```bash
# Install dependencies
bun install   # or pnpm install / npm install

# Run cold static prerender build
bun run build
```

## 📄 License
MIT
