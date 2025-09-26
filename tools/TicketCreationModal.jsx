"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { setState } from "@/redux-toolkit/features/create-ticket";
import createTickets from "@/app/tickets/_api-helpers/create-ticket";
import getSMC from "@/app/tickets/_api-helpers/smc-cat";
import DropdownCustom from "@/app/tickets/_components/Dropdown";
import MyDropzone from "@/app/tickets/_components/CustomDropzone";
import LoadingButton from "@/app/tickets/_components/LoadingButton";

export const TicketCreationModal = ({
  isOpen,
  onClose,
  onSubmit,
  employeeId,
  isSubmitting,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Form state
  const [selectedKeys, setSelectedKeys] = useState(
    new Set(["-- Please Select --"])
  );
  const [files, setFiles] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("+91");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createTicketLoading, setCreateTicketLoading] = useState(false);
  const [createTicketMessage, setCreateTicketMessage] = useState(2);
  const [modalMessage, setModalMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Redux selectors
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const ticketData = useAppSelector((state) => state.ticketCreate);
  const formLoading = useAppSelector((state) => state.ticketCreate.isLoading);

  const title = "Alumni Services Ticket";

  let selectedCategory = "";
  selectedKeys.forEach((element) => {
    selectedCategory = element;
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getSMC(employeeLoginState, dispatch, router);
      dispatch(setState({ isLoading: false, data: res }));
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen, employeeLoginState, dispatch, router]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setSelectedKeys(new Set(["-- Please Select --"]));
    setPhoneNumber("+91");
    setDescription("");
    setFiles([]);
    setErrorMessage("");
    setCreateTicketMessage(2);
  };

  const getBase64 = async (file) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setCreateTicketLoading(true);
    setErrorMessage("");

    try {
      let category;
      selectedKeys.forEach((element) => {
        category = element;
      });

      // Validation
      if (title.length < 3) {
        setCreateTicketMessage(1);
        setErrorMessage("Title should be at least 3 characters long.");
        setCreateTicketLoading(false);
        return;
      }

      if (category === "-- Please Select --") {
        setCreateTicketMessage(1);
        setErrorMessage("Please select a category");
        setCreateTicketLoading(false);
        return;
      }

      if (phoneNumber.length !== 13) {
        setCreateTicketMessage(1);
        setErrorMessage("Please enter a valid 10-digit phone number.");
        setCreateTicketLoading(false);
        return;
      }

      if (
        category &&
        ticketData.data[category] &&
        ticketData.data[category]["attachment_mandatory"] !== "False" &&
        files.length < 1
      ) {
        setCreateTicketMessage(1);
        setErrorMessage("Please add the attachment as it is mandatory");
        setCreateTicketLoading(false);
        return;
      }

      // Prepare ticket data
      let dataCreateTicket;
      if (files.length > 0) {
        const attachment = (await getBase64(files[0])).split("base64,")[1];
        dataCreateTicket = {
          attachment_filename: files[0].name,
          attachment: attachment,
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
          mobile: phoneNumber,
        };
      } else {
        dataCreateTicket = {
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
          mobile: phoneNumber,
        };
      }

      console.log("Creating ticket:", dataCreateTicket);

      const result = await createTickets(
        dataCreateTicket,
        employeeLoginState,
        dispatch,
        router
      );

      if (result) {
        setCreateTicketMessage(0);
        setModalMessage("Ticket created successfully");
        setShowSuccessModal(true);

        // Reset form after successful submission
        setTimeout(() => {
          resetForm();
          setShowSuccessModal(false);
          onClose();
        }, 3000);
      } else {
        setCreateTicketMessage(1);
        setModalMessage("Ticket creation failed");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      setCreateTicketMessage(1);
      setErrorMessage("An error occurred while creating the ticket");
    } finally {
      setCreateTicketLoading(false);
    }
  };

  if (formLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalBody className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center gap-4">
              <Spinner size="lg" />
              <p className="text-lg">Loading Alumni Services...</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <>
      {/* Main Ticket Creation Modal */}
      <Modal
        isOpen={isOpen && !showSuccessModal}
        onClose={onClose}
        size="3xl"
        scrollBehavior="inside"
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        hideCloseButton={false}
        classNames={{
          base: "max-h-[90vh]",
          body: "py-4",
          header: "pb-2",
          footer: "pt-2",
        }}
      >
        <ModalContent className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <ModalHeader className="flex flex-col gap-1 px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Create Support Ticket
              </h3>
              <p className="text-sm text-gray-500">Alumni Services Ticket</p>
            </ModalHeader>

            <ModalBody className="gap-6 px-6 py-4 flex-1 overflow-y-auto">
              {/* Ticket Category */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-gray-700">
                  Ticket Category *
                </label>
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownCustom
                    selectedKeys={selectedKeys}
                    setSelectedKeys={setSelectedKeys}
                    options={Object.keys(ticketData.data || {})}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-gray-700">
                  Mobile Number *
                </label>
                <div className="flex items-stretch">
                  <span className="bg-gray-200 px-3 py-2 rounded-l-lg text-sm border border-r-0 border-gray-300 flex items-center">
                    +91
                  </span>
                  <Input
                    required
                    value={phoneNumber.slice(3)}
                    onChange={(e) => setPhoneNumber("+91" + e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    size="sm"
                    className="flex-1"
                    classNames={{
                      input: "rounded-l-none",
                      inputWrapper: "rounded-l-none border-l-0 h-10",
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-gray-700">
                  Description *
                </label>
                <Textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description of your request"
                  minRows={4}
                  size="sm"
                  classNames={{
                    input: "min-h-[100px]",
                  }}
                />
              </div>

              {/* Additional Instructions */}
              {selectedCategory !== "-- Please Select --" &&
                selectedCategory !== "" &&
                ticketData.data &&
                ticketData.data[selectedCategory] &&
                ticketData.data[selectedCategory]["attachment_message"] && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm">
                      <span className="font-bold text-blue-800">
                        Additional Instructions:{" "}
                      </span>
                      <span className="text-blue-700">
                        {
                          ticketData.data[selectedCategory][
                            "attachment_message"
                          ]
                        }
                      </span>
                    </p>
                  </div>
                )}

              {/* Attachment */}
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm text-gray-700">
                  Attachment
                  {selectedCategory !== "-- Please Select --" &&
                    ticketData.data &&
                    ticketData.data[selectedCategory] &&
                    ticketData.data[selectedCategory][
                      "attachment_mandatory"
                    ] !== "False" && <span className="text-red-500"> *</span>}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <MyDropzone setFiles={setFiles} />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500">⚠️</span>
                    {errorMessage}
                  </div>
                </div>
              )}
            </ModalBody>

            <ModalFooter className="flex justify-between gap-3 px-6 py-4 border-t border-gray-200">
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                disabled={createTicketLoading}
                size="md"
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={createTicketLoading}
                disabled={createTicketLoading}
                size="md"
                className="min-w-[120px] font-medium"
                spinner={<Spinner color="white" size="sm" />}
              >
                {createTicketLoading ? "Creating..." : "Create Ticket"}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Success/Error Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Alumni Services Ticket
          </ModalHeader>
          <ModalBody>
            <p className="text-center py-4">{modalMessage}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onPress={() => {
                setShowSuccessModal(false);
                if (createTicketMessage === 0) {
                  onClose();
                }
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
