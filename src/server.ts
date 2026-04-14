import app from "./app";

const PORT = process.env.PORT || 6000;


const bootstrap = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
  }
};

bootstrap();