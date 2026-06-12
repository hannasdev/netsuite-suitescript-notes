"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { Linter, RuleTester } = require("eslint");
const rule = require("../src/rules/no-2-1-syntax-in-2-0");

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: "script"
  }
});

const header20 = `
  /**
   * @NApiVersion 2.0
   * @NScriptType UserEventScript
   */
`;

const header2x = `
  /**
   * @NApiVersion 2.x
   * @NScriptType UserEventScript
   */
`;

const header21 = `
  /**
   * @NApiVersion 2.1
   * @NScriptType UserEventScript
   */
`;

function expected(apiVersion, syntax) {
  return {
    messageId: "syntaxNotSupported",
    data: { apiVersion, syntax }
  };
}

ruleTester.run("no-2-1-syntax-in-2-0", rule, {
  valid: [
    {
      name: "allows modern syntax in explicit 2.1 scripts",
      code: `
        ${header21}
        define([], () => {
          class Handler {}
          const values = [1, 2, 3];
          return {
            beforeLoad: () => values?.[0] ?? new Handler()
          };
        });
      `
    },
    {
      name: "allows es5-style syntax in 2.0 scripts",
      code: `
        ${header20}
        define([], function () {
          var values = [1, 2, 3];
          return {
            beforeLoad: function () {
              return values[0] || null;
            }
          };
        });
      `
    },
    {
      name: "does not report files without restricted SuiteScript api version",
      code: `
        define([], function () {
          var value = optionalSource?.value ?? "fallback";
          return { beforeLoad: function () { return value; } };
        });
      `
    }
  ],
  invalid: [
    {
      name: "reports arrow functions in 2.0 scripts",
      code: `
        ${header20}
        define([], () => ({}));
      `,
      errors: [expected("2.0", "arrow function")]
    },
    {
      name: "reports class declarations in 2.0 scripts",
      code: `
        ${header20}
        class Handler {}
      `,
      errors: [expected("2.0", "class declaration")]
    },
    {
      name: "reports class expressions in 2.0 scripts",
      code: `
        ${header20}
        var Handler = class {};
      `,
      errors: [expected("2.0", "class expression")]
    },
    {
      name: "reports template literals in 2.0 scripts",
      code: `
        ${header20}
        var message = \`created\`;
      `,
      errors: [expected("2.0", "template literal")]
    },
    {
      name: "reports array spread in 2.0 scripts",
      code: `
        ${header20}
        var values = [1].concat([...otherValues]);
      `,
      errors: [expected("2.0", "spread syntax")]
    },
    {
      name: "reports object spread in 2.0 scripts",
      code: `
        ${header20}
        var copy = { ...source };
      `,
      errors: [expected("2.0", "spread syntax")]
    },
    {
      name: "reports rest parameters in 2.0 scripts",
      code: `
        ${header20}
        function collect(...values) {
          return values;
        }
      `,
      errors: [expected("2.0", "rest syntax")]
    },
    {
      name: "reports async functions in 2.0 scripts",
      code: `
        ${header20}
        async function execute() {
          return true;
        }
      `,
      errors: [expected("2.0", "async function")]
    },
    {
      name: "reports await expressions in 2.0 scripts",
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
      },
      code: `
        ${header20}
        await run();
      `,
      errors: [expected("2.0", "await expression")]
    },
    {
      name: "reports import declarations in 2.0 scripts",
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
      },
      code: `
        ${header20}
        import record from "N/record";
        record.load({});
      `,
      errors: [expected("2.0", "import declaration")]
    },
    {
      name: "reports named export declarations in 2.0 scripts",
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
      },
      code: `
        ${header20}
        var value = 1;
        export { value };
      `,
      errors: [expected("2.0", "export declaration")]
    },
    {
      name: "reports default export declarations in 2.0 scripts",
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
      },
      code: `
        ${header20}
        export default function execute() {}
      `,
      errors: [expected("2.0", "default export")]
    },
    {
      name: "reports export all declarations in 2.0 scripts",
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module"
      },
      code: `
        ${header20}
        export * from "./shared.js";
      `,
      errors: [expected("2.0", "export all declaration")]
    },
    {
      name: "reports optional chaining in 2.0 scripts",
      code: `
        ${header20}
        var value = source?.value;
      `,
      errors: [expected("2.0", "optional chaining")]
    },
    {
      name: "reports nullish coalescing in 2.0 scripts",
      code: `
        ${header20}
        var value = source.value ?? "fallback";
      `,
      errors: [expected("2.0", "nullish coalescing")]
    },
    {
      name: "reports for-of statements in 2.0 scripts",
      code: `
        ${header20}
        for (value of values) {
          log.debug({ title: "value", details: value });
        }
      `,
      errors: [expected("2.0", "for...of statement")]
    },
    {
      name: "reports let declarations in 2.0 scripts",
      code: `
        ${header20}
        let value = 1;
      `,
      errors: [expected("2.0", "let declaration")]
    },
    {
      name: "reports const declarations in 2.0 scripts",
      code: `
        ${header20}
        const value = 1;
      `,
      errors: [expected("2.0", "const declaration")]
    },
    {
      name: "reports destructuring declarations in 2.x scripts",
      code: `
        ${header2x}
        var { value } = source;
      `,
      errors: [expected("2.x", "object destructuring")]
    },
    {
      name: "reports destructuring parameters in 2.0 scripts",
      code: `
        ${header20}
        function execute([value]) {
          return value;
        }
      `,
      errors: [expected("2.0", "array destructuring")]
    },
    {
      name: "reports destructuring assignments in 2.0 scripts",
      code: `
        ${header20}
        ({ value } = source);
      `,
      errors: [expected("2.0", "object destructuring")]
    }
  ]
});

test("older parser settings can report parser errors before the syntax rule runs", () => {
  const linter = new Linter();
  const messages = linter.verify(
    `
      /**
       * @NApiVersion 2.0
       * @NScriptType UserEventScript
       */
      const value = source?.value;
    `,
    {
      languageOptions: {
        ecmaVersion: 5,
        sourceType: "script"
      },
      plugins: {
        "suitescript-compat": {
          rules: {
            "no-2-1-syntax-in-2-0": rule
          }
        }
      },
      rules: {
        "suitescript-compat/no-2-1-syntax-in-2-0": "error"
      }
    }
  );

  assert.equal(messages.length, 1);
  assert.equal(messages[0].fatal, true);
  assert.match(messages[0].message, /Parsing error/);
});
