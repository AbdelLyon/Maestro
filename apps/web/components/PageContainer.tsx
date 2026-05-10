import React from "react";
import { Heading } from "@maestro/ui";

type PageContainerProps = {
  title?: string;
  children: React.ReactNode;
  classNames?: {
    base?: string;
    title?: string;
    subtitle?: string;
  };
};

export const PageContainer = ({
  title,
  children,
  classNames,
}: PageContainerProps) => {
  return (
    <main className={classNames?.base}>
      {title && (
        <Heading
          title={title}
          classNames={{
            title: classNames?.title,
            subtitle: classNames?.subtitle,
          }}
        />
      )}

      {children}
    </main>
  );
};
