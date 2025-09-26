import { streamText, smoothStream } from "ai";
import { createTools } from "../../../lib/tools";
import { azure } from "../../../lib/aoi";
import { getGeographyPrompt } from "../../../lib/prompt";
import APILogger from "../../components/APILogger";
// import { trace } from "@opentelemetry/api";
// import { get_emp_info } from "../../../lib/utils"; // Removed

const logger = new APILogger("https://ai.microland.com/logger");

export const maxDuration = 30;

export async function POST(req: Request) {
  //const tracer = trace.getTracer("my-ai-service");

  let requestId = "";
  let sessionId = "";

  try {
    const body = await req.json();
    console.log("Body: ", JSON.stringify(body));

    const { messages } = body;

    // Extract requestId and sessionId from body, with fallbacks
    requestId = body.requestId || "";
    sessionId = body.sessionId || "";

    console.log("requestId: ", requestId, "sessionId: ", sessionId);

    // Default to "India" if geography is not provided
    let userGeography = "India"; // Default value

    // You can optionally get geography from request body if needed
    // userGeography = body.geography || "India";

    console.log("geography: ", userGeography);

    // Get geography-specific tools
    const geographyTools = createTools(userGeography);

    // Get geography-specific prompt
    const geographyPrompt = getGeographyPrompt(userGeography);

    const result = streamText({
      model: azure("aicoe-gpt-4o"),
      messages: messages,
      //@ts-ignore
      tools: geographyTools,
      system: `${geographyPrompt}\n\n## General Context\n- Geography: ${userGeography}\n- Service: HR Bot Assistant`,
    });

    //span.end(); // Ensure span is properly ended

    await logger
      .logEvent(requestId, "hr-bot", sessionId, "postprocess", "success")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    await logger
      .logEvent(requestId, "hr-bot", sessionId, "completed", "success")
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    return result.toDataStreamResponse({
      getErrorMessage: (error: any) => error.message,
    });
  } catch (error: any) {
    console.error(`Error processing request: ${error.message}`);
    // await logger
    //   .logEvent(requestId, "hr-bot", sessionId, "completed", "error occurred")
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
