// Azure Computer Vision AI
// Code snippets from https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/vision/ai-vision-image-analysis-rest/samples/javascript/analyzeImageFromLocalFile.js

const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');
const fs = require('fs');
const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

require("dotenv").config();

// Resource Endpoint and Key Info
const endpoint = process.env['VISION_ENDPOINT']
const key = process.env['VISION_KEY']
const credential = new AzureKeyCredential(key);

const client = createClient (endpoint, credential);

// Desired Features from Image
const feature = [
  'Caption',
  'DenseCaptions',
  'Objects',
  // 'People',
  // 'Read',
  // 'SmartCrops',
  'Tags'
];

// Listen at Port
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Post Request
app.post('/upload', (req, res) => {
  console.log(req.body.imageName);
  const imagePath = `../mission-02/public/${req.body.imageName}`;

  async function analyzeImageFromFile() {
    const imageBuffer = fs.readFileSync(imagePath);

    const result = await client.path('/imageanalysis:analyze').post({
      body: imageBuffer,
      queryParameters: {
        features: feature
      },
      contentType: 'application/octet-stream'
    });

    const iaResult = result.body;
    console.log(iaResult);

    // Send AI results back to react project
    res.send(iaResult);

    // Log the response using more of the API's object model
    if (iaResult.captionResult) {
      console.log(`Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`);
    }
    if (iaResult.denseCaptionsResult) {
      iaResult.denseCaptionsResult.values.forEach(denseCaption => console.log(`Dense Caption: ${JSON.stringify(denseCaption)}`));
    }
    if (iaResult.objectsResult) {
      iaResult.objectsResult.values.forEach(object => console.log(`Object: ${JSON.stringify(object)}`));
    }
    // if (iaResult.peopleResult) {
    //   iaResult.peopleResult.values.forEach(person => console.log(`Person: ${JSON.stringify(person)}`));
    // }
    // if (iaResult.readResult) {
    //   iaResult.readResult.blocks.forEach(block => console.log(`Text Block: ${JSON.stringify(block)}`));
    // }
    // if (iaResult.smartCropsResult) {
    //   iaResult.smartCropsResult.values.forEach(smartCrop => console.log(`Smart Crop: ${JSON.stringify(smartCrop)}`));
    // }
    if (iaResult.tagsResult) {
      iaResult.tagsResult.values.forEach(tag => console.log(`Tag: ${JSON.stringify(tag)}`));
    }
  }

  analyzeImageFromFile();

});

