import React from "react";
import Triangle from "./triangle";
import Link from "next/link";
import NameComponent from "./name-component";

type Data = {
  title: string;
  href: string;
}[];

type Style = {
  container: React.CSSProperties | undefined;
};

export default function LinkTabs({
  data,
  style,
  selected,
}: {
  data: Data;
  style: Style;
  selected: number;
}) {
  return (
    <div className="flex w-full justify-evenly items-end">
      {data.map((value, index) => {
        return index === selected ? (
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="h-8 w-full p-4">{index === 0}</div>
            <Link href={value.href} className="text-white" key={index}>
              <div>
                <div className="bg-primary p-2 w-[20rem] m-4 mb-0">
                  <h1>{value.title}</h1>
                </div>
                <div className="ml-8">
                  <Triangle />
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="h-8 w-[20rem] p-4">
              {index === 0 && <NameComponent />}
            </div>
            <Link href={value.href} className="text-white" key={index}>
              <div className="bg-secondary p-2 w-[20rem] m-4">
                <h1>{value.title}</h1>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
