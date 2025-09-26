import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//@ts-ignore
export async function get_emp_info(empId, sfApiKey) {
  try {
    const endpointUrl = "https://alumniapi.microland.com/employee/get-info";
    const headers = {
      Authorization: `Token ${sfApiKey}`,
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36;",
    };

    const payload = {
      emp_id: empId,
    };

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const executionResult = await response.json();

    const metadataOutput = { ...executionResult };
    delete metadataOutput.emp_id;
    delete metadataOutput.email;

    const formattedOutput = Object.entries(metadataOutput).map(
      ([key, value]) => {
        const formattedKey = key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return `${formattedKey}: ${value}`;
      }
    );

    const finalOutput = formattedOutput.join("\n");

    return finalOutput;
  } catch (error) {
    console.error("Error fetching employee information:", error);
    throw error;
  }
}

//@ts-ignore
export async function getLeaveBalances(empId, sfApiKey) {
  try {
    const endpointUrl =
      "https://alumniapi.microland.com/employee/get-full-leave-balance";
    const headers = {
      Authorization: `Token ${sfApiKey}`,
      "Content-Type": "application/json",
    };

    const payload = {
      emp_id: empId,
    };

    const response = await fetch(endpointUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const executionResult = await response.json();
    console.log(`emp_id:) ${executionResult.emp_id}`);
    console.log(`Fetched all leave balance data:`, executionResult);

    // Check if the response has a leaves property that is an object
    if (executionResult.leaves && typeof executionResult.leaves === "object") {
      const leavesObject = executionResult.leaves;

      // Format each leave type and its value
      let formattedOutput = "";
      for (const [leaveType, value] of Object.entries(leavesObject)) {
        formattedOutput += `${leaveType}: '${value}'\n`;
      }

      return formattedOutput.trim();
    } else {
      // Fallback if the structure is not as expected
      return "No leave balance data available or unexpected format";
    }
  } catch (error) {
    console.error("Error fetching employee information:", error);
    throw error;
  }
}
