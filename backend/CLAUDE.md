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
