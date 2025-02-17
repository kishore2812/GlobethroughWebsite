import loadingGif from "../../assets/images/flight animation.gif"; // Import the GIF from the assets folder
import "./FullPageLoading.scss"; // Import the SCSS file

const FullPageLoading = () => {
  return (
    <div className="full-page-loading">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default FullPageLoading;
