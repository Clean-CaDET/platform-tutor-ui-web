# Claude Code Instructions

Follow these rules strictly. Prefer modern Angular patterns over legacy approaches.

## Stack

Angular 21 (standalone, zoneless, signals-first) · TypeScript 5.9 strict · RxJS 7.8 · Angular Material 3 · Vitest · Vite + ESBuild

## Project Structure

```
src/app/
├── core/                    # Singleton services, guards, interceptors
│   ├── auth/                # auth.guard, auth.interceptor, auth.service, token.storage
│   ├── http/                # global-loading.service, global-ui.interceptor
│   ├── notification/        # notification.service (MatSnackBar wrapper)
│   ├── layout/navbar/       # Side navbar
│   ├── confirm-exit.guard.ts
│   └── route.util.ts        # getRouteParams(), onNavigationEnd()
├── shared/
│   ├── generics/            # generic-table, generic-form, delete-form, generic-selection-form
│   ├── markdown/            # cc-markdown, markdown-editor, markdown-panel
│   ├── directives/
│   ├── events/
│   └── reports/
├── features/                # By use case: authoring/, learning/, monitoring/, management/, supervision/, home/
├── app.component.ts
├── app.config.ts            # Central providers (router, http, interceptors, markdown)
└── app.routes.ts
```

## Architecture

