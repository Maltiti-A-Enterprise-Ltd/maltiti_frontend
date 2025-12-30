/**
 * Twin.macro replacement for Next.js
 * Maps tw template literals to Tailwind className strings
 */

import styled, { StyledComponent } from "styled-components";

type TwFunction = {
  <T extends keyof JSX.IntrinsicElements>(
    tag: T,
  ): (
    strings: TemplateStringsArray,
    ...values: any[]
  ) => StyledComponent<T, any>;
  (strings: TemplateStringsArray, ...values: any[]): string;
} & {
  [K in keyof JSX.IntrinsicElements]: (
    strings: TemplateStringsArray,
    ...values: any[]
  ) => StyledComponent<K, any>;
};

const createTw = (): TwFunction => {
  const tw: any = (stringsOrTag: any, ...values: any[]) => {
    // If called as tw`classes` return className string
    if (Array.isArray(stringsOrTag) && "raw" in stringsOrTag) {
      return String.raw({ raw: stringsOrTag as any }, ...values);
    }
    // If called as tw.div`classes` or tw('div')`classes` return styled component
    return (strings: TemplateStringsArray, ...vals: any[]) => {
      const className = String.raw({ raw: strings }, ...vals);
      // Check if stringsOrTag is a valid HTML element
      if (typeof stringsOrTag === "string" && stringsOrTag in styled) {
        const styledElement = (styled as any)[stringsOrTag];
        if (styledElement && typeof styledElement.attrs === "function") {
          return styledElement.attrs({ className })`` as any;
        }
      }
      // Fallback: create a div with the className
      return styled.div.attrs({ className })`` as any;
    };
  };

  // Add all HTML element shortcuts
  const elements = [
    "div",
    "span",
    "p",
    "a",
    "button",
    "input",
    "label",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "nav",
    "header",
    "footer",
    "section",
    "article",
    "main",
    "aside",
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    "img",
    "form",
    "select",
    "textarea",
    "table",
    "thead",
    "tbody",
    "tr",
    "td",
    "th",
    "video",
    "audio",
    "canvas",
    "blockquote",
    "code",
    "pre",
    "em",
    "strong",
    "i",
    "b",
    "small",
    "mark",
    "del",
    "ins",
    "sub",
    "sup",
  ];

  elements.forEach((element) => {
    tw[element] = (strings: TemplateStringsArray, ...vals: any[]) => {
      const className = String.raw({ raw: strings }, ...vals);
      const styledElement = (styled as any)[element];
      if (styledElement && typeof styledElement.attrs === "function") {
        return styledElement.attrs({ className })`` as any;
      }
      // Fallback for safety
      return styled.div.attrs({ className })`` as any;
    };
  });

  return tw;
};

const tw = createTw();
export default tw;
