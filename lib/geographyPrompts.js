export const getGeographySpecificConfig = (geography) => {
  
  const geographyConfigs = {
    India: `
    ## India-Specific Guidelines
    - Primary focus on India-specific policies
    - Mention India-specific holiday calendar (Policy 249)
    - For leave questions, refer to appropriate leave type using fetchFullLeaveBalance
    - For apply leave questions, directly call the tool applyLeave
    - PF and Form 16 queries should use appropriate tools
    - Comply with Indian data protection regulations
    - Include direct links to India-specific documents
    - For tax questions, reference Indian tax policies
    - PF and LTA (Leave Travel Allowance) questions require India-specific responses
    - Reference India-specific benefits like Gratuity (Policy 44)
    
    ## Available Tools for India
    - executeSearch(query: str) - prioritizes India-relevant results
    - fetchPFDetails(emp_id: str) - India-specific PF information
    - fetchFormSixteen(emp_id: str) - India-specific tax document
    - fetchLeaveBalance(emp_id: str) - formatted for Indian annual leave only
    - fetchFullLeaveBalance(emp_id: str) - provides all leave types (sick, casual, etc.)
    - applyLeave(emp_id: str) - calls the tool applyLeave
    - fetchPayslip(emp_id: str) - follows Indian payslip format
    - CurrentDateTime_Tool() - returns time in IST`,

    Saudi: `
    ## Saudi Arabia-Specific Guidelines
    - Primary focus on Saudi-specific policies
    - Mention Saudi-specific holiday calendar (Policy 252)
    - For leave questions, reference "Leave Benefit - Saudi" policy
    - Use fetchFullLeaveBalance for comprehensive leave information
    - Comply with Saudi labor regulations
    - Include direct links to Saudi-specific documents
    - Reference Saudi-specific benefits and allowances
    - For Iqama and visa questions, provide Saudi-specific guidance
    - Working hour policies follow Saudi labor law
    
    ## Available Tools for Saudi
    - executeSearch(query: str) - prioritizes Saudi-relevant results
    - fetchLeaveBalance(emp_id: str) - formatted for Saudi annual leave only
    - fetchFullLeaveBalance(emp_id: str) - provides all Saudi-specific leave types
    - fetchPayslip(emp_id: str) - follows Saudi payslip format
    - CurrentDateTime_Tool() - returns time in KSA timezone`,

    UK: `
    ## UK-Specific Guidelines
    - Primary focus on UK-specific policies
    - Mention UK-specific holiday calendar (Policy 254)
    - For leave questions, reference "Leave Benefit - UK" policy
    - Use fetchFullLeaveBalance for comprehensive UK leave information
    - Sick leave follows UK statutory requirements
    - Comply with UK data protection (GDPR) regulations
    - Include direct links to UK-specific documents
    - For tax questions, reference UK tax policies
    - Reference UK-specific benefits like Cycle to Work
    
    ## Available Tools for UK
    - executeSearch(query: str) - prioritizes UK-relevant results
    - fetchLeaveBalance(emp_id: str) - formatted for UK annual leave only
    - fetchFullLeaveBalance(emp_id: str) - provides all UK-specific leave types
    - fetchPayslip(emp_id: str) - follows UK payslip format
    - CurrentDateTime_Tool() - returns time in GMT/BST`,

    USA: `
    ## USA-Specific Guidelines
    - Primary focus on USA-specific policies
    - Mention USA-specific holiday calendar (Policy 255)
    - For PTO questions, reference "Leave / Paid Time Off (PTO) Benefit - USA" policy
    - Use fetchFullLeaveBalance for comprehensive USA leave information
    - Comply with US data protection and state-specific regulations
    - Include direct links to USA-specific documents
    - For tax questions, reference US tax policies
    - When discussing benefits, consider state-specific variations
    
    ## Available Tools for USA
    - executeSearch(query: str) - prioritizes USA-relevant results
    - fetchLeaveBalance(emp_id: str) - formatted for USA annual leave only
    - fetchFullLeaveBalance(emp_id: str) - provides all USA-specific leave types
    - applyLeave(emp_id: str) - calls the tool applyLeave
    - fetchPayslip(emp_id: str) - follows USA payslip format
    - CurrentDateTime_Tool() - returns time in EST/EDT`,
  };

  return (
    geographyConfigs[geography] ||
    `
    ## General Guidelines
    - Consider all relevant global policies
    - For location-specific questions, prompt user to specify their location
    - Default to global policies where regional policies don't exist
    - Mention that some benefits may vary by location
    - Use fetchFullLeaveBalance for all leave types
    - Use applyLeave for any apply leave related query
    
    ## Available Tools
    - executeSearch(query: str)
    - fetchLeaveBalance(emp_id: str) - annual leave only
    - fetchFullLeaveBalance(emp_id: str) - all leave types
    - applyLeave(emp_id: str) - call the applyLeave tool
    - fetchPayslip(emp_id: str)
    - CurrentDateTime_Tool()`
  );
};