**Standalone only** — no NgModules. Do NOT set `standalone: true` (it's the default). Import deps in `imports` array.

**Zoneless** — no `zone.js`. State changes propagate via signals, `input()`, `output()`, events, or `markForCheck()`.

**OnPush** — set `changeDetection: ChangeDetectionStrategy.OnPush` on every component.

**Selector prefix** — use `cc-` for all components.

## Signals

| Use | For |
|---|---|
| `signal()` | Mutable local state |
| `computed()` | Derived state (keep pure) |
| `effect()` | Side effects (logging, localStorage, DOM manipulation). Use sparingly. |
| `linkedSignal()` | Derives from another signal but stays independently writable |
| `model()` | Two-way bindable signal (component ↔ parent) |
| `input()` / `input.required()` | Component inputs |
| `output()` | Component outputs |
| `viewChild()` / `contentChild()` | Template/content queries |
| `toSignal()` / `toObservable()` | RxJS interop (`@angular/core/rxjs-interop`) |

Use `set()` or `update()` — never `mutate()`.

## Data Fetching

**`rxResource()`** (primary for GET) — reactive, signal-based, auto-refires when dependent signals change. Integrates with RxJS operators for service-layer transformations.

```typescript
private readonly items = rxResource({
  params: () => ({ id: this.parentId() }),
  stream: ({ params }) => this.service.getItems(params.id),
  defaultValue: [],
});
```

**`httpResource()`** — lighter alternative for simple GETs that don't need RxJS operators. Import from `@angular/common/http`.

**`HttpClient`** — use directly for POST/PUT/DELETE mutations (via services).

**Template pattern:**
```html
@if (res.hasValue()) { <cc-detail [data]="res.value()" /> }
@else if (res.error()) { <div>Error</div> }
@else if (res.isLoading()) { <mat-spinner /> }
```

Guard reads with `hasValue()` since `.value()` throws on errored resources.

## Templates

**Control flow**: `@if`/`@else`, `@for (item of items; track item.id)`, `@switch`/`@case`. Never `*ngIf`/`*ngFor`/`*ngSwitch`.

**Bindings**: `[class]` not `ngClass`, `[style]` not `ngStyle`. No arrow functions or globals in templates.

**Images**: `NgOptimizedImage` (`<img ngSrc="...">`) for static images.

**Deferred loading**: Do not use `@defer` for now.

## Components & DI

Use `inject()` — never constructor injection. Use `providedIn: 'root'` for singletons.

**Host bindings**: Use `host` object by default. `@HostListener` is acceptable for window-level events (`beforeunload`, `resize`).

**File separation**: If template exceeds **20 lines of HTML**, extract to `.component.html` (and styles to `.component.scss`). Inline `template`/`styles` only for small components.

**Lifecycle**: Prefer constructor + `effect()` over `ngOnInit`. Keep `ngOnInit` only when you need the view to be initialized. Keep `ngOnDestroy` for cleanup that signals can't handle (e.g., `MutationObserver`).

## Forms

Use `ReactiveFormsModule` with `FormBuilder`. No signal forms yet.

```typescript
private readonly fb = inject(FormBuilder);
formGroup = this.fb.group({ name: ['', Validators.required] });
```

## Routing

Lazy load everything. Routes arrays only — no routing modules.

**Guards** (see `core/auth/auth.guard.ts`, `core/confirm-exit.guard.ts`):
- `authGuard` — checks `authService.user()` signal, supports role-based access via `route.data['role']`
- `confirmExitGuard` — components implement `CanComponentDeactivate` interface with `canDeactivate()` method

**Route utilities** (`core/route.util.ts`):
- `getRouteParams(route)` — recursively collects params from route and all children
- `onNavigationEnd(callback)` — subscribes to `NavigationEnd` with auto `takeUntilDestroyed()`. Callback receives `(url, params)`. Must be called in injection context.

## Services

Single responsibility. `providedIn: 'root'`. Use `inject()`. Keep API calls in services, never in components.

## HTTP Layer

**Interceptors** (registered in `app.config.ts`):
- `authInterceptor` — attaches Bearer token, handles 401 with token refresh
- `globalUiInterceptor` — manages global loading spinner + error notifications

**Context tokens** (`core/http/global-ui.interceptor.ts`):
```typescript
import { SKIP_GLOBAL_ERROR, SKIP_GLOBAL_LOADING } from '../core/http/global-ui.interceptor';
// Usage: this.http.get(url, { context: new HttpContext().set(SKIP_GLOBAL_LOADING, true) })
```

**Global loading** (`core/http/global-loading.service.ts`): Signal-based `isLoading`. Auto-managed by the interceptor.

**Notifications** (`core/notification/notification.service.ts`): `error(msg?)`, `success(msg)`, `info(msg)` — wraps MatSnackBar with appropriate durations.

## Markdown Rendering (`cc-markdown`)

**Never use `<markdown>` from `ngx-markdown` directly.** Always use `<cc-markdown>` — it adds image fitting and click-to-modal.

| Input | Type | Default | Description |
|---|---|---|---|
| `data` | `string` | — | Markdown via property binding. Omit for content projection. |
| `clipboard` | `boolean` | `false` | Copy button on code blocks |
| `lineNumbers` | `boolean` | `false` | Line numbers on code blocks |
| `modalImages` | `boolean` | `true` | Image click-to-modal + max-width fitting |

```html
<cc-markdown>{{ someText }}</cc-markdown>
<cc-markdown [data]="someText" />
<cc-markdown [data]="text()" [lineNumbers]="true" [modalImages]="false" />
```

Import: `CcMarkdownComponent` from `shared/markdown/cc-markdown.component`.

## Shared Generics (`shared/generics/`)

CRUD components backed by `Entity` (`{ id: number }`) and `Field` configuration:

- **`cc-generic-table`** — paginated table with configurable columns. Inputs: `baseUrl`, `fieldConfiguration`, `noPagination`, `title`. Output: `selectItem`.
- **`cc-generic-form`** — dialog-based create/edit form. Injected data: `entity`, `fieldConfiguration`, `label`.
- **`cc-delete-form`** — dialog-based delete confirmation. Optional `secureDelete` input.
- **`cc-generic-selection-form`** — dialog-based selection from a list.

Models: `shared/generics/model/` — `Entity`, `Field`, `Crud`, `FieldOption`.

## Styling & Theming

Angular Material 3 with CSS custom properties. Theme defined in `src/cc-primary-theme.scss`:

```scss
html {
  color-scheme: light dark;
  @include mat.theme((color: mat.$blue-palette, typography: Roboto, density: 0));
}
```

- Use `--mat-sys-*` tokens for theming (e.g., `var(--mat-sys-primary)`, `var(--mat-sys-surface)`)
- No `color="primary"` — use CSS token overrides instead
- Button directives: `matButton`, `matButton="elevated"`, `matButton="filled"`, `matButton="outlined"`, `matIconButton`, `matFab`, `matMiniFab`

## TypeScript

Strict mode. Prefer inference. Never `any` — use `unknown`. Interfaces for data shapes, classes only when behavior is needed.

## Testing

Vitest. Do not write tests unless explicitly asked.

## Subscriptions

**HTTP calls** auto-complete — no cleanup needed.

**Long-lived subscriptions** (`router.events`, `valueChanges`, `Subject`s) — use `takeUntilDestroyed()` from `@angular/core/rxjs-interop` in an injection context.