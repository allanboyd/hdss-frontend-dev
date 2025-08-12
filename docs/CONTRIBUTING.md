# Contributing to A-SEARCH

Thank you for your interest in contributing to A-SEARCH! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- **Respectful Communication**: Use welcoming and inclusive language
- **Collaborative Development**: Focus on what is best for the community
- **Professional Behavior**: Show empathy towards other community members
- **Constructive Feedback**: Provide helpful and constructive feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account (for database access)

### Setup Development Environment

1. **Fork the repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/your-username/a-search-app.git
   cd a-search-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use the following format for branch names:

```
<type>/<description>
```

**Types:**

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation updates
- `test/` - Test additions/updates

**Examples:**

- `feature/user-management`
- `bugfix/login-validation`
- `docs/api-documentation`

### Commit Message Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(auth): add multi-factor authentication
fix(api): resolve user creation validation error
docs(readme): update installation instructions
```

### Development Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**

   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat(component): add new user management feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Provide clear description of changes
   - Link related issues

## 📝 Coding Standards

### TypeScript Guidelines

- Use strict TypeScript configuration
- Define proper interfaces for all data structures
- Avoid `any` type - use `unknown` or specific types
- Use type guards for runtime type checking

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name: string;
}

function validateUser(user: unknown): user is User {
  return (
    typeof user === 'object' &&
    user !== null &&
    'id' in user &&
    'email' in user &&
    'name' in user
  );
}

// ❌ Avoid
function processUser(user: any) {
  return user.name;
}
```

### React Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (WCAG 2.1)
- Use proper TypeScript for props

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  const handleEdit = useCallback(() => {
    onEdit?.(user);
  }, [user, onEdit]);

  return (
    <div role="article" aria-label={`User card for ${user.name}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <button onClick={handleEdit} aria-label="Edit user">
          Edit
        </button>
      )}
    </div>
  );
}
```

### Database Guidelines

- Use Row Level Security (RLS) policies
- Implement proper data validation
- Follow naming conventions
- Document schema changes

```sql
-- ✅ Good: Proper RLS policy
CREATE POLICY "Users can view their own profile" ON user_profile
  FOR SELECT USING (auth.uid() = auth_user_id);

-- ✅ Good: Proper naming convention
CREATE TABLE user_profile (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Error Handling

- Use proper error boundaries
- Implement meaningful error messages
- Log errors appropriately
- Provide user-friendly error messages

```typescript
// ✅ Good: Proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  const errorMessage =
    error instanceof Error ? error.message : 'An unexpected error occurred';

  console.error('API call failed:', error);
  toast.error(errorMessage);
  throw new Error(errorMessage);
}
```

## 🧪 Testing Guidelines

### Test Structure

- Unit tests for utility functions
- Component tests for React components
- Integration tests for API endpoints
- E2E tests for critical user flows

### Writing Tests

```typescript
// ✅ Good: Comprehensive test
describe('UserCard', () => {
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByLabelText('Edit user'));

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('does not render edit button when onEdit is not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByLabelText('Edit user')).not.toBeInTheDocument();
  });
});
```

### Test Coverage

- Aim for at least 80% code coverage
- Focus on critical business logic
- Test error scenarios
- Test accessibility features

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Include usage examples for reusable components

```typescript
/**
 * Validates user input data
 * @param data - The user data to validate
 * @returns Validation result with errors if any
 */
export function validateUserData(data: unknown): ValidationResult {
  // Implementation
}
```

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error responses
- Keep documentation up to date

### README Updates

- Update README for new features
- Include setup instructions for new dependencies
- Document breaking changes
- Keep examples current

## 🔄 Pull Request Process

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows style guidelines
- [ ] Tests pass and coverage is adequate
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Accessibility guidelines are followed
- [ ] Security considerations are addressed

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors

## Screenshots (if applicable)

Add screenshots for UI changes
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Linting and type checking
   - Security scanning

2. **Code Review**
   - At least one approval required
   - Address all review comments
   - Update PR based on feedback

3. **Merge**
   - Squash commits for clean history
   - Delete feature branch after merge
   - Update release notes

## 🚀 Release Process

### Versioning

Follow [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Changelog is updated
- [ ] Version is bumped
- [ ] Release notes are prepared
- [ ] Deployment is tested

### Release Notes

Include:

- New features
- Bug fixes
- Breaking changes
- Migration guide (if needed)
- Contributors

## 🆘 Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Documentation**: Check existing docs first
- **Code Review**: Ask questions in PR comments

## 🙏 Recognition

Contributors will be recognized in:

- Release notes
- Contributors section in README
- Project documentation

Thank you for contributing to A-SEARCH! 🌍
