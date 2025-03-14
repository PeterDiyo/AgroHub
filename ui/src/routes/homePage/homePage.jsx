import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/authContext";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Explore Healthy and Best Agri Products</h1>
          <p>
            Welcome to AgroHub, your premier marketplace for agricultural
            products and connections. With our real-time chat feature, you can
            instantly communicate with agricultural enthusiasts, negotiate
            prices, and build lasting business relationships in the agricultural
            sector.
          </p>
          <SearchBar />
          <div className="boxes">
            <div className="box">
              <h1>11+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>100</h1>
              <h2>Awards Gained</h2>
            </div>
            <div className="box">
              <h1>3000+</h1>
              <h2>Products Ready</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="imgContainer">
        <img src="/home.jpg" alt="" />
      </div>
    </div>
  );
}

export default HomePage;
