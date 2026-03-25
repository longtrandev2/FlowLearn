# Java + Spring Boot Agent Rules

## Project Context
You are an expert Java developer working with Spring Boot. This project is an API.

## Code Style & Structure
### Java Defaults
- Follow Java naming conventions: `camelCase` for methods/variables, `PascalCase` for classes, `UPPER_SNAKE_CASE` for constants.
- Use Java 17+ features: records, sealed classes, pattern matching, text blocks.
- Use `Optional<T>` for method returns that may be empty — never return null from methods. Use `Optional.of()`, `Optional.empty()`, `Optional.ofNullable()`.
- Use records (`record Point(int x, int y) {}`) for simple data carriers — they auto-generate constructor, equals, hashCode, toString.
- Prefer immutable objects. Use `final` on fields, parameters, and local variables by default.
- Use `Optional<T>` for return types that may be absent — never return `null` from public methods.
- Prefer composition over inheritance. Use interfaces for abstraction.
- Use `try-with-resources` for all `AutoCloseable` resources (streams, connections, files).
- Use `var` for local variables when the type is obvious from the right-hand side.

### OOP Design Patterns
- Follow SOLID principles for class design.
- Prefer composition over inheritance; use interfaces/protocols for abstraction.
- Encapsulate state within objects; expose behavior through well-defined methods.

## Linting & Formatting
### Checkstyle
- Start from Google or Sun checks configuration — customize from a known baseline. Integrate into CI with Maven/Gradle plugin and fail builds on violations. Use `SuppressionFilter` for intentional exceptions, not to silence everything.
- Configure `TreeWalker` checks for code style: `NeedBraces`, `WhitespaceAround`, `MethodLength`, `ParameterNumber`. Use `Checker` level checks for file-level rules: `FileLength`, `FileTabCharacter`, `NewlineAtEndOfFile`. Pin Checkstyle version in build config for reproducible builds. Use IDE plugins (IntelliJ, Eclipse) for real-time feedback.

## Spring Boot
- Use constructor injection (not `@Autowired` on fields) for all dependencies — it makes classes testable and immutable.
- Use Spring profiles (`@Profile`, `application-{profile}.yml`) to separate dev/staging/prod configuration — never use runtime `if` checks.
- Apply `@Transactional` on service methods, not on controllers or repositories — keep transaction boundaries at the business logic layer.
- Use `@RestControllerAdvice` with `@ExceptionHandler` methods for centralized error handling — return consistent error response DTOs.
- Use `@RestController` for REST APIs and `@Service` for business logic. Keep controllers thin.
- Use `application.yml` for configuration with Spring profiles for environment-specific overrides.
- Use `@Transactional` on service methods, not controllers or repositories.
- Use Spring Data repositories for CRUD — define custom queries with `@Query` only when needed.
- In Java: Use layered architecture: @RestController for request/response handling, @Service for business logic delegating to @Repository for data access.
- Employ DTOs for API endpoints; map entities to/from DTOs using custom utilities in services.
- Prefer constructor injection for dependency injection.
- Apply @Transactional at the service layer, not repositories.
- Handle exceptions globally with @ControllerAdvice.
- In Java: Use `@RestController` with `@RequestMapping("/api/v1/users")` for RESTful endpoints — return `ResponseEntity<T>` for typed responses with status codes.
- Inject dependencies with constructor injection: `public UserService(UserRepository repo)` — Spring auto-wires single-constructor beans.
- Use `@Transactional` on service methods for database transaction management — set `readOnly = true` on query-only methods.
- Configure properties with `@ConfigurationProperties(prefix = "app")` bound to a record: `record AppConfig(String name, int port) {}`.

## Architecture
### Architecture Fundamentals
- Separate concerns into layers (presentation, business logic, data access) — each layer should depend only on the layer below it.
- Design for testability: inject dependencies, avoid global state, use interfaces for external services.
- Use dependency injection to decouple components — pass dependencies through constructors or function parameters, not global imports.
- Keep modules loosely coupled with well-defined interfaces between them.
- Use dependency injection for external services and cross-cutting concerns.
- Prefer composition over inheritance for flexible, testable designs.

### Production Readiness
- Handle edge cases and failures gracefully — never assume the happy path.
- Add structured logging for all critical operations and error states.
- Use health check endpoints (`/healthz`, `/readyz`) for load balancers and orchestrators to verify service availability.
- Validate all external inputs at system boundaries. Trust nothing from users, APIs, or files.
- Add health check endpoints and readiness probes for all services.
- Use feature flags for risky rollouts — deploy dark, enable incrementally.
- Write code that fails loudly in development and recovers gracefully in production.

### Clean Architecture
- Organize into modules: `domain` (entities, repository interfaces), `application` (use cases), `infrastructure` (Spring, JPA, APIs).
- Domain module has no Spring annotations, no JPA, no framework dependencies.
- Use cases return domain objects — mapping to DTOs happens in the controller/adapter layer, not in the business logic.
- Define repository interfaces in domain. Implement with Spring Data JPA in infrastructure.
- Use cases are `@Service` classes in the application layer. They orchestrate domain logic.
- Use DTOs for API request/response. Map to domain entities at the infrastructure boundary.
- Use constructor injection everywhere. Wire dependencies via Spring's DI container.

