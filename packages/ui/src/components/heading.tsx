import { cn } from "../lib/utils";

type HeadingProps = {
  title: string;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center" | "right";
  classNames?: {
    container?: string;
    title?: string;
    subtitle?: string;
  };
};

export const Heading = ({
  title,
  subtitle,
  as = "h1",
  align = "left",
  classNames,
}: HeadingProps) => {
  const Tag = as;

  return (
    <div
      className={cn(
        "space-y-2 mb-3",
        align === "center" && "text-center",
        align === "right" && "text-right",
        classNames?.container,
      )}
    >
      <Tag
        className={cn(
          "font-semibold tracking-tight text-slate-900 leading-snug",
          as === "h1" && "text-2xl sm:text-3xl",
          as === "h2" && "text-xl sm:text-2xl",
          as === "h3" && "text-lg sm:text-xl",
          "break-words",
          classNames?.title,
        )}
      >
        {title}
      </Tag>

      {subtitle && (
        <p
          className={cn(
            "text-slate-500 leading-relaxed",
            "text-sm sm:text-base",
            align === "center" && "mx-auto max-w-lg",
            align === "left" && "max-w-xl",
            classNames?.subtitle,
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
