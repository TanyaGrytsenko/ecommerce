import { forwardRef } from "react";
import type { SVGProps } from "react";

export interface LucideProps extends SVGProps<SVGSVGElement> {
  color?: string;
  size?: string | number;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}

type IconNode = readonly [
  elementName: keyof JSX.IntrinsicElements,
  attributes: Record<string, unknown>
][];

function createLucideIcon(name: string, iconNode: IconNode) {
  const Icon = forwardRef<SVGSVGElement, LucideProps>(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth = false,
        children,
        ...props
      },
      ref
    ) => {
      const computedStrokeWidth = absoluteStrokeWidth
        ? (24 / Number(size)) * strokeWidth
        : strokeWidth;

      return (
        <svg
          ref={ref}
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth={computedStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          {...props}
        >
          {iconNode.map(([tag, attrs], index) => {
            const Element = tag as keyof JSX.IntrinsicElements;
            return <Element key={`${name}-${index}`} {...attrs} />;
          })}
          {children}
        </svg>
      );
    }
  );

  Icon.displayName = name;

  return Icon;
}

export { createLucideIcon };

export const Check = createLucideIcon("Check", [["path", { d: "m20 6-11 11-5-5" }]]);

export const Heart = createLucideIcon("Heart", [
  [
    "path",
    {
      d: "M19 14c1.5-1.46 2.5-3.12 2.5-5A5.5 5.5 0 0 0 12 3a5.5 5.5 0 0 0-9.5 6c0 1.88 1 3.54 2.5 5L12 21Z",
    },
  ],
]);

export const ShoppingBag = createLucideIcon("ShoppingBag", [
  ["path", { d: "M6 2v4" }],
  ["path", { d: "M18 2v4" }],
  ["path", { d: "M3 6h18l-1 14H4L3 6Z" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0" }],
]);

export const Star = createLucideIcon("Star", [
  [
    "polygon",
    {
      points: "12 2 13.09 8.26 19 8.27 14 12.14 15.82 18 12 14.77 8.18 18 10 12.14 5 8.27 10.91 8.26 12 2",
    },
  ],
]);

export const ChevronDown = createLucideIcon("ChevronDown", [["path", { d: "M6 9l6 6 6-6" }]]);

export const ImageOff = createLucideIcon("ImageOff", [
  ["path", { d: "M2 2l20 20" }],
  ["path", { d: "M21 16V5a2 2 0 0 0-2-2H7" }],
  ["path", { d: "M3 7v12a2 2 0 0 0 2 2h12" }],
  ["path", { d: "m9.5 13.5 2.5-2.5 3 3" }],
  ["path", { d: "m2 16 5-5 3 3" }],
]);

export const Tag = createLucideIcon("Tag", [
  [
    "path",
    {
      d: "M21 10V3h-7L3 14l7 7 11-11Z",
    },
  ],
  ["path", { d: "M7.5 7.5h.01" }],
]);
