const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contactById = contacts.find((contact) => contact.id === contactId);
    if (!contactById) {
      return null;
    }
    return contactById;
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    const filteredData = contacts.filter((contact) => contact.id !== contactId);

    const findContact = contacts.findIndex(
      (contact) => contact.id === contactId
    );
    if (findContact === -1) {
      console.log(`\x1B[31m No contact with id ${contactId}`);
      return;
    }
    await fs.writeFile(contactsPath, JSON.stringify(filteredData, null, 2));
    console.table(filteredData);
    console.log("\x1B[31m Successfully deleted");
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();

    const contactToAdd = {
      id: v4(),
      name,
      email,
      phone,
    };

    const newData = [...contacts, contactToAdd];

    await fs.writeFile(contactsPath, JSON.stringify(newData, null, 2));
    return newData;
  } catch (error) {
    console.log(error);
  }
}

async function updateContact(id, name, email, phone) {
  try {
    const contacts = await listContacts();

    const idx = contacts.findIndex(contact => contact.id === id);
    if (idx === -1) {
      return null;
    }

    contacts[idx] = {id, name, email, phone};

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[idx];
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact
};
