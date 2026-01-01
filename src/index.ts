import { s3, write } from "bun";
import { Elysia, t } from "elysia";
import OpenAI from "openai";

const app = new Elysia()
  .post(
    "/api/v1/text-to-image",
    async ({ body }) => {
      const { prompt, size } = body;

      //console.log(
      // `Generating image for prompt: "${prompt}" with size: ${size}`
      //);

      const openai = new OpenAI();

      const result = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        size,
        response_format: "b64_json",
      });

      console.log("Image generation result:", result);

      const dataBase64 = result.data?.[0].b64_json;
      const buffer = Buffer.from(dataBase64!, "base64");

      const metadata = s3.file(`image_${Date.now()}.png`);
      await write(metadata, buffer);

      const url = metadata.presign({
        acl: "public-read",
        expiresIn: 60 * 60, // 1 hour
      });

      return {
        success: true,
        message: "Successfully generated image",
        image_url: url,
      };
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
