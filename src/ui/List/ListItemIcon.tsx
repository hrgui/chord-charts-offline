import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLProps<HTMLDivElement> {}

export const ListItemIcon = ({ className, ...props }: Props) => {
  return (
    <div
      className={twMerge("text-white inline-flex min-w-[56px] flex-shrink-0", className)}
      {...props}
    />
  );
};

export default ListItemIcon;
