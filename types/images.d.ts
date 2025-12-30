declare module "*.svg" {
  import { FC, SVGProps } from "react";

  const content: FC<SVGProps<SVGSVGElement>>;
  export default content;

  // Support for named ReactComponent export (CRA style)
  export const ReactComponent: FC<SVGProps<SVGSVGElement>>;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.webp" {
  const content: string;
  export default content;
}

declare module "*.jfif" {
  const content: string;
  export default content;
}
