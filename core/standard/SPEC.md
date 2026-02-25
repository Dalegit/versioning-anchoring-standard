# Versioning & Anchoring Standard

Status: Draft  
Version: v0.1.0  
License: MIT  

---

## 1. Scope

This standard defines a deterministic method for committing to digital artifacts using canonical JSON and SHA-256 hashing.

Version v0.1.0 specifies:

- Canonicalization requirements for JSON manifests  
- SHA-256 hashing discipline  
- Deterministic release manifest structure  
- Layered separation between commitment primitives and release/versioning patterns  

This version does not define:

- Digital signature schemes  
- Registry governance mechanisms  
- Domain-specific artifact profiles  
- Formal threat modeling  
- Concrete anchoring mechanisms (blockchains, timestamping services, etc.)

These may be introduced in future versions.

---

## 2. Architectural Layers

This standard is structured in layered form to separate core cryptographic commitment primitives from higher-level release and versioning patterns.

### 2.1 Evidence Commitment Layer (Core Primitive)

The Evidence Commitment Layer defines deterministic byte commitment rules.

It specifies:

- Canonicalization requirements  
- Hashing algorithm (SHA-256)  
- Deterministic manifest structure  
- Optional anchoring as an external action (out of scope in v0.1.0)

This layer is content-agnostic and applies to any digital artifact.

It ensures that identical logical content produces identical hash commitments.

---

### 2.2 Release & Versioning Layer

The Release & Versioning Layer builds on the Evidence Commitment Layer.

It specifies:

- Release manifests  
- Semantic versioning discipline  
- Ordered releases  
- Artifact bundling  
- Chronological commitments  

This layer defines how commitments are organized and tracked across time.

---

### 2.3 Profiles (Extension Layer)

Profiles define domain-specific structures built on the previous layers  
(e.g., document profiles, dataset profiles, procedure profiles).

Profiles MUST NOT violate core canonicalization or hashing rules defined by this standard.

Profiles are not defined in v0.1.0.

---

## 3. Canonicalization Requirements (v0.1.0 Canonical JSON)

All manifests MUST be serialized deterministically prior to hashing.

### 3.1 Required Rules

The following rules apply:

1. Encoding MUST be UTF-8 without BOM.  
2. Object keys MUST be sorted lexicographically (recursive sorting).  
3. Arrays MUST preserve order (no sorting of arrays).  
4. Line endings MUST be LF (`\n`).  
5. The canonical JSON serialization MUST be fixed and consistent across implementations.

### 3.2 Canonical JSON Serialization Format (Normative)

For v0.1.0, “Canonical JSON” is defined as:

- A JSON document produced from the recursively key-sorted object.
- The serialized output MUST use **two-space indentation**.
- The serialized output MUST NOT include a trailing newline at end-of-file.
- Whitespace MUST match the two-space-indented JSON formatting (i.e., no arbitrary alternative indentation widths).

Implementations MAY implement this by producing the same byte output as the following conceptual reference:

- `JSON.stringify(sortedObject, null, 2)` (or exact equivalent in other languages)

If canonical bytes differ, the resulting hash differs. Determinism is mandatory.

### 3.3 Numeric Determinism

Numeric formatting SHOULD avoid floating-point ambiguity.

Implementations MAY restrict numeric types (e.g., forbid floats) to ensure deterministic serialization.

---

## 4. Hashing Discipline

The hashing algorithm defined by this version of the standard is:

- SHA-256

Hash inputs MUST be the canonical byte representation of the manifest.

The output MUST be represented as lowercase hexadecimal.

Any change to canonicalized bytes MUST produce a different hash.

Future versions MAY define alternative algorithms but MUST specify them explicitly.

---

## 5. Release Manifest Structure (v0.1.0 Baseline)

The release manifest is a canonical JSON document describing a versioned release.

### 5.1 Required Top-Level Fields

- `schemaVersion` — String identifying the manifest schema version (e.g., `"0.1.0"`)  
- `release` — Object containing release metadata  
- `artifacts` — Array of artifact entries included in the release  

### 5.2 Required `release` Fields

- `release.name` — Human-readable name of the release (string)  
- `release.version` — MUST follow Semantic Versioning `MAJOR.MINOR.PATCH` (string)  
- `release.releasedAtUtc` — ISO 8601 UTC timestamp (string), e.g., `2026-02-16T00:00:00Z`

### 5.3 Required `artifacts` Entry Fields (Minimal Schema)

`artifacts` MUST be an array of objects.

Each artifact entry MUST include:

- `path` — String path or identifier for the artifact (e.g., `"standard/spec.md"`)  
- `sha256` — Lowercase hex SHA-256 of the artifact bytes (string)

Artifact entries MAY include additional fields such as:

- `contentType` — MIME type (string)  
- `sizeBytes` — Integer size in bytes  
- `description` — Human-readable description (string)

### 5.4 Manifest Hash

The manifest itself is hashed after canonicalization.

The resulting SHA-256 hash is the release commitment.

---

## 6. Conformance

An implementation conforms to this standard (v0.1.0) if it:

- Produces identical canonical byte output for identical logical input  
- Uses SHA-256 as specified  
- Follows required manifest structure  
- Does not alter canonicalized bytes prior to hashing  
- Produces lowercase-hex SHA-256 outputs

Non-deterministic implementations are non-conforming.

---

## 7. Status & Roadmap (Informative)

This section is informative and does not define normative requirements.

### Planned Extensions

Future minor versions may introduce:

- Formal normative terminology (MUST / SHOULD / MAY definitions)  
- Explicit threat model definition  
- Canonicalization alignment with RFC 8785  
- Optional digital signature layer  
- Registry governance model  
- Artifact profile definitions  

### Potential Modularization

As the standard matures, architectural layers may be separated into independent but composable standards.

Possible future modularization paths include:

- Evidence Commitment Standard (core deterministic commitment layer)  
- Release & Versioning Standard (layer built on commitment primitive)  
- Domain-Specific Profile Standards  

If modularization occurs, each resulting standard will maintain its own independent semantic versioning stream.
