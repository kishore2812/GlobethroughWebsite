import loadingGif from "../../assets/images/flight animation.gif"; // Import the GIF from the assets folder
import "./FullPageLoading.scss"; // Import the SCSS file

const FullPageLoading = () => {
  return (
    <div className="full-page-loading">
      <img src={loadingGif} alt="Loading..." className="loading-gif" />
      <p className="loading-text">Searching for the Flights</p>
      <p>Sit back and relax as we scan for the perfect flights just for you.</p>
    </div>
  );
};

export default FullPageLoading;
