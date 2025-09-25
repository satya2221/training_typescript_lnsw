# NestJS Circular Dependency Patterns Demo

This demo project demonstrates common circular dependency problems in NestJS applications and provides multiple solutions to resolve them.

## 🚨 Problem: Circular Dependencies

Circular dependencies occur when two or more modules depend on each other directly or indirectly, creating a cycle. This can cause:
- Runtime errors during dependency injection
- Difficulty in testing and mocking
- Reduced code maintainability
- Performance issues
- Build-time warnings or errors

## 📁 Project Structure

```
src/
├── users/              # 🚨 Problematic circular dependency examples
│   ├── users.service.ts
│   ├── users.controller.ts
│   └── users.module.ts
├── orders/             # 🚨 Problematic circular dependency examples
│   ├── orders.service.ts
│   ├── orders.controller.ts
│   └── orders.module.ts
├── notifications/      # Shared service (causes circular deps)
│   ├── notifications.service.ts
│   └── notifications.module.ts
├── solutions/          # ✅ Fixed implementations
│   ├── users-fixed.service.ts      # Solution 1: forwardRef
│   ├── orders-fixed.service.ts     # Solution 1: forwardRef
│   ├── fixed.module.ts             # Solution 1: forwardRef module
│   ├── user-repository.service.ts  # Solution 2: Clean architecture
│   ├── order-repository.service.ts # Solution 2: Clean architecture
│   ├── business-logic.service.ts   # Solution 2: Clean architecture
│   └── clean-architecture.module.ts # Solution 2: Clean architecture
├── scripts/            # Detection and analysis tools
│   ├── check-circular-deps.js      # Circular dependency detector
│   └── generate-dep-graph.js       # Dependency graph generator
├── app.module.ts               # 🚨 PROBLEMATIC main module
├── app-working.module.ts       # ✅ WORKING main module
├── app-problematic.module.ts   # 🚨 PROBLEMATIC demo module
├── main.ts                     # Default bootstrap (problematic)
├── main-working.ts            # ✅ Working bootstrap
├── main-problematic.ts        # 🚨 Problematic bootstrap
└── demo.controller.ts         # Working demo endpoints
```

## 🔍 Detection Tools

### 1. Circular Dependency Checker
```bash
npm run check:circular
```

This tool uses `madge` to analyze the codebase and detect circular dependencies:
- Identifies all circular dependency chains
- Provides solution recommendations
- Shows dependency statistics
- Can be integrated into CI/CD pipelines

### 2. Dependency Graph Generator
```bash
npm run analyze:deps
```

Generates:
- DOT file for visual dependency graphs
- Text-based dependency analysis report
- High-dependency file warnings
- Module overview statistics

## 🛠️ Solutions

### Solution 1: forwardRef()

Use NestJS `forwardRef()` to resolve circular dependencies in dependency injection:

```typescript
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {}
}
```

**Pros:**
- Quick fix for existing code
- Maintains current architecture
- Minimal code changes required

**Cons:**
- Doesn't address root architectural issues
- Can make code harder to understand
- May indicate design problems

### Solution 2: Clean Architecture with Repository Pattern

Restructure code to eliminate circular dependencies through proper layering:

```typescript
// Repository Layer (Data Access)
@Injectable()
export class UserRepositoryService {
  async findById(id: number): Promise<User | null> { ... }
}

// Business Logic Layer (Orchestration)
@Injectable()
export class BusinessLogicService {
  constructor(
    private readonly userRepository: UserRepositoryService,
    private readonly orderRepository: OrderRepositoryService,
  ) {}
}
```

**Pros:**
- Better separation of concerns
- Easier to test and mock
- More maintainable code
- Follows SOLID principles

**Cons:**
- Requires more code restructuring
- May need interface definitions
- Initial development overhead

### Solution 3: Event-Driven Architecture

Use events to decouple services:

```typescript
@Injectable()
export class UsersService {
  async createUser(userData: any): Promise<User> {
    const user = await this.userRepository.create(userData);

    // Emit event instead of direct dependency
    this.eventEmitter.emit('user.created', { user });

    return user;
  }
}
```

