const test = require("node:test");
const assert = require("node:assert/strict");

const {
  getDuplicateDetail,
  buildDuplicateMessage,
} = require("./duplicateCheck");

test("detects duplicate roll number", () => {
  const existing = {
    roll_no: "21CS001",
    email: "alice@example.com",
    phone: "9876543210",
  };

  assert.deepEqual(
    getDuplicateDetail(
      { roll_no: "21CS001", email: "new@example.com", phone: "1234567890" },
      existing,
    ),
    {
      key: "roll_no",
      field: "roll number",
      value: "21CS001",
      label: "Roll Number",
    },
  );

  assert.equal(
    buildDuplicateMessage({ field: "roll number", value: "21CS001" }),
    "This roll number is already in use. Please enter a different roll number.",
  );
});

test("detects duplicate email", () => {
  const existing = {
    roll_no: "21CS002",
    email: "alice@example.com",
    phone: "9876543210",
  };

  assert.deepEqual(
    getDuplicateDetail(
      { roll_no: "21CS005", email: "alice@example.com", phone: "1234567890" },
      existing,
    ),
    {
      key: "email",
      field: "email",
      value: "alice@example.com",
      label: "Email",
    },
  );

  assert.equal(
    buildDuplicateMessage({ field: "email", value: "alice@example.com" }),
    "This email is already in use. Please enter a different email.",
  );
});

test("detects duplicate phone when provided", () => {
  const existing = {
    roll_no: "21CS002",
    email: "bob@example.com",
    phone: "9876543210",
  };

  assert.deepEqual(
    getDuplicateDetail(
      { roll_no: "21CS005", email: "carol@example.com", phone: "9876543210" },
      existing,
    ),
    {
      key: "phone",
      field: "phone",
      value: "9876543210",
      label: "Phone",
    },
  );

  assert.equal(
    buildDuplicateMessage({ field: "phone", value: "9876543210" }),
    "This phone number is already in use. Please enter a different phone number.",
  );
});
