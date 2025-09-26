import { tool } from "ai";
import { z } from "zod";


const fetchFromAPI = async (url, emp_id) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.SF_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      },
      body: JSON.stringify({ emp_id }),
    });
    console.log("emp_id:)", emp_id);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching data: ${error.message}`);
    return { error: error.message };
  }
};

const fetchLeaveBalance = tool({
  description: "Fetch leave balance for an employee.",
  parameters: z.object({ emp_id: z.string() }),
  execute: async ({ emp_id }) => {
    console.log("executing leave balance tool...");
    return fetchFromAPI(
      "https://alumniapi.microland.com/employee/get-al-balance",
      emp_id
    );
  },
});

const fetchPFDetails = tool({
  description: "Fetch PF statement for an employee.",
  parameters: z.object({ emp_id: z.string() }),
  execute: async ({ emp_id }) => {
    console.log("executing pf details tool...");
    return fetchFromAPI(
      "https://alumniapi.microland.com/employee/get-pf-statement",
      emp_id
    );
  },
});

const fetchPayslip = tool({
  description: "Fetch payslip for an employee.",
  parameters: z.object({ emp_id: z.string() }),
  execute: async ({ emp_id }) => {
    console.log("executing payslip tool...");
    return fetchFromAPI(
      "https://alumniapi.microland.com/employee/get-pay-slip",
      emp_id
    );
  },
});

const fetchFormSixteen = tool({
  description: "Fetch Form 16 for an employee.",
  parameters: z.object({ emp_id: z.string() }),
  execute: async ({ emp_id }) => {
    console.log("executing form16 tool...");
    return fetchFromAPI(
      "https://alumniapi.microland.com/employee/get-form-16",
      emp_id
    );
  },
});

// Complete policy map based on the provided document
const policyMaps = {
  India: {
    "Employee Referral - Global": "https://www.microland.one/Policies/14",
    "Leave Benefit - India": "https://www.microland.one/Policies/121",
    "National Festival Holiday Allowance Benefit - India":
      "https://www.microland.one/Policies/122",
    "Leave Travel Allowance - India": "https://www.microland.one/Policies/41",
    "Stretched Hours Linked Allowance - India":
      "https://www.microland.one/Policies/42",
    "Stand-By and Call-out Benefit - India":
      "https://www.microland.one/Policies/43",
    "Gratuity Benefit - India": "https://www.microland.one/Policies/44",
    "Salary Earnings & Deductions - India & Variable Pay Global":
      "https://www.microland.one/Policies/45",
    "Loan Benefit - India": "https://www.microland.one/Policies/46",
    "Local Conveyance Reimbursement - India":
      "https://www.microland.one/Policies/53",
    "Business Travel - India": "https://www.microland.one/Policies/54",
    "Domestic Deputation - India": "https://www.microland.one/Policies/55",
    "Domestic Transfer - India": "https://www.microland.one/Policies/56",
    "Retirement - India": "https://www.microland.one/Policies/57",
    "Prevention of Sexual Harassment at Work place - India":
      "https://www.microland.one/Policies/104",
    "National Pension System (NPS) Benefit - India":
      "https://www.microland.one/Policies/130",
    "Mobile and Internet Data - India":
      "https://www.microland.one/Policies/163",
    "Night Shift Allowance Benefit - India":
      "https://www.microland.one/Policies/170",
    "Group Mediclaim Benefits Manual for India employees":
      "https://www.microland.one/Policies/181",
    "Talent Exit Guidelines - India": "https://www.microland.one/Policies/182",
    "Ask Microland FAQs - India": "https://www.microland.one/Policies/183",
    "Leave and Attendance FAQs - India":
      "https://www.microland.one/Policies/186",
    "Disciplinary Action - India": "https://www.microland.one/Policies/189",
    "Employment Conversion to EML Guidelines - India":
      "https://www.microland.one/Policies/196",
    "Salary Advance Benefit - India": "https://www.microland.one/Policies/224",
    "EPD Guidelines - India": "https://www.microland.one/Policies/229",
    "Performance Improvement Plan - India":
      "https://www.microland.one/Policies/236",
    "Transport Policy India Corporate Cab Service":
      "https://www.microland.one/Policies/241",
    "Remote Working Guidelines - India":
      "https://www.microland.one/Policies/242",
    "Microland Childcare Benefit - India":
      "https://www.microland.one/Policies/244",
    "2025 Holiday Calendar - India": "https://www.microland.one/Policies/249",
    "Provident Fund FAQs - India": "https://www.microland.one/Policies/258",
    "New Joiner Relocation Guidelines India":
      "https://www.microland.one/Policies/27",
    "Re-deployment Pool - India": "https://www.microland.one/Policies/30",
    "TCSA Policy": "https://www.microland.one/Policies/108",
    "Microland Employee Exit FAQ - India":
      "https://alumniservices.microland.com/faqs",

    // Global policies relevant to India
    "Code of Business Conduct & Ethics - Global":
      "https://www.microland.one/Policies/93",
    "Work from Home - Global": "https://www.microland.one/Policies/160",
    "Anti-Bribery and Anti-Corruption - Global":
      "https://www.microland.one/Policies/15",
    "Data Privacy - Global": "https://www.microland.one/Policies/16",
    "Equal Employment Opportunity - Global":
      "https://www.microland.one/Policies/24",
    "Rehire at Microland - Global": "https://www.microland.one/Policies/25",
    "Employment of Family Member - Global":
      "https://www.microland.one/Policies/26",
    "Background Verification - Global": "https://www.microland.one/Policies/29",
    "Dress Code - Global": "https://www.microland.one/Policies/31",
    "Substance Abuse - Global": "https://www.microland.one/Policies/32",
    "Ombuds/Whistleblower Policy": "https://www.microland.one/Policies/33",
    "Corporate Information Security Policy":
      "https://www.microland.one/Policies/95",
    "Email Use Policy": "https://www.microland.one/Policies/96",
    "IT Security and Usage Policy": "https://www.microland.one/Policies/97",
    "Service Milestone Benefit - Global":
      "https://www.microland.one/Policies/101",
    "Document Retention - Global": "https://www.microland.one/Policies/123",
    "Mobility - Global": "https://www.microland.one/Policies/125",
    "Gifts, Hospitality and Entertainment - Global":
      "https://www.microland.one/Policies/132",
    "Social Media Policy": "https://www.microland.one/Policies/150",
    "Workplace Conduct - Global": "https://www.microland.one/Policies/164",
    "Immigration - Global": "https://www.microland.one/Policies/174",
    "Internal Job Posting (IJP) Policy - Global":
      "https://www.microland.one/Policies/176",
    "Job Abandonment Process - Global":
      "https://www.microland.one/Policies/194",
    "Timesheet Policy - Global": "https://www.microland.one/Policies/202",
    "Time Sheet Entry User Manual - Global":
      "https://www.microland.one/Policies/204",
    "Timesheet Approver Manual - Global":
      "https://www.microland.one/Policies/205",
    "DL Managment Policy": "https://www.microland.one/Policies/209",
    "Cheers Policy - Global": "https://www.microland.one/Policies/230",
    "Timesheet FAQs - Global": "https://www.microland.one/Policies/232",
    "Expense Reimbursement Policy - Global":
      "https://www.microland.one/Policies/234",
    "Staff Welfare Team Engagement Policy - Global":
      "https://www.microland.one/Policies/235",
    "End User Provision Policy": "https://www.microland.one/Policies/245",
    "Mandatory E-Learning - Global": "https://www.microland.one/Policies/259",
  },

  Saudi: {
    "Disciplinary Action - Saudi": "https://www.microland.one/Policies/59",
    "Working Hours - Saudi": "https://www.microland.one/Policies/60",
    "Stand-By and Call-Out Benefits - Saudi":
      "https://www.microland.one/Policies/64",
    "Loan Benefit - Saudi": "https://www.microland.one/Policies/65",
    "Company Car Benefit - Saudi": "https://www.microland.one/Policies/66",
    "Grant of Family Status Benefit - Saudi":
      "https://www.microland.one/Policies/67",
    "Travel Reimbursement - Saudi": "https://www.microland.one/Policies/69",
    "Annual Tickets Benefit - Saudi": "https://www.microland.one/Policies/70",
    "Business Trip - Saudi": "https://www.microland.one/Policies/71",
    "Retirement - Saudi": "https://www.microland.one/Policies/73",
    "End of Service Benefit - Saudi": "https://www.microland.one/Policies/74",
    "Leave Benefit - Saudi": "https://www.microland.one/Policies/166",
    "Salary Advance Benefit - Saudi": "https://www.microland.one/Policies/225",
    "Performance Improvement Plan – KSA":
      "https://www.microland.one/Policies/238",
    "Mobile Allowance - Saudi": "https://www.microland.one/Policies/240",
    "2025 Holiday Calendar - KSA": "https://www.microland.one/Policies/252",

    // Global policies relevant to Saudi
    "Code of Business Conduct & Ethics - Global":
      "https://www.microland.one/Policies/93",
    "Work from Home - Global": "https://www.microland.one/Policies/160",
    "Employee Referral - Global": "https://www.microland.one/Policies/14",
    "Anti-Bribery and Anti-Corruption - Global":
      "https://www.microland.one/Policies/15",
    "Data Privacy - Global": "https://www.microland.one/Policies/16",
    "Equal Employment Opportunity - Global":
      "https://www.microland.one/Policies/24",
    "Rehire at Microland - Global": "https://www.microland.one/Policies/25",
    "Employment of Family Member - Global":
      "https://www.microland.one/Policies/26",
    "Background Verification - Global": "https://www.microland.one/Policies/29",
    "Dress Code - Global": "https://www.microland.one/Policies/31",
    "Substance Abuse - Global": "https://www.microland.one/Policies/32",
    "Ombuds/Whistleblower Policy": "https://www.microland.one/Policies/33",
    "Corporate Information Security Policy":
      "https://www.microland.one/Policies/95",
    "Email Use Policy": "https://www.microland.one/Policies/96",
    "IT Security and Usage Policy": "https://www.microland.one/Policies/97",
    "Service Milestone Benefit - Global":
      "https://www.microland.one/Policies/101",
    "Document Retention - Global": "https://www.microland.one/Policies/123",
    "Mobility - Global": "https://www.microland.one/Policies/125",
    "Gifts, Hospitality and Entertainment - Global":
      "https://www.microland.one/Policies/132",
    "Social Media Policy": "https://www.microland.one/Policies/150",
    "Workplace Conduct - Global": "https://www.microland.one/Policies/164",
    "Immigration - Global": "https://www.microland.one/Policies/174",
    "Internal Job Posting (IJP) Policy - Global":
      "https://www.microland.one/Policies/176",
    "Job Abandonment Process - Global":
      "https://www.microland.one/Policies/194",
    "Timesheet Policy - Global": "https://www.microland.one/Policies/202",
    "Time Sheet Entry User Manual - Global":
      "https://www.microland.one/Policies/204",
    "Timesheet Approver Manual - Global":
      "https://www.microland.one/Policies/205",
    "DL Managment Policy": "https://www.microland.one/Policies/209",
    "Cheers Policy - Global": "https://www.microland.one/Policies/230",
    "Timesheet FAQs - Global": "https://www.microland.one/Policies/232",
    "Expense Reimbursement Policy - Global":
      "https://www.microland.one/Policies/234",
    "Staff Welfare Team Engagement Policy - Global":
      "https://www.microland.one/Policies/235",
    "End User Provision Policy": "https://www.microland.one/Policies/245",
    "Mandatory E-Learning - Global": "https://www.microland.one/Policies/259",
  },

  UK: {
    "Right to Work - UK": "https://www.microland.one/Policies/76",
    "Leave Benefit - UK": "https://www.microland.one/Policies/77",
    "Sick Leave Benefit - UK": "https://www.microland.one/Policies/78",
    "Stand-By, Call Out & Overtime Benefits - UK":
      "https://www.microland.one/Policies/80",
    "Disciplinary Action - UK": "https://www.microland.one/Policies/81",
    "Loan Benefit - UK": "https://www.microland.one/Policies/82",
    "Cycle to Work Benefit - UK": "https://www.microland.one/Policies/83",
    "Business Mileage Benefit - UK": "https://www.microland.one/Policies/84",
    "Modern Slavery - UK": "https://www.microland.one/Policies/135",
    "Mobile Expense Reimbursement Benefit - UK":
      "https://www.microland.one/Policies/165",
    "Salary Advance Benefit - UK": "https://www.microland.one/Policies/228",
    "Performance Improvement Plan – UK":
      "https://www.microland.one/Policies/237",
    "2025 Holiday Calendar - UK": "https://www.microland.one/Policies/254",

    // Global policies relevant to USA
    "Code of Business Conduct & Ethics - Global":
      "https://www.microland.one/Policies/93",
    "Work from Home - Global": "https://www.microland.one/Policies/160",
    "Employee Referral - Global": "https://www.microland.one/Policies/14",
    "Anti-Bribery and Anti-Corruption - Global":
      "https://www.microland.one/Policies/15",
    "Data Privacy - Global": "https://www.microland.one/Policies/16",
    "Equal Employment Opportunity - Global":
      "https://www.microland.one/Policies/24",
    "Rehire at Microland - Global": "https://www.microland.one/Policies/25",
    "Employment of Family Member - Global":
      "https://www.microland.one/Policies/26",
    "Background Verification - Global": "https://www.microland.one/Policies/29",
    "Dress Code - Global": "https://www.microland.one/Policies/31",
    "Substance Abuse - Global": "https://www.microland.one/Policies/32",
    "Ombuds/Whistleblower Policy": "https://www.microland.one/Policies/33",
    "Salary Earnings & Deductions - India & Variable Pay Global":
      "https://www.microland.one/Policies/45",
    "Corporate Information Security Policy":
      "https://www.microland.one/Policies/95",
    "Email Use Policy": "https://www.microland.one/Policies/96",
    "IT Security and Usage Policy": "https://www.microland.one/Policies/97",
    "Service Milestone Benefit - Global":
      "https://www.microland.one/Policies/101",
    "Document Retention - Global": "https://www.microland.one/Policies/123",
    "Mobility - Global": "https://www.microland.one/Policies/125",
    "Gifts, Hospitality and Entertainment - Global":
      "https://www.microland.one/Policies/132",
    "Social Media Policy": "https://www.microland.one/Policies/150",
    "Workplace Conduct - Global": "https://www.microland.one/Policies/164",
    "Immigration - Global": "https://www.microland.one/Policies/174",
    "Internal Job Posting (IJP) Policy - Global":
      "https://www.microland.one/Policies/176",
    "Job Abandonment Process - Global":
      "https://www.microland.one/Policies/194",
    "Travel Expense FAQ": "https://www.microland.one/Policies/200",
    "Travel Expense User Manual": "https://www.microland.one/Policies/201",
    "Timesheet Policy - Global": "https://www.microland.one/Policies/202",
    "Time Sheet Entry User Manual - Global":
      "https://www.microland.one/Policies/204",
    "Timesheet Approver Manual - Global":
      "https://www.microland.one/Policies/205",
    "DL Managment Policy": "https://www.microland.one/Policies/209",
    "Cheers Policy - Global": "https://www.microland.one/Policies/230",
    "Timesheet FAQs - Global": "https://www.microland.one/Policies/232",
    "Allowance - FAQs": "https://www.microland.one/Policies/233",
    "Expense Reimbursement Policy - Global":
      "https://www.microland.one/Policies/234",
    "Staff Welfare Team Engagement Policy - Global":
      "https://www.microland.one/Policies/235",
    "End User Provision Policy": "https://www.microland.one/Policies/245",
    "2025 Holiday Calendar - Canada": "https://www.microland.one/Policies/256",
    "Mandatory E-Learning - Global": "https://www.microland.one/Policies/259",
  },

  USA: {
    "Disciplinary Action - USA": "https://www.microland.one/Policies/85",
    "Leave / Paid Time Off (PTO) Benefit - USA":
      "https://www.microland.one/Policies/86",
    "Mobile Expense Reimbursement Benefit - USA":
      "https://www.microland.one/Policies/87",
    "Ask Microland FAQs - USA": "https://www.microland.one/Policies/184",
    "Stand-By and On Call Allowance - USA":
      "https://www.microland.one/Policies/207",
    "Business Mileage Benefit | USA": "https://www.microland.one/Policies/239",
    "2025 Holiday Calendar - USA": "https://www.microland.one/Policies/255",

    // Global policies relevant to USA
    "Code of Business Conduct & Ethics - Global":
      "https://www.microland.one/Policies/93",
    "Work from Home - Global": "https://www.microland.one/Policies/160",
    "Employee Referral - Global": "https://www.microland.one/Policies/14",
    "Anti-Bribery and Anti-Corruption - Global":
      "https://www.microland.one/Policies/15",
    "Data Privacy - Global": "https://www.microland.one/Policies/16",
    "Equal Employment Opportunity - Global":
      "https://www.microland.one/Policies/24",
    "Rehire at Microland - Global": "https://www.microland.one/Policies/25",
    "Employment of Family Member - Global":
      "https://www.microland.one/Policies/26",
    "Background Verification - Global": "https://www.microland.one/Policies/29",
    "Dress Code - Global": "https://www.microland.one/Policies/31",
    "Substance Abuse - Global": "https://www.microland.one/Policies/32",
    "Ombuds/Whistleblower Policy": "https://www.microland.one/Policies/33",
    "Salary Earnings & Deductions - India & Variable Pay Global":
      "https://www.microland.one/Policies/45",
    "Corporate Information Security Policy":
      "https://www.microland.one/Policies/95",
    "Email Use Policy": "https://www.microland.one/Policies/96",
    "IT Security and Usage Policy": "https://www.microland.one/Policies/97",
    "Service Milestone Benefit - Global":
      "https://www.microland.one/Policies/101",
    "Document Retention - Global": "https://www.microland.one/Policies/123",
    "Mobility - Global": "https://www.microland.one/Policies/125",
    "Gifts, Hospitality and Entertainment - Global":
      "https://www.microland.one/Policies/132",
    "Social Media Policy": "https://www.microland.one/Policies/150",
    "Workplace Conduct - Global": "https://www.microland.one/Policies/164",
    "Immigration - Global": "https://www.microland.one/Policies/174",
    "Internal Job Posting (IJP) Policy - Global":
      "https://www.microland.one/Policies/176",
    "Job Abandonment Process - Global":
      "https://www.microland.one/Policies/194",
    "Travel Expense FAQ": "https://www.microland.one/Policies/200",
    "Travel Expense User Manual": "https://www.microland.one/Policies/201",
    "Timesheet Policy - Global": "https://www.microland.one/Policies/202",
    "Time Sheet Entry User Manual - Global":
      "https://www.microland.one/Policies/204",
    "Timesheet Approver Manual - Global":
      "https://www.microland.one/Policies/205",
    "DL Managment Policy": "https://www.microland.one/Policies/209",
    "Cheers Policy - Global": "https://www.microland.one/Policies/230",
    "Timesheet FAQs - Global": "https://www.microland.one/Policies/232",
    "Allowance - FAQs": "https://www.microland.one/Policies/233",
    "Expense Reimbursement Policy - Global":
      "https://www.microland.one/Policies/234",
    "Staff Welfare Team Engagement Policy - Global":
      "https://www.microland.one/Policies/235",
    "End User Provision Policy": "https://www.microland.one/Policies/245",
    "2025 Holiday Calendar - Canada": "https://www.microland.one/Policies/256",
    "Mandatory E-Learning - Global": "https://www.microland.one/Policies/259",
  },
};

policyMaps["Default"] = {
  "Code of Business Conduct & Ethics - Global":
    "https://www.microland.one/Policies/93",
  "Work from Home - Global": "https://www.microland.one/Policies/160",
  "Employee Referral - Global": "https://www.microland.one/Policies/14",
  "Anti-Bribery and Anti-Corruption - Global":
    "https://www.microland.one/Policies/15",
  "Data Privacy - Global": "https://www.microland.one/Policies/16",
  "Equal Employment Opportunity - Global":
    "https://www.microland.one/Policies/24",
  "Rehire at Microland - Global": "https://www.microland.one/Policies/25",
  "Employment of Family Member - Global":
    "https://www.microland.one/Policies/26",
  "Background Verification - Global": "https://www.microland.one/Policies/29",
  "Dress Code - Global": "https://www.microland.one/Policies/31",
  "Substance Abuse - Global": "https://www.microland.one/Policies/32",
  "Ombuds/Whistleblower Policy": "https://www.microland.one/Policies/33",
  "Salary Earnings & Deductions - India & Variable Pay Global":
    "https://www.microland.one/Policies/45",
  "Corporate Information Security Policy":
    "https://www.microland.one/Policies/95",
  "Email Use Policy": "https://www.microland.one/Policies/96",
  "IT Security and Usage Policy": "https://www.microland.one/Policies/97",
  "Service Milestone Benefit - Global":
    "https://www.microland.one/Policies/101",
  "Document Retention - Global": "https://www.microland.one/Policies/123",
  "Mobility - Global": "https://www.microland.one/Policies/125",
  "Gifts, Hospitality and Entertainment - Global":
    "https://www.microland.one/Policies/132",
  "Social Media Policy": "https://www.microland.one/Policies/150",
  "Workplace Conduct - Global": "https://www.microland.one/Policies/164",
  "Immigration - Global": "https://www.microland.one/Policies/174",
  "Internal Job Posting (IJP) Policy - Global":
    "https://www.microland.one/Policies/176",
  "Job Abandonment Process - Global": "https://www.microland.one/Policies/194",
  "Travel Expense FAQ": "https://www.microland.one/Policies/200",
  "Travel Expense User Manual": "https://www.microland.one/Policies/201",
  "Timesheet Policy - Global": "https://www.microland.one/Policies/202",
  "Time Sheet Entry User Manual - Global":
    "https://www.microland.one/Policies/204",
  "Timesheet Approver Manual - Global":
    "https://www.microland.one/Policies/205",
  "DL Managment Policy": "https://www.microland.one/Policies/209",
  "Cheers Policy - Global": "https://www.microland.one/Policies/230",
  "Timesheet FAQs - Global": "https://www.microland.one/Policies/232",
  "Allowance - FAQs": "https://www.microland.one/Policies/233",
  "Expense Reimbursement Policy - Global":
    "https://www.microland.one/Policies/234",
  "Staff Welfare Team Engagement Policy - Global":
    "https://www.microland.one/Policies/235",
  "End User Provision Policy": "https://www.microland.one/Policies/245",
  "2025 Holiday Calendar - Canada": "https://www.microland.one/Policies/256",
  "Mandatory E-Learning - Global": "https://www.microland.one/Policies/259",
};

const createTools = (geography = "Default") => {
  console.log(`Creating tools for geography: ${geography}`);

  // Select appropriate policy map based on geography
  const selectedPolicyMap = policyMaps[geography] || policyMaps["Default"];

  // Create geography-specific tools
  const geographyTools = {
    fetchLeaveBalance: tool({
      description: `Fetch leave balance for a ${geography} employee. Only fetches annual casual leaves. do not use for other leaves`,
      parameters: z.object({ emp_id: z.string() }),
      execute: async ({ emp_id }) => {
        console.log("executing leave balance tool...");
        const response = await fetchFromAPI(
          "https://alumniapi.microland.com/employee/get-al-balance",
          emp_id
        );

        // Log the fetched data
        console.log("Fetched leave balance data:", response);

        return response;
      },
    }),

    createTicket: tool({
      description: `This tool should get executed whenever there is a query create ticket.`,
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        console.log("executing create ticket tool...", query);
        return "Button has been shown to the user to create a ticket";
      },
    }),

    executeSearch: tool({
      description: `Perform a search query on HR records for ${geography}.`,
      parameters: z.object({ query: z.string() }),
      execute: async ({ query }) => {
        console.log(
          `Executing executeSearch for query in ${geography}:`,
          query
        );
        try {
          const response = await fetch(
            "https://hr-cogservice.search.windows.net/indexes/alumni-services-policies/docs/search?api-version=2024-07-01",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "api-key": process.env.EXECUTE_SEARCH_API_KEY || "",
              },
              body: JSON.stringify({
                search: `${query} ${geography}`, // Add geography to search query
                queryType: "semantic",
                semanticConfiguration:
                  "alumni-services-policies-semantic-configuration",
                answers: "extractive|count-1",
                captions: "extractive|highlight-false",
                select: "",
                top: "3",
                count: "true",
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Search API request failed with status ${response.status}`
            );
          }

          const responseData = await response.json();
          const searchResults = responseData?.value || [];

          console.log(
            "Search Results:",
            searchResults.map((item) => item.title)
          );

          if (searchResults.length === 0) {
            return { error: "No results found" };
          }

          const resultText = searchResults.map((item) => item.chunk).join("\n");

          const files = searchResults.map((item) => {
            let normalizedTitle = item.title.trim();
            let policyUrl = selectedPolicyMap[normalizedTitle];

            // Try partial matching if exact match fails
            if (!policyUrl) {
              const normalizedItemTitle = item.title
                .replace(".pdf", "") // Remove .pdf extension
                .trim();

              for (const [policyTitle, url] of Object.entries(
                selectedPolicyMap
              )) {
                const normalizedPolicyTitle = policyTitle.trim();

                // Use exact matching (after removing .pdf extension)
                if (normalizedItemTitle === normalizedPolicyTitle) {
                  policyUrl = url;
                  console.log(
                    `Exact match found: "${item.title}" to "${policyTitle}" with URL: ${url}`
                  );
                  break;
                }
              }
            }

            return {
              title: item.title,
              policyUrl: policyUrl || "No matching policy found", // Fallback message
              originalPath: item.metadata_storage_path,
            };
          });

          console.log("Files with URLs:", files);

          return {
            result: resultText,
            files: files,
          };
        } catch (error) {
          console.error(`Error executing search: ${error.message}`);
          return { error: error.message };
        }
      },
    }),

    currentDateTimeTool: tool({
      description: `Get the current date and time for ${geography}.`,
      parameters: z.object({}),
      execute: async () => {
        const now = new Date();

        // Adjust time for different geographies (simplified approach)
        let localDate = new Date(now);

        switch (geography) {
          case "India":
            // India Time (UTC+5:30)
            localDate = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
            break;
          case "UK":
            // UK Time (UTC+0/+1)
            localDate = new Date(now.getTime() + 0 * 60 * 60 * 1000); // Adjust for DST as needed
            break;
          case "USA":
            // US Eastern Time (UTC-5/-4)
            localDate = new Date(now.getTime() - 5 * 60 * 60 * 1000); // Adjust for DST as needed
            break;
          case "Saudi":
            // Saudi Time (UTC+3)
            localDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
            break;
          // Add more cases as needed
        }

        return {
          date: localDate.toLocaleDateString(),
          time: localDate.toLocaleTimeString(),
          timestamp: localDate.getTime(),
          geography: geography,
        };
      },
    }),
  };

  // Remove null tools (like India-specific tools for non-India regions)
  const cleanedTools = {};
  Object.entries(geographyTools).forEach(([key, value]) => {
    if (value !== null) {
      cleanedTools[key] = value;
    }
  });

  return cleanedTools;
};

export { createTools };
