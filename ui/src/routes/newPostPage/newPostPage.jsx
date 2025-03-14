import { useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRquest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          quantity: parseInt(inputs.quantity),
          killograms: parseInt(inputs.killograms),
          type: inputs.type,
          farmType: inputs.farmType,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value,
          transportation: inputs.transportation,
          payment: inputs.payment,
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(error);
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Number of items</label>
              <input min={1} id="quantity" name="quantity" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Number of killograms</label>
              <input min={1} id="killograms" name="killograms" type="number" />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="crops" defaultChecked>
                  Crops
                </option>
                <option value="livestock">Livestock</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Farm Type</label>
              <select name="farmType">
                <option value="horticulture">Horticulture</option>
                <option value="arable">Arable</option>
                <option value="pasture">Pasture</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="transportation">Transportation Policy</label>
              <select name="transportation">
                <option value="allowed">
                  Seller will provide transportaion for an additional fee
                </option>
                <option value="not-allowed">
                  Customer must provide their own Transportaion
                </option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="payment">Payment Policy</label>
              <input
                id="payment"
                name="payment"
                type="text"
                placeholder="Payment Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
            <button className="sendButton">Add</button>
            {error && <span>error</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <h2>Add Post Images</h2>
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dh2cmyhx8",
            uploadPreset: "agrohub",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}

export default NewPostPage;
