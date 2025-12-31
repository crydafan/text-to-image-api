import { Elysia, t } from "elysia";

const app = new Elysia()
  .post(
    "/api/v1/text-to-image",
    ({ body }) => {
      const { prompt, size } = body;
      console.log(
        `Generating image for prompt: "${prompt}" with size: ${size}`
      );
      // Dummy implementation for text-to-image generation
    },
    {
      body: t.Object({
        prompt: t.String(),
        size: t.Union([
          t.Literal("256x256"),
          t.Literal("512x512"),
          t.Literal("1024x1024"),
        ]),
      }),
    }
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
