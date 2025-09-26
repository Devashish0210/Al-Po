import { ToastContainer } from "react-toastify";
import { documents } from "./document";
import CardCustom from "./request-card2";

export default function RequestForm() {
  const cards: React.ReactNode[] = [];
  Object.keys(documents).forEach((key, index) => {
    cards.push(
      <div key={index}>
        <CardCustom
          buttonText="Request"
          header={key}
          key={index + 2 * 100}
          items={documents[key]}
        />
      </div>
    );
  });
  return (
    <div className="flex flex-col justify-center items-center object-contain" >
      <p className="font-bold text-left mr-28 pr-20">Please choose one of the document options below to be sent to your email address</p>
      <div className="flex flex-wrap m-4 gap-16 w-full justify-around items-center">
        {cards}
        <ToastContainer/>
      </div>
    </div>
  );
}
