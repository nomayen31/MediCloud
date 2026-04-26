import app from "./app.js";
import { envVars } from "./config/env.js";


const bootstrap = () => {
  try {
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

bootstrap();
