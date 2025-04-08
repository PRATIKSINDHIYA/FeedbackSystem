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

// netlify/functions/delete-feedback.js
var delete_feedback_exports = {};
__export(delete_feedback_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(delete_feedback_exports);
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_os = __toESM(require("os"), 1);
var dataDir = import_path.default.join(import_os.default.homedir(), "feedback-data");
var feedbackFile = import_path.default.join(dataDir, "feedbacks.json");
var handler = async (event, context) => {
  if (event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const id = event.path.split("/").pop();
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Feedback ID is required" })
      };
    }
    if (!import_fs.default.existsSync(dataDir)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "No feedback data found" })
      };
    }
    let feedbacks = [];
    if (import_fs.default.existsSync(feedbackFile)) {
      const data = import_fs.default.readFileSync(feedbackFile, "utf8");
      feedbacks = JSON.parse(data);
    }
    const initialLength = feedbacks.length;
    feedbacks = feedbacks.filter((feedback) => feedback.id !== id);
    if (feedbacks.length === initialLength) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Feedback not found" })
      };
    }
    import_fs.default.writeFileSync(feedbackFile, JSON.stringify(feedbacks, null, 2));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback deleted successfully" })
    };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to delete feedback" })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=delete-feedback.js.map
