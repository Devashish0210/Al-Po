"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@nextui-org/react";
import { InitialState as Items } from "@/redux-toolkit/features/ndc";

export default function TableCustom({ items }: { items: Items }) {
  return (
    <Table isStriped aria-label="NDC TABLE">
      <TableHeader>
        <TableColumn className="text-cyan-800 font-bold">NDC Owner</TableColumn>
        <TableColumn className="text-cyan-800 font-bold">Status</TableColumn>
        <TableColumn className="text-cyan-800 font-bold">Comment</TableColumn>
      </TableHeader>
      <TableBody>
        {items["data"].map((val, index) => {
          return (
            <TableRow key={index}>
              <TableCell>
                <p>{val.name}</p>
              </TableCell>
              <TableCell>
                {items["isLoading"] ? (
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300 font-bold"></div>
                  </Skeleton>
                ) : (
                  <p>{val.status}</p>
                )}
              </TableCell>
              <TableCell>
                {items["isLoading"] ? (
                  <Skeleton className="w-2/5 rounded-lg">
                    <div className="h-3 w-2/5 rounded-lg bg-default-300 font-bold"></div>
                  </Skeleton>
                ) : (
                  <p>{val.comment}</p>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
