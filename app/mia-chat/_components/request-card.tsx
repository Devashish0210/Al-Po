import React, { MouseEventHandler, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";

type CardProps = { header: string, body: string, onButtonClick: any, buttonText: string, note: string }

export default function CardCustom({ header, body, onButtonClick, buttonText, note = "" }: CardProps) {
    const [loading, setLoading] = useState<boolean>(false)
    // useEffect(() => {
    //     const callOnButtonClick = async () => {
    //         await onButtonClick(header)
    //         // setLoading(false)
    //         console.log("test")
    //     }
    //     if (loading) {
    //         callOnButtonClick()
    //     }
    // }, [loading])
    const handleButtonClick = (e: any) => {
        setLoading(true)
        onButtonClick(header, setLoading)
    }
    return (
        <Card className="w-80 h-60 bg-background-containerHigh shadow-none">
            <CardHeader className="flex gap-3 justify-center items-center">
                <p className="font-bold text-xl">{header}</p>
            </CardHeader>
            <CardBody className="flex items-center justify-center">
                <p  className="font-semibold text-lg mx-2">{body}</p>
                <p className="text-[0.6rem] mt-2 text-danger font-bold">{note.length > 0 ? "Note: " + note : ""}</p>
            </CardBody>
            <CardFooter className="flex items-center justify-center">
                <Button onClick={handleButtonClick} color="primary" isDisabled={loading}>
                    {loading ? <Spinner color="default" size="sm" /> : buttonText}
                </Button>
            </CardFooter>
        </Card>
    );
}
