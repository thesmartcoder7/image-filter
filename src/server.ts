import express from "express";
import { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  // Init the Express application
  const app: Application = express();

  // Set the network port
  const port: string | number = process.env.PORT || 4000;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  app.get(
    "/filteredimage",
    async (req: Request, res: Response, next: NextFunction) => {
      let imageUrl: string = String(req.query.image_url);

      if (!imageUrl) {
        return res.status(400).send({ message: "Image url is required" });
      }
      try {
        let filteredImagePath: string = (await filterImageFromURL(
          imageUrl
        )) as string;
        res.status(200).sendFile(filteredImagePath, () => {
          deleteLocalFiles([filteredImagePath]);
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{url}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
