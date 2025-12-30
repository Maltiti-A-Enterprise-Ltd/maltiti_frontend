import "twin.macro";
import styledImport, { CSSProp, css as cssImport } from "styled-components";

declare module "twin.macro" {
  const styled: typeof styledImport;
  const css: typeof cssImport;
}

declare module "react" {
  interface DOMAttributes<T> {
    css?: CSSProp;
    tw?: string;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: CSSProp;
      tw?: string;
    }
  }
}
