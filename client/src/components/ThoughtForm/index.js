import React, { useState, useRef } from "react";

const ThoughtForm = () => {
  const [formState, setFormState] = useState({
    username: "",
    thought: "",
    image: "",
  });
  const [image, setImage] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  // setting initial value to null ensures that the reference to DOM element is current
  const fileInput = useRef(null);

  const handleImageUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('image', fileInput.current.files[0]);

    const postImage = async () => {
      try {
        const res = await fetch('/api/image-upload', {
          mode: 'cors',
          method: 'POST',
          body: data,
        });
        
        if(!res.ok) throw new Error(res.statusText);
        const postResponse = await res.json();
        const promisedSetImage = (newImage) => new Promise(() => setImage(newImage));
        promisedSetImage(postResponse.Location);
        return postResponse.Location;
      } catch (error) {
        console.error(error);
      }
    }
    postImage();
  }

  // update state based on form input changes
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setFormState({ ...formState, [event.target.name]: event.target.value, image: image });
      setCharacterCount(event.target.value.length);
    }
  };

  // submit form
  const handleFormSubmit = (event) => {
    event.preventDefault();

    const postData = async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      console.log(data);
      console.log(JSON.stringify(formState));
    };
    postData().then(() => window.location.reload());

    // clear form value
    setFormState({ username: "", thought: "", image: "" });
    setCharacterCount(0);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <input
          placeholder="Name"
          name="username"
          value={formState.username}
          className="form-input col-12 "
          onChange={handleChange}
        ></input>
        <textarea
          placeholder="Here's a new thought..."
          name="thought"
          value={formState.thought}
          className="form-input col-12 "
          onChange={handleChange}
        ></textarea>
        <label className="form-input col-12  p-1">
          Add an image to your thought:
          <input type="file" ref={fileInput} className="form-input p-2" />
          <button className="btn" onClick={handleImageUpload}>
            Upload
          </button>
        </label>
        <button className="btn col-12 " type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
