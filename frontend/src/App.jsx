import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [caption, setCaption] = useState("");
  const [denseCaptions, setDenseCaptions] = useState([]);
  const [tags, setTags] = useState([]);
  const [display, setDisplay] = useState(0);

  function submitImage(event) {
    event.preventDefault();
    const imageName = event.target.image.files[0].name;

    // Get Image name "x.png"
    setImage(imageName);
    setImagePath(`../public/${imageName}`);

    console.log("Image Path: " + imagePath);

    // Send image name to node.js AI
    fetch('http://localhost:4000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageName }),
    })
    .then(response => {
    if (response.ok) {
      console.log('Image path sent to the server successfully');
      return response.json(); // Parse the JSON response
    } else {
      throw new Error('Failed to send image path to the server');
    }
    })
    .then(data => {
      console.log(data); 
      // Set captions and tags from response
      setCaption(`"${data.captionResult.text}" (confidence: ${(data.captionResult.confidence * 100).toFixed(2)}%)`); 
      setDenseCaptions(data.denseCaptionsResult.values);
      setTags(data.tagsResult.values);
      setDisplay(1);
    })
    .catch(error => {
      console.error('Error sending image path to the server:', error);
    });
  }
  
  return (
    <div>
      <img className="logo" src="../public/logo.png"/>
      <h1 className="header">AI Vision Image Analysis (Azure)</h1>
      {/* Submit Button */}
      <form onSubmit={submitImage} encType="multipart/form-data">
        <input type="file" name="image" accept="image/*"/>
        <button type="submit">Upload Image</button>
      </form>
      {display && (<div>
        {/* Display Image */}
        {imagePath && <img className="car" src={imagePath}/>}
        <div className="text">
          <h2>Image Analysis:</h2> 
          <h3>Caption: </h3>
          {caption && <p>{caption}</p>}
          <h3>Dense Captions: </h3>
          {denseCaptions.map((denseCaption, index) => (
            <p key={index}>{`${JSON.stringify(denseCaption.text)} (confidence: ${(denseCaption.confidence * 100).toFixed(2)}%)`}</p>
          ))}
          <h3>Tags: </h3>
          {tags.map((denseCaption, index) => (
            <p key={index}>{`${JSON.stringify(denseCaption.name)} (confidence: ${(denseCaption.confidence * 100).toFixed(2)}%)`}</p>
          ))}
        </div>
      </div>)}
    </div>
  );
}

export default App;
