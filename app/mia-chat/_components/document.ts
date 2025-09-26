export const documents: DocumentListTypes = {
    "Financial Documents": [
        { label: "Payslips", description: "Please click on the request button to email your Payslips to your email address", note: "Payslips for last six months during your employment at Microland." },
        { label: "Form 16", description: "Please click on the request button to email your Form 16 to your email address ", note: "Form 16 will be accessible by mid-June of the respective assessment year." },
        { label: "PF Statement", description: "Please click on the request button to email your PF Statement to your email address", note: "PF statement for the last month of your employment at Microland." },
    ],
    "Exit Documents": [
        { label: "Full and Final Statement", description: "Please click on the request button to email your Full and Final Statement to your email address,", note: "Full and Final Statement will be accessible once the NDC process is completed." },
        { label: "Service Letter", description: "Please click on the request button to email your Service Letter to your email address", note: "Service Letter will be accessible once NDC process is completed and FNF is positive." },
        { label: "Relieving Letter", description: "Please click on the request button to email your Relieving Letter to your email address", note: "Relieving letter will be accessible one day after your Last Working Day." },
    ]
};

export const doc_type_map = {
    'Relieving Letter': 'RL',
    "Service Letter": 'SL',
    'Payslips': 'PS',
    'Form 16': 'F16',
    'PF Statement': 'PF',
    'Full and Final Statement': 'FF',
    "None": "Nothing Selected"
}

export type DocumentTypes = {
    [key: string]: string
}
export type DocumentListTypes = {
    [key: string]: DocumentItemsTypes[]
}
export type DocumentItemsTypes = {
    "label": string
    "description": string
    "note"?: string
}

export const document_types: DocumentTypes = {
    'Relieving Letter': '', 'Payslips': '', 'Form 16': '',
    'PF Statement': '', 'Full and Final Statement': '', "Service Letter": ''
}