**Pros:**
- Complete decoupling
- Scalable and flexible
- Supports async operations

**Cons:**
- More complex debugging
- Event flow can be hard to trace
- Requires additional infrastructure

### Solution 4: Dependency Inversion

Use interfaces to invert dependencies:

```typescript
interface IUserService {
  getUser(id: number): Promise<User | null>;
}

@Injectable()
export class OrdersService {
  constructor(
    @Inject('USER_SERVICE')
    private readonly userService: IUserService,
  ) {}
}
```

## 🧪 Testing the Demo

### 1. Test Circular Dependency Detection
```bash
# Detect circular dependencies in the codebase
npm run check:circular

# Expected output: 5 circular dependency chains found
```

### 2. Test Problematic Version (Will Fail)
```bash
# Try to start the problematic version - this should fail
npm run start:problematic

# Or use the regular start (uses problematic app.module.ts)
npm run start:dev
```

### 3. Test Working Solution
```bash
# Start the working version (uses clean architecture)
npm run start:working

# Test endpoints (in a new terminal)
curl http://localhost:3000/demo/health
curl -X POST http://localhost:3000/demo/users -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com"}'
curl -X POST http://localhost:3000/demo/orders -H "Content-Type: application/json" -d '{"userId":1,"amount":99.99}'
```

### Quick Demo (Detection + Working Solution)
```bash
# Run complete demo: detect circular deps, then start working version
npm run demo
```

### 4. Analyze Dependencies
```bash
# Generate dependency analysis
npm run analyze:deps

# View generated reports
cat dependency-report.txt
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Check for circular dependencies
npm run check:circular

# Start development server
npm run start:dev

# Access the application
open http://localhost:3000/demo/health
```

## 📚 Best Practices

### 1. Prevention Strategies
- **Single Responsibility Principle**: Each module should have one reason to change
- **Dependency Inversion**: Depend on abstractions, not concretions
- **Interface Segregation**: Use specific interfaces instead of large ones
- **Composition over Inheritance**: Prefer composition to avoid tight coupling

### 2. Architecture Patterns
- **Layered Architecture**: Clear separation between data, business, and presentation layers
- **Repository Pattern**: Abstract data access logic
- **Service Layer Pattern**: Centralize business logic
- **Event-Driven Architecture**: Use events for loose coupling

### 3. Development Workflow
- **Early Detection**: Run circular dependency checks in CI/CD
- **Code Reviews**: Look for potential circular dependencies
- **Regular Refactoring**: Address architectural debt early
- **Documentation**: Document module dependencies and relationships

### 4. NestJS Specific Guidelines
- **Module Organization**: Group related functionality in modules
- **Provider Scope**: Use appropriate provider scopes
- **Custom Providers**: Use factory providers when needed
- **Global Modules**: Avoid overusing global modules

## 🔧 Configuration

### Pre-build Hook
The project includes a pre-build hook that automatically checks for circular dependencies:

```json
{
  "scripts": {
    "prebuild": "npm run check:circular"
  }
}
```

### ESLint Integration (Optional)
Add ESLint rules to detect circular dependencies:

```json
{
  "rules": {
    "import/no-cycle": "error"
  }
}
```

## 📊 Metrics and Monitoring

The detection tools provide valuable metrics:
- **Total modules analyzed**
- **Number of circular dependencies found**
- **Files with high dependency counts**
- **Dependency depth analysis**

## 🐛 Common Pitfalls

1. **Using forwardRef everywhere**: Overuse indicates architectural problems
2. **Ignoring circular dependencies**: Can cause runtime failures
3. **Tight coupling between services**: Makes testing difficult
4. **Missing abstractions**: Direct service-to-service dependencies
5. **Monolithic modules**: Large modules with too many responsibilities

## 📈 Performance Impact

Circular dependencies can affect performance:
- **Memory leaks**: Objects may not be garbage collected properly
- **Initialization delays**: Complex dependency resolution
- **Hot module replacement**: Development server issues
- **Tree shaking**: Bundle optimization problems

---

This demo project serves as a comprehensive guide for understanding, detecting, and resolving circular dependency issues in NestJS applications. Use the provided tools and patterns to maintain clean, maintainable codebases.