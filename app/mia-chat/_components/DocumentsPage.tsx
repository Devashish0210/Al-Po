import DocumentsTab from "./DocumentsTab";
import RequestForm from "./RequestForm";
import { Tabs, Tab } from "@nextui-org/react";

const DocumentsPage = () => {
  const variants = ["solid", "underlined", "bordered", "light"];
  return (
    <>
      <section className="mb-10">
        <div
          style={{
            margin: "auto",
            display: "flex",
            width: "85%",
            alignContent: "center",
            marginTop: "2vh",
          }}
        >
          {/* <Tabs>
            <Tab key="photos" title="Self Service" />
          </Tabs> */}
          {/* @ts-ignore */}
          <DocumentsTab>
            <RequestForm />
          </DocumentsTab>
        </div>
      </section>
    </>
  );
};
export default DocumentsPage;
