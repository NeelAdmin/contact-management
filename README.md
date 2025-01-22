# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

ok i think for now all functionalities are working well but ,can you explain me whole code line by line ,word by word cause I have syntaxtual knowledge but my mind is not working in logical things so

<!-- contact page with Page navigation -->

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import \* as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import AddContactForm from "../Components/AddContactForm";
import EditContactForm from "../Components/EditContactForm";

const ContactPage = () => {
const [contacts, setContacts] = useState([]);
const [currentUser, setCurrentUser] = useState(null);
const [showAddForm, setShowAddForm] = useState(false);
const [showEditForm, setShowEditForm] = useState(false);
const [editingContact, setEditingContact] = useState(null);
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(5); // Adjust as necessary
const navigate = useNavigate();

useEffect(() => {
const loggedIn = document.cookie.includes("isLoggedIn=true");
const user = JSON.parse(localStorage.getItem("currentUser"));
if (!loggedIn || !user) {
navigate("/");
} else {
setCurrentUser(user);
const userContacts = JSON.parse(localStorage.getItem("contacts")) || {};
setContacts(userContacts[user.email] || []);
}
}, [navigate]);

const handleLogout = () => {
document.cookie = "isLoggedIn=false; path=/";
localStorage.removeItem("currentUser");
navigate("/");
};

const handleAddContact = (newContact) => {
const userContacts = JSON.parse(localStorage.getItem("contacts")) || {};
const updatedContacts = [
...(userContacts[currentUser.email] || []),
{ ...newContact, id: uuidv4() },
];
userContacts[currentUser.email] = updatedContacts;
localStorage.setItem("contacts", JSON.stringify(userContacts));
setContacts(updatedContacts);
setShowAddForm(false);
};

const handleEditContact = (updatedContact) => {
const userContacts = JSON.parse(localStorage.getItem("contacts")) || {};
const updatedContacts = userContacts[currentUser.email].map((contact) =>
contact.id === updatedContact.id ? updatedContact : contact
);
userContacts[currentUser.email] = updatedContacts;
localStorage.setItem("contacts", JSON.stringify(userContacts));
setContacts(updatedContacts);
setShowEditForm(false);
};

const handleDeleteContact = (contactId) => {
const confirmation = window.confirm(
"Are you sure you want to delete this contact?"
);
if (confirmation) {
const userContacts = JSON.parse(localStorage.getItem("contacts")) || {};
const updatedContacts = userContacts[currentUser.email].filter(
(contact) => contact.id !== contactId
);
userContacts[currentUser.email] = updatedContacts;
localStorage.setItem("contacts", JSON.stringify(userContacts));
setContacts(updatedContacts);
}
};

const handleOpenEditForm = (contact) => {
setEditingContact(contact);
setShowEditForm(true);
};

const handleExportContacts = () => {
const sanitizedContacts = contacts.map(({ name, email, phone, image }) => ({
Name: name,
Email: email,
Phone: phone,
Image: image || "https://via.placeholder.com/150",
}));

    const worksheet = XLSX.utils.json_to_sheet(sanitizedContacts);

    Object.keys(worksheet).forEach((key) => {
      if (worksheet[key].v && worksheet[key].v.length > 32767) {
        worksheet[key].v = worksheet[key].v.substring(0, 32767);
      }
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    XLSX.writeFile(workbook, `${currentUser.email}_contacts.xlsx`);

};

const handleImportContacts = (e) => {
const file = e.target.files[0];
if (file) {
const reader = new FileReader();
reader.onload = (event) => {
const data = new Uint8Array(event.target.result);
const workbook = XLSX.read(data, { type: "array" });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const importedContacts = XLSX.utils.sheet_to_json(worksheet);

        if (Array.isArray(importedContacts)) {
          const updatedContacts = importedContacts.map((contact) => ({
            id: uuidv4(),
            name: contact.Name || "Unknown",
            email: contact.Email || "Unknown",
            phone: contact.Phone || "Unknown",
            image:
              contact.Image ||
              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXh4eGjo6OgoKDk5OTd3d2mpqbY2Ni1tbXV1dXIyMipqamurq69vb3Pz8/CwsKdnZ2sOJR4AAAE30lEQVR4nO2d2ZaDIAxAK2FH9P//dsDavdMKCoSe3KeZeeKeACImmdOJIAiCIAiCIAiCIAiC+GEAXn/qkjB6LrU3C15LvvypS+CkzaQcG9jCwJyajO5TR/rRiShxJfwi3Ohl65GlAtwocS9yExLK8J6iA2Dcq8cNZ/rZDECq4U1Q7sIzKNmHDYC3n0zOWN9DcOA0vlsrr2tn7GBf4+MGlUVn5K3H+g2uNroEG4XbBjbHZY0N6pk2JbgEm6n1eD8AJskl2Bi8odEizWUYhG495v9IWPzX0GDdBCBtwaw2E8qJBtLmyFiUBxsY01UiI0IZ0DmBiaHRCG2m5K3sjED4sMnYytbQ4NvQwGcGJoTGo5tnOfvyGhp08yx7lmGcZ9rlyzhsZ5r8JRMXTevRP2HyXYbBtB79E/nrH98OkPSG+SKD7TZgn0zr0T+yY2fGtzeTDMnU4Jc2gJ96zvzWCWDLZ4z/sMjOZiD3nJqxXdDsOM+gO82kXzPfyaC7cAadvWgQ3jX90u1M2Jxz782wbcyRzP0s7GWtR/6OKS8y2B7/Z/jHrIz/cAhXzClzd8a3L6+ASpdRSF3CRBOpH2gFzkkWAZ8aGHx35jcSlw3aBbMyfU7OelBBuivfsdmmA5cT32gTXPAu/htmy5daZjEeyd6g3fzNZbaY97F74GuuBps6SAO8APJz9iy2l/7PAHj1z/uNUF3kmj4AoCdll9T5dWrFn6yadHcqEQCup1E5KxasU+OkeZcqCxCEpF/KNLyXQaRbk5XVoH8RgiAIgiAIgiCITnnzOtbjG9ryXsm51Nr7y2uz91pLzvt66QxD5Vx7Ey8znBUDY3OAsUFYFy81jNdBqQOheIOhfdQQ5wYNTzeZy59EVPIa9/1GFDEXj4+3s6uRQXrzFENiRme/eTwaWTcadAECkEZlZgJZZSQinRATN2wNyLsQDQ5JWw0ArYav32O+MQ8KwR20NHberbLozNa0TAmKF+M2f3o9w5iNF+uNZPQo5sNUFp1ZjC1KtiCqHBeVqw6LOrWjI4+cYI86dqq8dowro3LWcRU/q4NUqelLiTqiXscgn1dfnqRTKaUedtUwbKdKxpM65Bn5nVn9jksFG17PJdqUzHuCXaVl6TBV8nST2fMjn4LVaLnp/vkUKxTYU72US7mqp8xk/30USuTc0Ywhn1JtHPILsXbZFFk1lbflq0yRh01+Udk+bIl5Vul8+UqJedZmyRRaND8VmZ/aAH7rOdNmopU6nPHqh+ZwbC72SlP9pFmyInVTJ+YjKVrLkV4ht4+ydSlZjT9zKd4wFPb0ZEl0qdBhc6x1b1ahGw2cMop+c1A1vmykdcvOpVaXbajx8KzWMbx8bOp2Py+7Q1du3lT2u0bt+u0dvWa/0aAXban7zVadm8bjv2wy0axx2+f/MpNDze/Mz8hDgxPC0jZ7xh93zcGUb52oJSdxTFaTqJ2Y8RY97k8HYnOTDKA3gFb7kk8YU4h6nIF3+dFhs8PVtgEgd2OLW1j7hMYnAPgUM5qTRAbhJqypzaf4H/SGra1ahvi/9RCn0cOJ+7U/w0eRc88Gz7EXbQSfJYfeitdSgHMxwNKzwWj0JmdimcZapWFXgVXMXqo0EM+uV5axrvUzZuVaP9OVyY2nmgVsJQwEQRAEQRAEQRAEQRDEkfwBfaQ7JeMptiMAAAAASUVORK5CYII=",
          }));

          const userContacts =
            JSON.parse(localStorage.getItem("contacts")) || {};
          userContacts[currentUser.email] = [
            ...(userContacts[currentUser.email] || []),
            ...updatedContacts,
          ];

          localStorage.setItem("contacts", JSON.stringify(userContacts));
          setContacts(userContacts[currentUser.email]);
          alert("Contacts imported successfully!");
        } else {
          alert("Invalid file format. Please upload a valid Excel file.");
        }
      };
      reader.readAsArrayBuffer(file);
    }

};

// Pagination logic
const totalPages = Math.ceil(contacts.length / itemsPerPage);
const indexOfLastContact = currentPage \* itemsPerPage;
const indexOfFirstContact = indexOfLastContact - itemsPerPage;
const currentContacts = contacts.slice(
indexOfFirstContact,
indexOfLastContact
);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

return (
<div className="min-h-screen bg-gray-100 text-gray-800">
<div className="flex justify-between items-center bg-blue-600 text-white p-4">
<h1 className="text-2xl font-bold">Welcome, {currentUser?.name}</h1>
<button
          onClick={handleLogout}
          className="bg-red-600 p-2 rounded hover:bg-red-700"
        >
Logout
</button>
</div>

      <div className="container mx-auto p-4">
        <div className="flex justify-between mb-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Add Contact
          </button>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImportContacts}
            className="py-2 px-4 rounded"
          />
          <button
            onClick={handleExportContacts}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Export Contacts
          </button>
        </div>

        {/* Add/Edit Forms */}
        {showAddForm && <AddContactForm onSubmit={handleAddContact} />}
        {showEditForm && (
          <EditContactForm
            contact={editingContact}
            onSubmit={handleEditContact}
          />
        )}

        {/* Contacts List */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentContacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="py-2 px-4">{contact.name}</td>
                  <td className="py-2 px-4">{contact.email}</td>
                  <td className="py-2 px-4">{contact.phone}</td>
                  <td className="py-2 px-4 flex space-x-2">
                    <button
                      onClick={() => handleOpenEditForm(contact)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="bg-gray-600 text-white py-1 px-3 rounded mr-2 disabled:bg-gray-300"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`py-1 px-3 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="bg-gray-600 text-white py-1 px-3 rounded ml-2 disabled:bg-gray-300"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>

);
};

export default ContactPage;
