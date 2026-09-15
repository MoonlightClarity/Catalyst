const blockedFamily = /(?:AGPL|LGPL|GPL)(?:-|\b)/i;

function stripOuterParens(expression) {
  let value = expression.trim();
  while (value.startsWith("(") && value.endsWith(")")) {
    let depth = 0;
    let enclosesWholeExpression = true;
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "(") depth += 1;
      if (value[i] === ")") depth -= 1;
      if (depth === 0 && i < value.length - 1) {
        enclosesWholeExpression = false;
        break;
      }
    }
    if (!enclosesWholeExpression) break;
    value = value.slice(1, -1).trim();
  }
  return value;
}

function splitTopLevel(expression, operator) {
  const needle = ` ${operator} `;
  const upper = expression.toUpperCase();
  const parts = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < expression.length; i += 1) {
    if (expression[i] === "(") depth += 1;
    if (expression[i] === ")") depth -= 1;
    if (depth !== 0 || !upper.startsWith(needle, i)) continue;
    parts.push(expression.slice(start, i));
    start = i + needle.length;
    i = start - 1;
  }

  if (!parts.length) return null;
  parts.push(expression.slice(start));
  return parts;
}

export function requiresBlockedFamily(expression) {
  const value = stripOuterParens(String(expression ?? ""));
  const alternatives = splitTopLevel(value, "OR");
  if (alternatives) {
    return alternatives.every((part) => requiresBlockedFamily(part));
  }

  const requirements = splitTopLevel(value, "AND");
  if (requirements) {
    return requirements.some((part) => requiresBlockedFamily(part));
  }

  return blockedFamily.test(value);
}
