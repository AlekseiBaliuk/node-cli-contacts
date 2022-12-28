const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "db", "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    console.table(parsedData);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    const contactById = parsedData.filter(
      (contact) => contact.id === contactId
    );
    if (!contactById.length) {
      throw new Error(`No matches with id ${contactId}`);
    }
    console.table(contactById);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);
    const filteredData = parsedData.filter(
      (contact) => contact.id !== contactId
    );

    const findContact = parsedData.findIndex(
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
    const data = await fs.readFile(contactsPath, "utf-8");
    const parsedData = JSON.parse(data);

    const contactToAdd = {
      id: v4(),
      name,
      email,
      phone,
    };

    const newData = [...parsedData, contactToAdd];

    await fs.writeFile(contactsPath, JSON.stringify(newData, null, 2));
    console.table(newData);
    console.log("\x1B[31m Successfully added");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
