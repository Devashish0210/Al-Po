"use client";

import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setState } from "@/redux-toolkit/features/employee-login-state";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { setCookie } from "@/app/utils/cookieManager";

export default function LoginCard() {
  const dispatch = useDispatch();
  const router = useRouter();

  // State variables
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");

  // Email validation function
  //@ts-ignore
  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  // Function to generate OTP
  //@ts-ignore
  const handleGenerateOTP = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setEmailError("");
    setFormError("");

    try {
      const response = await fetch(
        "https://alumniapi.microland.com/adminui/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        dispatch(
          //@ts-ignore
          setState({
            email: email,
            otp: null,
          })
        );
      } else {
        setFormError(data.message || "Email is not registered as Admin.");
      }
    } catch (error) {
      console.error("Error generating OTP:", error);
      setFormError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to validate OTP and check admin status
  //@ts-ignore
  const handleValidateOTP = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      setOtpError("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    setOtpError("");
    setFormError("");

    try {
      // First validate the OTP
      const otpResponse = await fetch(
        "https://alumniapi.microland.com/adminui/validate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp_code: otp,
          }),
        }
      );

      const otpData = await otpResponse.json();

      if (otpResponse.ok) {
        // If OTP is valid, check if user is allowed admin access
        const adminCheckResponse = await fetch(
          "https://alumniapi.microland.com/adminui/is-allowed",
          {
            method: "POST",
            headers: {
              "X-EMAIL": email,
              "X-OTP": otp,
            },
          }
        );

        const adminData = await adminCheckResponse.json();

        console.log("adminData: ", adminData);

        if (adminCheckResponse.ok && adminData.is_active === true) {
          // ✅ Save user data in cookies with 15 minutes expiration
          //@ts-ignore
          setCookie("userEmail", email, 0.25);
          //@ts-ignore
          setCookie("userOtp", otp, 0.25);
          //@ts-ignore
          setCookie("userData", JSON.stringify(adminData), 0.25);

          // Update redux state with validated status and user role
          dispatch(
            setState({
              email: email,
              otp: otp,
              //@ts-ignore
              isAuthenticated: true,
              userData: adminData,
            })
          );

          // Redirect to admin dashboard
          router.push("/adminui/main");
        } else {
          router.push("/adminui/login");
        }
      } else {
        setOtpError(otpData.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error validating admin access:", error);
      setFormError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col">
      {loading ? (
        <Card className="w-[23rem] min-h-[25rem] flex justify-center items-center">
          <Spinner color="primary" />
        </Card>
      ) : (
        <Card className="w-[23rem] min-h-[25rem]">
          {!otpSent ? (
            // Email input form
            <form
              className="w-[80%] mx-auto flex flex-col gap-6 mt-8"
              onSubmit={handleGenerateOTP}
            >
              <h2 className="text-xl font-semibold text-center">Admin Login</h2>

              <Input
                isRequired
                value={email}
                variant="underlined"
                isInvalid={emailError.length !== 0}
                errorMessage={emailError}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value && !validateEmail(e.target.value)) {
                    setEmailError("Email entered is invalid");
                  } else {
                    setEmailError("");
                  }
                }}
                classNames={{
                  input: "ml-2 mb-0",
                  inputWrapper: "h-10",
                }}
                type="email"
                size="sm"
                placeholder="Please enter your Email ID"
                startContent={
                  <span className="material-symbols-outlined">mail</span>
                }
              />

              <Button type="submit" color="primary" disabled={loading}>
                Send OTP
              </Button>

              {formError && <p className="text-danger text-sm">{formError}</p>}
            </form>
          ) : (
            // OTP verification form
            <form
              className="w-[80%] mx-auto flex flex-col gap-6 mt-8"
              onSubmit={handleValidateOTP}
            >
              <h2 className="text-xl font-semibold text-center">
                OTP Verification
              </h2>

              <p className="text-sm text-center">
                An OTP has been sent to <strong>{email}</strong>
              </p>

              <Input
                isRequired
                value={otp}
                variant="bordered"
                isInvalid={otpError.length !== 0}
                errorMessage={otpError}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (e.target.value && e.target.value.length < 6) {
                    setOtpError("OTP must be 6 digits");
                  } else {
                    setOtpError("");
                  }
                }}
                classNames={{
                  input: "text-center",
                  inputWrapper: "h-10",
                }}
                type="text"
                size="lg"
                placeholder="Enter OTP"
              />

              <Button type="submit" color="primary" disabled={loading}>
                Verify OTP
              </Button>

              <div className="flex justify-between">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => setOtpSent(false)}
                >
                  Change Email
                </Button>

                <Button variant="light" size="sm" onClick={handleGenerateOTP}>
                  Resend OTP
                </Button>
              </div>

              {formError && (
                <p className="text-danger text-sm text-center">{formError}</p>
              )}
            </form>
          )}
        </Card>
      )}
    </div>
  );
}
