class APILogger {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async _request(method, endpoint, data = null, params = {}) {
        const url = new URL(`${this.baseUrl}${endpoint}`);
        if (Object.keys(params).length > 0) {
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
        }

        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    }

    // async createApp(appName) {
    //     const data = { app_name: appName };
    //     return await this._request('POST', '/app/', data);
    // }

    async logEvent(requestId, appName, sessionId, eventType, status, metadata = {}) {
        const data = {
            request_id: requestId,
            app_name: appName,
            session_id: sessionId,
            event_type: eventType,
            timestamp: new Date().toISOString(),
            status: status,
            metadata: metadata
        };
        return await this._request('POST', '/log/', data);
    }

    async getLogs(requestId = null, appId = null, sessionId = null) {
        const params = { request_id: requestId, app_id: appId, session_id: sessionId };
        return await this._request('GET', '/logs/', null, params);
    }
}

// Example Usage:
// const api = new APIClient("https://ai.microland.com/logger");
// api.createApp("MyNewApp")
// .then(response => console.log(response))
// .catch(error => console.log(error));

export default APILogger;