import securityPlugin from "eslint-plugin-security";
import unicornPlugin from "eslint-plugin-unicorn";
import sonarjsPlugin from "eslint-plugin-sonarjs";

export default [
    {
        plugins: {
            security: securityPlugin,
            unicorn: unicornPlugin,
            sonarjs: sonarjsPlugin,
        },
        rules: {
            semi: "warn", // Warn for missing semicolons
            "prefer-const": "error", // Enforce the use of const for variables
            "no-loop-func": "error", // Prevent function declarations inside loops
            "no-new-func": "error", // Disallow Function constructor (performance risk)
            "prefer-rest-params": "error", // Prefer rest parameters over arguments object
            "no-implicit-globals": "warn", // Disallow global variable and function declarations
            "sonarjs/no-duplicate-string": "warn", // Avoid repeated string literals
            "sonarjs/no-identical-functions": "error", // Prevent identical functions
            "sonarjs/cognitive-complexity": ["warn", 15], // Warn for high cognitive complexity
        }
    }
];
