import { ComponentProps } from "react";

type PageProps = ComponentProps<'div'> &{
  children: React.ReactNode;
}

export default function Page({
  children
}: PageProps) {
  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      {children}
    </main>
  );
}
