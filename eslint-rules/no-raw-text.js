// Fails on user-facing text written straight into an .astro template. Text must come from
// t() and src/i18n/<locale>.json (CLAUDE.md, ADR-0002). Expressions like {t("key")} are fine.

/** Attributes whose string value is read by people or assistive technology. */
const TEXT_ATTRIBUTES = new Set(["alt", "title", "aria-label", "placeholder"]);

/** Content of these elements is code, not copy. */
const CODE_ELEMENTS = new Set(["script", "style"]);

/** Text with no letter or digit ("·", "|", "—") is a separator, not copy. */
const HAS_WORDS = /[\p{L}\p{N}]/u;

function elementName(element) {
  const name = element.openingElement?.name;
  return name?.type === "JSXIdentifier" ? name.name : null;
}

function preview(text) {
  const flat = text.trim().replace(/\s+/g, " ");
  return flat.length > 40 ? `${flat.slice(0, 40)}…` : flat;
}

export const noRawText = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow raw user-facing text in .astro templates; use t().",
    },
    schema: [],
    messages: {
      text: 'Raw text "{{text}}" in a template. Add it to src/i18n/<locale>.json and use t().',
      attribute:
        'Raw text "{{text}}" in the {{name}} attribute. Add it to src/i18n/<locale>.json and use t().',
    },
  },
  create(context) {
    return {
      JSXText(node) {
        if (!HAS_WORDS.test(node.value)) return;
        for (let parent = node.parent; parent; parent = parent.parent) {
          if (
            parent.type === "JSXElement" &&
            CODE_ELEMENTS.has(elementName(parent))
          )
            return;
        }
        context.report({
          node,
          messageId: "text",
          data: { text: preview(node.value) },
        });
      },
      JSXAttribute(node) {
        if (
          node.name.type !== "JSXIdentifier" ||
          !TEXT_ATTRIBUTES.has(node.name.name)
        )
          return;
        // Only native elements (<img>, <a>, <input>). A component prop such as title="pages.x.title"
        // is typed (MessageKey), so TypeScript checks it instead.
        const element = node.parent?.name;
        if (element?.type !== "JSXIdentifier" || !/^[a-z]/.test(element.name))
          return;
        const value = node.value;
        if (value?.type !== "Literal" || typeof value.value !== "string")
          return;
        if (!HAS_WORDS.test(value.value)) return;
        context.report({
          node,
          messageId: "attribute",
          data: { name: node.name.name, text: preview(value.value) },
        });
      },
    };
  },
};
