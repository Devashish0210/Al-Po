import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { DocumentItemsTypes } from "./document";
import CustomSubCard from "./request-card2-subcard";

type CardProps = {
  header: string;
  items: DocumentItemsTypes[];
  buttonText: string;
};

export default function CardCustom({ header, items, buttonText }: CardProps) {
  // Define different styles for different headers
  const headerStyle = header === "Financial Documents" 
    ? "font-bold text-cyan-800 text-lg bg-gray-200 px-9 py-1" 
    : "font-bold text-cyan-800 text-lg bg-gray-200 px-8 py-1 pr-24";

  return (
    <Card className="flex-1 min-h-[22rem] bg-background-containerHigh shadow-none">
      <CardHeader className="flex justify-center items-center pr-12">
        <p className={headerStyle}>
          {header}
        </p>
      </CardHeader>
      <CardBody className="flex items-center justify-around">
        {items.map((value, index) => {
          return (
            <div key={index}>
              <CustomSubCard
                buttonText={buttonText}
                header={value.label}
                note={value.note}
                key={index + 2 * items.length}
              />
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}
