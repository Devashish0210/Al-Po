"use client";

import RequestDocument from "@/app/_api-helpers/request-documents";
import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { doc_type_map, documents, document_types } from "./document";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type CardProps = {
  header: string;
  buttonText: string;
  note: string | undefined;
};

export default function CardCustom({
  header,
  buttonText,
  note = "",
}: CardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [documentResponseText, setDocumentResponseText] =
    useState(document_types);
    const handleButtonClick = async () => {
      setLoading(true);
      const wait = async () => {
        const res = await RequestDocument(
          //@ts-ignore
          doc_type_map[header],
          employeeLoginState,
          dispatch,
          router
        );
        setLoading(false);
    
        if (res) {
          toast.success("Request is processed, details are sent at your email address.", {
            onClose: () => {
              setDocumentResponseText({
                ...documentResponseText,
                [header]: "Request is processed, details are sent at your email address."
              });
            }
          });
        } else {
          toast.error("There is some problem processing your request, please try again later", {
            onClose: () => {
              setDocumentResponseText({
                ...documentResponseText,
                [header]: "There is some problem processing your request, please try again later"
              });
            }
          });
        }
      };
      wait();
    };    
  return (
    <div style={{ maxHeight: "200px", overflow: "auto" }}>
      <Card className="w-[22rem] bg-background-containerHigh shadow-none">
        <CardBody className="flex flex-col">
          <Button
            className="w-[100%] bg-white flex items-center justify-start rounded-sm"
            style={{ textAlign: "left" }}
            onClick={handleButtonClick}
            isDisabled={loading}
          >
            {loading ? (
              <Spinner color="default" size="sm" />
            ) : (
              <p className="font-bold text-md text-blue-300">{header}</p>
            )}
          </Button>
          
          {note.length > 0 && (
            <p className="text-sm px-4">{note.length > 0 ? note : ""}</p>
          )}
          {/* {documentResponseText[header] !== "" && (
            <p
              className={
                documentResponseText[header] ===
                "There is some problem processing your request, please try again later"
                  ? "text-danger w-80 mt-2 pl-4 text-sm"
                  : "text-success w-80 mt-2 pl-4 text-sm"
              }
            >
              {documentResponseText[header]}
            </p>
          )} */}
        </CardBody>
      </Card>
    </div>
  );
}
