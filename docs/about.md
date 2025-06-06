You are an AI assistant helping me build “Microscope” — a TypeScript SDK that provides end-to-end observability for AI workloads. The SDK includes:

1. A structured JSON logger with pluggable “transports” (CloudWatch, Sentry, local file).
2. A non-blocking, back-pressure-aware ring buffer for telemetry events.
3. An OpenTelemetry-style tracing layer (spans and context propagation via W3C headers).
4. A JSONata-powered in-process query engine (`logger.find(expr)`).
5. A CLI tool called `logcat` (with subcommands `tail`, `search`, `upload`).
6. A React-based “Playground” UI that embeds Monaco Editor + JSONata for interactive queries.
7. Examples showing how to wire it up in AWS Lambda, Next.js Edge, and a Kubernetes operator.

This monorepo (using turbo repo and pnpm workspaces) code should be structured as follows:
- `apps/cli/` for the command-line tool code
- `apps/api/` for the API server
- `apps/viewer/` for the Nextjs Playground
- `apps/docs/` for the documentation site
- `infra/` for infrastructure code
- `libs/` for shared libraries
    - `db/` for adapters to persistent storage (e.g., DynamoDB, S3)
    - `ui/` for React components such as shadcn-ui
- `sdk/`
    - `typescript/` for the TypeScript SDK code
        - `src/`
            - `operator/` for the Kubernetes operator code
            - `lambda/` for the AWS Lambda code
        - `examples/` for examples of how to use the SDK in various environments
- `packages/core/src` for the core SDK code
    - `services/` for the core logger interfaces and implementations, grouped by domain
        - `sinks/` for each pluggable sink (CloudWatch, Sentry, File)
        - `query/` for JSONata query engine files
        - `buffer/` for the ring buffer and buffer manager
        - `tracing/` for span/tracer implementations
- `packages/shared/src/`
    - `utils/` for shared utilities (e.g., hashing, token counting)
    - `types/` for shared TypeScript interfaces (e.g., `TelemetryEvent`, `SpanAttributes`, `SinkConfig`)
    - `constants/` for constants (e.g., `MAX_SPAN_ATTRIBUTES`)
Use best practices: a Singleton pattern for the `BufferManager`, a Strategy pattern for `Transport`/`Sink`, and proper TypeScript typings throughout. Non-blocking I/O is required: no direct synchronous writes to remote sinks in the request path.

Keep imports and exports consistent so that `index.ts` (at the project root) can re-export everything cleanly.
