import app from "./app.js";
import { CONFIG } from "./config/env.js";

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 Server running on port ${CONFIG.PORT}`);
});