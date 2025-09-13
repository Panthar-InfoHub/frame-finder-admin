import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

const SectionHeader = ({
  title,
  link,
  btnText="Add New",
  titleClassName,
  btnClassName,
  className,
}: {
  title: string;
  link: string;
  btnText?: string;
  titleClassName?: string;
  btnClassName?: string;
  className?: string;
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h1 className={`text-2xl font-bold capitalize ${titleClassName}`}>{title}</h1>
      <Button asChild className={btnClassName}>
        <Link href={link}>{btnText}</Link>
      </Button>
    </div>
  );
};

export default SectionHeader;
