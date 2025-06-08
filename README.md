# microscope

**Microscope** is a TypeScript SDK and monorepo providing end-to-end observability for AI workloads. It is designed for modern, cloud-native environments and supports structured logging, tracing, querying, and more, with a focus on non-blocking, scalable telemetry.

---

## Features

- **Structured JSON Logger**  
  Pluggable “transports” (CloudWatch, Sentry, local file) for flexible log delivery.

- **Non-blocking Ring Buffer**  
  Back-pressure-aware, high-throughput event buffering.

- **OpenTelemetry-style Tracing**  
  Spans and context propagation via W3C headers.

- **In-process Query Engine**  
  JSONata-powered queries: `logger.find(expr)`.

- **CLI Tool: `logcat`**  
  Subcommands: `tail`, `search`, `upload`.

- **Playground UI**  
  React-based, Monaco Editor + JSONata for interactive queries.

- **Deployment Examples**  
  AWS Lambda, Next.js Edge, Kubernetes operator.

---

## Monorepo Structure

This project uses [Turborepo](https://turbo.build/) and [pnpm workspaces](https://pnpm.io/workspaces) for fast, scalable development.

```
apps/
  cli/      # CLI tool: logcat
  api/      # API server
  viewer/   # Next.js Playground UI
  docs/     # Documentation site

infra/      # Infrastructure as code

libs/
  db/       # Persistent storage adapters (DynamoDB, S3, etc.)
  ui/       # Shared React components

sdk/
  typescript/
    src/        # TypeScript SDK core
      operator/ # Kubernetes operator
      lambda/   # AWS Lambda integration
    examples/   # Usage examples

packages/
  core/
    src/        # Core logger, buffer, tracing, query engine
    test/       # Unit/integration tests
  shared/
    src/
      utils/      # Shared utilities (hashing, token counting, etc.)
      types/      # Shared TypeScript interfaces (TelemetryEvent, etc.)
      constants/  # Shared constants
```

---

## Best Practices

- **Singleton**: `BufferManager` uses the Singleton pattern.
- **Strategy**: Pluggable `Transport`/`Sink` implementations.
- **Type Safety**: Strong TypeScript typings throughout.
- **Non-blocking I/O**: No direct synchronous writes to remote sinks in the request path.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- [pnpm](https://pnpm.io/) (recommended)
- [Turborepo](https://turbo.build/) (installed as a dev dependency)

### Install

```sh
pnpm install
```

### Build

```sh
pnpm build
```

### Develop

```sh
pnpm dev
```

### Test

```sh
pnpm test
```

---

## Documentation

- See [`docs/about.md`](docs/about.md) for a high-level overview.
- The documentation site is in `apps/docs/`.

---

## Contributing

Contributions are welcome! Please open issues or pull requests.

---

## License

[MIT](LICENSE) (or your chosen license)

---

Let me know if you want to customize any section or add badges, usage examples, or contribution guidelines!