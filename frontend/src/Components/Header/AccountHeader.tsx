import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiLogOut } from "react-icons/fi"; // Log out icon
import { MdArrowBack, MdEdit } from "react-icons/md"; // Back arrow icon
import defaultProfileImage from "../../assets/images/defaultprofileimage.webp"; // Import default image
import "./AccountHeader.scss"; // Import SCSS file

const AccountHeader: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle navigating back
  const handleBack = (): void => {
    navigate(-1); // Go back to the previous page
  };

  // Handle sign out
  const handleSignOut = (): void => {
    localStorage.removeItem("token"); // Clear the authentication token
    navigate("/signin"); // Redirect to sign-in page
  };

  // Fetch profile image when component mounts
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/get-user-profile",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Check if profile image exists in the database, if so, set it
        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage); // Set the profile image from the DB
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []); // Empty array to only run once when component mounts

  // Handle profile image change (upload)
  const handleProfileImageChange = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        try {
          setUploading(true);
          // Send the base64 image to the backend
          const response = await axios.post(
            "http://localhost:5000/api/upload-image",
            { profileImage: base64Image },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          // Update the profile image URL with the backend response
          setProfileImage(response.data.profileImage);
        } catch (error) {
          console.error("Error uploading profile image:", error);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };

  return (
    <header className="accountheader-header">
      {/* Back Arrow */}
      <MdArrowBack className="accountheader-back-arrow" onClick={handleBack} />

      {/* Profile Image Section */}
      <div className="accountheader-profile-image-container">
        <label htmlFor="profileImageInput">
          <img
            src={profileImage}
            alt="Profile"
            className="accountheader-profile-image"
          />
          <div className="accountheader-edit-icon">
            <MdEdit />
          </div>
        </label>
        <input
          type="file"
          id="profileImageInput"
          accept="image/*"
          onChange={handleProfileImageChange}
          style={{ display: "none" }}
        />
        {uploading && (
          <span className="accountheader-uploading">Uploading...</span>
        )}
      </div>

      {/* Sign Out Button */}
      <button className="accountheader-sign-out-button" onClick={handleSignOut}>
        <FiLogOut size={18} />
        Signout
      </button>
    </header>
  );
};

export default AccountHeader;
