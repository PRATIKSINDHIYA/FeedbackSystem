var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/feedback.ts
var feedback_exports = {};
__export(feedback_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(feedback_exports);
var import_fs = require("fs");
var import_path = __toESM(require("path"), 1);
var import_os = __toESM(require("os"), 1);
var DATA_DIR = import_path.default.join(import_os.default.homedir(), "feedback-data");
var FEEDBACK_FILE = import_path.default.join(DATA_DIR, "feedbacks.json");
var ensureDataFile = async () => {
  try {
    await import_fs.promises.mkdir(DATA_DIR, { recursive: true });
    try {
      await import_fs.promises.access(FEEDBACK_FILE);
    } catch {
      await import_fs.promises.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2), "utf8");
    }
  } catch (error) {
    console.error("Error ensuring data file exists:", error);
    throw new Error("Failed to initialize storage");
  }
};
var readFeedbacks = async () => {
  try {
    const data = await import_fs.promises.readFile(FEEDBACK_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading feedbacks file:", error);
    await import_fs.promises.writeFile(FEEDBACK_FILE, JSON.stringify([], null, 2), "utf8");
    return [];
  }
};
var writeFeedbacks = async (feedbacks) => {
  try {
    await import_fs.promises.writeFile(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2), "utf8");
    console.log(`Data saved to ${FEEDBACK_FILE}`);
  } catch (error) {
    console.error("Error writing feedbacks file:", error);
    throw new Error("Failed to save feedback");
  }
};
var handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  try {
    await ensureDataFile();
    if (event.httpMethod === "GET") {
      const feedbacks = await readFeedbacks();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(feedbacks)
      };
    }
    if (event.httpMethod === "POST" && event.body) {
      const { full_name, email, message } = JSON.parse(event.body);
      if (!full_name || !email || !message) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Missing required fields",
            details: {
              full_name: !full_name ? "Full name is required" : null,
              email: !email ? "Email is required" : null,
              message: !message ? "Message is required" : null
            }
          })
        };
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Invalid email format" })
        };
      }
      const feedbacks = await readFeedbacks();
      const newFeedback = {
        id: Date.now(),
        full_name,
        email,
        message,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      };
      feedbacks.push(newFeedback);
      await writeFeedbacks(feedbacks);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newFeedback)
      };
    }
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An unexpected error occurred"
      })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=feedback.js.map
