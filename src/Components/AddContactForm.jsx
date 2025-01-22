import React, { useState } from "react";

const AddContactForm = ({ onAddContact, onClose }) => {
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required.";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.name =
            "Name must not contain special characters or numbers.";
        } else {
          delete newErrors.name;
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Invalid email format.";
        } else {
          delete newErrors.email;
        }
        break;

      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.phone = "Phone number must be exactly 10 digits.";
        } else {
          delete newErrors.phone;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({ ...contactData, [name]: value });
    validateField(name, value); // Validate field live as user types
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          image: "Only JPEG, JPG, and PNG files are allowed.",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 2MB." });
        return;
      }

      setContactData({ ...contactData, image: file });
      setErrors({ ...errors, image: "" });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, phone, image } = contactData;
    const newErrors = {};

    // Final validation before submission
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!image) newErrors.image = "Profile image is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const contactWithImage = { ...contactData, image: reader.result };
        onAddContact(contactWithImage);
        onClose();
      };
      reader.readAsDataURL(image);
    }
  };

  const getInputClassName = (fieldName) => {
    return errors[fieldName]
      ? "w-full p-2 mb-2 border border-red-500 rounded-md"
      : "w-full p-2 mb-2 border border-gray-300 rounded-md";
  };

  return (
    <div className="add-contact-modal fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="modal-content bg-white p-6 rounded-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={contactData.name}
              onChange={handleChange}
              placeholder="Name"
              className={getInputClassName("name")}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          {/* Email input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={contactData.email}
              onChange={handleChange}
              placeholder="Email"
              className={getInputClassName("email")}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>

          {/* Phone input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={contactData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={getInputClassName("phone")}
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">{errors.phone}</span>
            )}
          </div>

          {/* Image upload input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleImageChange}
              className={getInputClassName("image")}
            />
            {errors.image && (
              <span className="text-red-500 text-sm">{errors.image}</span>
            )}
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4 mb-6 flex justify-center">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full"
              />
            </div>
          )}

          <div className="mt-4 flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Add Contact
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactForm;
