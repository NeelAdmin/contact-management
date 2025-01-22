import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
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
  const [contactsPerPage] = useState(9);
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

  // Pagination logic
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  const totalPages = Math.ceil(contacts.length / contactsPerPage);

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
            image: contact.Image || "",
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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">
          Welcome, {currentUser?.name || "User"}!
        </h1>
        <button
          className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Contacts</h2>
          <div className="flex gap-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => setShowAddForm(true)}
            >
              Add Contact
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleExportContacts}
            >
              Export Contacts
            </button>
            <div className="relative">
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                onClick={() =>
                  document.getElementById("importFileInput").click()
                }
              >
                Import Contacts
              </button>
              <input
                type="file"
                id="importFileInput"
                accept=".xlsx"
                className="hidden"
                onChange={handleImportContacts}
              />
            </div>
          </div>
        </div>

        {contacts.length === 0 ? (
          <p className="text-gray-600 text-center">No contacts to show.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={contact.image || ""}
                  alt={`${contact.name}'s Profile`}
                  className="w-24 h-24 rounded-full object-cover mb-4"
                />
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{contact.name}</h3>
                  <p className="text-sm text-gray-600">
                    Email: {contact.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {contact.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => handleOpenEditForm(contact)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-l hover:bg-blue-600 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="px-4 py-2 text-gray-700 mt-2">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {showAddForm && (
        <AddContactForm
          onAddContact={handleAddContact}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {showEditForm && (
        <EditContactForm
          contact={editingContact}
          onEditContact={handleEditContact}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </div>
  );
};

export default ContactPage;
