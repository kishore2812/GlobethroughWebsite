import React, { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FiLogOut } from "react-icons/fi"; // Log out icon
import { MdArrowBack, MdEdit } from "react-icons/md"; // Back arrow and edit icon
import "./AccountHeader.scss"; // Import SCSS file

// Import the default profile image
import defaultProfileImage from "../../assets/images/defaultprofileimage.webp";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const AccountHeader: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImage);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  // Decode the token to fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decodedToken: { userType: string } = jwtDecode(token);

          // Fetch data based on userType
          const endpoint =
            decodedToken.userType === "user"
              ? "http://localhost:5000/api/user/info"
              : "http://localhost:5000/subuser/subuserinfo";

          const response = await axios.get(endpoint, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setUserData({
            firstName: response.data.firstName || "John",
            lastName: response.data.lastName || "Doe",
            email: response.data.email || "example@gmail.com",
            phone: response.data.phone || "xxxxx",
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

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

        if (response.data.profileImage) {
          setProfileImage(response.data.profileImage); // Use DB image if available
        } else {
          setProfileImage(defaultProfileImage); // Use default image if not found
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

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

          // Update the profile image URL with the response from the backend
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

  // Handle navigating back
  const handleBack = (): void => {
    navigate(-1); // Go back to the previous page
  };

  // Handle sign out
  const handleSignOut = (): void => {
    localStorage.clear();
    navigate("/signin/:role"); // Redirect to sign-in page
    window.location.reload();
  };

  return (
    <div className="accountheader-container">
      <header className="accountheader-header">
        {/* Back Arrow */}
        <MdArrowBack
          className="accountheader-back-arrow"
          onClick={handleBack}
        />

        {/* Profile Image Section */}
        <div className="accountheader-profile-image-container">
          <label htmlFor="profileImageInput">
            <img
              src={profileImage}
              alt="Profile"
              className="accountheader-profile-image"
            />
            <div className="accountheader-edit-icon">
              <MdEdit size={18} />
            </div>
          </label>
          <input
            type="file"
            id="profileImageInput"
            accept="image/*"
            onChange={handleProfileImageChange}
            style={{ display: "none" }}
          />
          {uploading && <span className="accountheader-uploading"></span>}
        </div>

        {/* Sign Out Button */}
        <button
          className="accountheader-sign-out-button"
          onClick={handleSignOut}
        >
          <FiLogOut size={18} />
          Signout
        </button>
      </header>

      {/* User Info Section */}
      <div className="accountheader-user-info">
        <h2 className="accountheader-user-name">
          {userData.firstName} {userData.lastName}
        </h2>
        <p className="accountheader-user-email">{userData.email}</p>
      </div>
    </div>
  );
};

export default AccountHeader;
