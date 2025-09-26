import { createDecipheriv } from "crypto";


export function decryptText(encryptedText, key) {
    // Split IV and encrypted text
    const [ivBase64, encryptedBase64] = encryptedText.split(":");

    // Convert IV and encrypted text from base64
    const iv = Buffer.from(ivBase64, "base64");
    const encrypted = Buffer.from(encryptedBase64, "base64");

    // Create decipher with AES-256-CBC
    const decipher = createDecipheriv("aes-256-cbc", Buffer.from(key), iv);

    // Decrypt the text
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}

export async function get_emp_info(empId, sfApiKey) {
    try {

        const endpointUrl = 'https://alumniapi.microland.com/employee/get-info';
        const headers = {
            'Authorization': `Token ${sfApiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36;'
        };


        const payload = {
            emp_id: empId
        };


        const response = await fetch(endpointUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const executionResult = await response.json();


        const metadataOutput = { ...executionResult };
        delete metadataOutput.emp_id;
        delete metadataOutput.email;


        const formattedOutput = Object.entries(metadataOutput).map(([key, value]) => {
            const formattedKey = key
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            return `${formattedKey}: ${value}`;
        });


        const finalOutput = formattedOutput.join('\n');

        return finalOutput
    } catch (error) {
        console.error('Error fetching employee information:', error);
        throw error;
    }
}

