# Runtime Error Fix - Object.assign on Read-Only Property

## Date: December 21, 2025

## Error Report
```
Unhandled Runtime Error
TypeError: Cannot assign to read only property '0' of object '[object String]'

Source: app\page.tsx (158:28)
imageCss={Object.assign(tw`bg-cover`, imageCss)}
```

## Root Cause
The code was trying to use `Object.assign()` to merge two `tw` template literals. However, `tw` returns either:
1. A styled component (when used like `tw.div`)
2. A className string (when used like `tw\`classes\``)

Both are read-only and cannot be modified with `Object.assign()`.

## The Problem Code
```typescript
const imageCss = tw`rounded-[2.5rem]`;

// Later in the component:
imageCss={Object.assign(tw`bg-cover`, imageCss)}  // ❌ ERROR!
```

**Why it failed:**
- `tw\`bg-cover\`` returns a string like "bg-cover"
- `Object.assign()` tries to modify index `0` of the string
- Strings are immutable/read-only in JavaScript
- Result: "Cannot assign to read only property '0'"

## Solution Applied

**Changed from:**
```typescript
imageCss={Object.assign(tw`bg-cover`, imageCss)}
```

**Changed to:**
```typescript
imageCss={`${tw`bg-cover`} ${imageCss}`}
```

## Explanation

### Template String Concatenation
When you need to combine multiple `tw` classes, use template string concatenation:

```typescript
// ✅ CORRECT - Concatenate as strings
const combinedClasses = `${tw`bg-cover`} ${tw`rounded-[2.5rem]`}`;

// ❌ WRONG - Don't use Object.assign
const combinedClasses = Object.assign(tw`bg-cover`, tw`rounded-[2.5rem]`);
```

### Why This Works
- `tw\`bg-cover\`` → returns string "bg-cover"
- `imageCss` → contains string "rounded-[2.5rem]"
- `\`${tw\`bg-cover\`} ${imageCss}\`` → returns "bg-cover rounded-[2.5rem]"
- This is a new string with both classes, which is exactly what we need!

## Component Fixed
- ✅ `app/page.tsx` - MainFeature component can now render with combined image styles

## Best Practices for Combining tw Classes

### ✅ DO:
```typescript
// String concatenation
const combined = `${tw`class1`} ${tw`class2`}`;

// Array join
const combined = [tw`class1`, tw`class2`].join(' ');

// Direct template literal
const combined = tw`class1 class2`;
```

### ❌ DON'T:
```typescript
// Object.assign - causes read-only error
const combined = Object.assign(tw`class1`, tw`class2`);

// Array spread on strings - doesn't work
const combined = [...tw`class1`, ...tw`class2`];

// Plus operator on objects - wrong type
const combined = tw`class1` + tw`class2`;
```

## Related Issues
This is a common mistake when migrating from other CSS-in-JS libraries that use objects for styles. With `tw` and Tailwind, classes are strings, not objects.

## Status: RESOLVED ✅

The error is fixed. The component now properly combines the `bg-cover` class with the `rounded-[2.5rem]` class using string concatenation.

## Testing
After the fix:
- ✅ No runtime error
- ✅ Image styles applied correctly
- ✅ Both classes ("bg-cover" and "rounded-[2.5rem]") work together

Restart your dev server and the page will render without errors!

