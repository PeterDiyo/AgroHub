import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useLoaderData, useNavigate, useRouteError } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import apiRequest from "../../lib/apiRquest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // First update the UI optimistically
      setSaved((prev) => !prev);

      // Then make the API call - the backend will handle toggling the save state
      await apiRequest.post("/users/save", { postId: post.id });
      console.log("Post save state toggled successfully");
    } catch (err) {
      console.error("Error toggling post save state:", err);
      // Revert the UI state if the API call fails
      setSaved((prev) => !prev);
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // Create a new chat with the post owner
      const response = await apiRequest.post("/chats", {
        receiverId: post.userId,
      });

      // Navigate to the chat page
      navigate(`/profile?chat=${response.data.id}`);
    } catch (err) {
      console.error("Error creating chat:", err);
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">Rs. {post.price}</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar || "/noavatar.jpg"} alt="" />
                <span>{post.user?.username || "Unknown User"}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail?.desc || ""),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Transportaion Policy</span>
                {post.postDetail?.transportation === "allowed" ? (
                  <p>
                    Seller will provide transportaion for an additional fee{" "}
                  </p>
                ) : (
                  <p>Customer must provide their own Transportaion</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Payment Policy</span>
                <p>{post.postDetail?.payment || "Not specified"}</p>
              </div>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail?.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail?.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>
                  {post.postDetail?.bus > 999
                    ? post.postDetail.bus / 1000 + "km"
                    : post.postDetail?.bus + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>
                  {post.postDetail?.restaurant > 999
                    ? post.postDetail.restaurant / 1000 + "km"
                    : post.postDetail?.restaurant + "m"}{" "}
                  away
                </p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handleSendMessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#cce2db" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Product Saved" : "Save the Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error boundary component
export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container">
      <h1>Oops! Something went wrong</h1>
      <p>
        Sorry, we couldn't load this post. It might have been deleted or is no
        longer available.
      </p>
      <a href="/list">Go back to all posts</a>
    </div>
  );
}

export default SinglePage;
