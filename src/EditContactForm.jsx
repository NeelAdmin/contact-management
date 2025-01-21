// import React, { useState } from "react";

// const EditContactForm = ({ contact, onSave, onCancel }) => {
//   const [formData, setFormData] = useState({
//     name: contact.name,
//     email: contact.email,
//     phone: contact.phone,
//     image: contact.image, // Persist the current image
//   });

//   const [previewImage, setPreviewImage] = useState(contact.image); // Show current image preview
//   const [errors, setErrors] = useState({
//     name: "",
//     email: "",
//     phone: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: "" });
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 2 * 1024 * 1024) {
//         alert("File size must be less than 2MB.");
//         return;
//       }
//       setPreviewImage(URL.createObjectURL(file));
//       setFormData({ ...formData, image: file }); // Update image
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const { name, email, phone } = formData;
//     let validationErrors = { ...errors };

//     // Validate fields
//     if (!name) validationErrors.name = "Name is required!";
//     if (!email) validationErrors.email = "Email is required!";
//     if (!phone) validationErrors.phone = "Phone is required!";

//     if (Object.values(validationErrors).some((error) => error !== "")) {
//       setErrors(validationErrors);
//       return;
//     }

//     // Check if a new image is uploaded, otherwise retain the existing one
//     const updatedContact = {
//       ...formData,
//       image: formData.image instanceof File ? formData.image : contact.image, // Retain old image if not updated
//     };

//     onSave(updatedContact);
//   };

//   return (
//     <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-xl font-bold mb-4">Edit Contact</h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className={`mt-1 block w-full rounded-md border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.name && (
//               <span className="text-red-500 text-sm">{errors.name}</span>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className={`mt-1 block w-full rounded-md border ${
//                 errors.email ? "border-red-500" : "border-gray-300"
//               } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.email && (
//               <span className="text-red-500 text-sm">{errors.email}</span>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Phone <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               className={`mt-1 block w-full rounded-md border ${
//                 errors.phone ? "border-red-500" : "border-gray-300"
//               } shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
//             />
//             {errors.phone && (
//               <span className="text-red-500 text-sm">{errors.phone}</span>
//             )}
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Profile Image
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {previewImage && (
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 className="mt-4 w-24 h-24 rounded-full object-cover"
//               />
//             )}
//           </div>

//           <div className="flex justify-end space-x-2">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EditContactForm;

import React, { useState } from "react";

const EditContactForm = ({ contact, onEditContact, onClose }) => {
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone,
    image: contact.image,
  });

  const [preview, setPreview] = useState(contact.image);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditContact(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-semibold mb-4">Edit Contact</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="border p-2 rounded w-full bg-gray-200 cursor-not-allowed"
            />
          </label>
          <label>
            Phone:
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </label>
          <label>
            Profile Image:
            <input
              type="file"
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 w-24 h-24 object-cover rounded-full"
              />
            )}
          </label>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactForm;
