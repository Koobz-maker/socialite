import { j as jsxRuntimeExports, i as cn, a7 as Principal, a8 as JSON_KEY_PRINCIPAL, a9 as base32Decode, aa as base32Encode, ab as getCrc32 } from "./index-Dq5HxgdE.js";
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  Skeleton as S,
  index as i
};