### API Architecture
- Use consistent URL patterns: plural nouns for resources, nested routes for relationships. Avoid verbs in URLs.
- Return proper HTTP status codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error.
- Version your API from day one. Use URL prefix (/v1/) or Accept header versioning.
- Validate all request bodies and query parameters at the boundary. Return structured error responses with error codes.
- Implement pagination for all list endpoints: cursor-based (preferred) or offset-based. Include total count and next/prev links.
- Use consistent error response format: { "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }.
- Add rate limiting with clear headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.
- Support filtering, sorting, and field selection on list endpoints. Use query params: ?sort=-created_at&fields=id,name.
- Use ETags or Last-Modified for caching. Return 304 Not Modified when the resource has not changed.

### MVC
- Use `@RestController` for API controllers, `@Service` for business logic, `@Repository` for data access.
- Keep controllers thin: parse request, validate, call service, return response.
- Use DTOs (Data Transfer Objects) for request/response — never expose JPA entities directly in controllers.
- Use `@RequestBody` with `@Valid` for automatic input validation via Bean Validation annotations.
- Use `@ExceptionHandler` or `@ControllerAdvice` for centralized error handling.
- Use DTOs for request/response. Never expose JPA entities directly in API responses.
- Use Spring Data repositories for standard CRUD. Add custom query methods only when needed.

### API Documentation
- Maintain an OpenAPI (Swagger) spec as the single source of truth. Generate docs, SDKs, and validation from the spec — not the other way around.
- Document every endpoint with description, request/response schemas, example payloads, and possible error codes.
- Include runnable examples for every endpoint. Each example should be copy-pasteable with curl or the language SDK.
- Document authentication requirements, rate limits, and pagination patterns in a dedicated overview section.
- Validate the OpenAPI spec in CI. Reject PRs that add endpoints without documentation or that introduce spec-breaking changes.
- Document error responses with the same rigor as success responses. Every error code should have a description, example payload, and resolution guidance.
- Provide a getting-started guide that walks through authentication, making a first request, and handling pagination in under 5 minutes.
- Use consistent naming: operation IDs should follow a verb-noun pattern (createUser, listOrders, deleteProduct). These become SDK method names.
- Generate and publish client SDKs from the spec. Official SDKs reduce integration friction and prevent clients from misusing the API.
- Include a changelog page in the docs that lists every API change by date and version.

## Performance
### Java Performance
- Profile before optimizing: use JMH for microbenchmarks, async-profiler or JFR for production profiling.
- Use `StringBuilder` for string concatenation in loops — `+` creates new objects on each iteration.
- Use JMH (`@Benchmark`) for microbenchmarks — avoid premature optimization based on intuition, measure with JVM warm-up.
- Use `ArrayList` over `LinkedList` in almost all cases — cache locality dominates pointer chasing.
- Use `HashMap` initial capacity to avoid rehashing: `new HashMap<>(expectedSize * 4 / 3 + 1)`.
- Use `Stream.parallel()` only for CPU-heavy operations on large datasets — parallelism has overhead.
- Use primitive specializations (`IntStream`, `LongStream`) to avoid boxing in numeric streams.

## Security
### Java Security
- Use prepared statements for all SQL queries — never concatenate user input into SQL strings to prevent injection.
- Validate and sanitize all external input at system boundaries with Bean Validation (`@Valid`, `@NotNull`, `@Size`).
- Store secrets in environment variables or a vault (HashiCorp Vault, AWS Secrets Manager) — never in source code or properties files committed to git.
- Use prepared statements (`PreparedStatement`) for all SQL.
- Validate input with Bean Validation annotations.
- Store secrets in env vars or vault, never in source code.
- Use `java.security.SecureRandom` for cryptographic operations.
- Enable CSRF protection in Spring Security for web apps.

## Error Handling
### Try/Catch
- Use try/catch blocks for error handling. Catch specific error types, not generic exceptions.
- Never catch errors silently — always log, handle, or rethrow with additional context.
- Log the full error stack trace at the catch site — re-throw with additional context if the error needs to propagate up the call chain.
- Provide meaningful error messages that include what operation failed and why.
- Use typed error hierarchies: ValidationError, NotFoundError, AuthenticationError — not generic Error.
- Log errors with structured data: operation name, input parameters, stack trace, and timestamp.
- Use finally blocks for cleanup that must run regardless of success or failure.

## Libraries & Tools
### Lombok
- Use `@Data` for DTOs (generates getters, setters, equals, hashCode, toString) — use `@Value` for immutable classes.
- Use `@Builder` for complex object construction — combine with `@AllArgsConstructor(access = AccessLevel.PRIVATE)` to enforce builder usage.
- Use `@Slf4j` for logging instead of manually creating logger fields — it generates `private static final Logger log = LoggerFactory.getLogger()`.
- Use `@Value` for immutable data classes (all fields `final`, no setters).
- Use `@RequiredArgsConstructor` with `final` fields for constructor injection (Spring-compatible).
- Use `@Builder.Default` for default values in builder patterns.
- Avoid `@Data` on JPA entities — implement `equals`/`hashCode` manually using business keys.

## Git & Workflow
### Conventional Commits
- Format commits strictly following Conventional Commits format: `type(scope): subject`.
- Keep the subject line under 50 characters, use the imperative mood, and do not end with a period.
- Adhere strictly to Conventional Commits format (e.g., `feat(auth): add google sign-in`, `fix(api): resolve memory leak`).
- Use appropriate semantic types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`, `perf`.
- Indicate breaking changes clearly by appending a `!` to the type/scope (e.g., `feat(api)!: drop v1 endpoints`) or in the footer as `BREAKING CHANGE:`.

### Branch Strategy
- Use descriptive branch names: `feature/`, `fix/`, `chore/`, `docs/` prefixes followed by a short slug.
- Keep branches short-lived — merge or rebase frequently to avoid drift from main.
- Use short-lived feature branches that merge within 1-3 days — long-lived branches cause merge conflicts and integration pain.
- Protect the main branch — require PR reviews and passing CI before merge.
- Delete branches after merging to keep the repository clean.
- Rebase feature branches on main before creating a PR to ensure a clean diff.
