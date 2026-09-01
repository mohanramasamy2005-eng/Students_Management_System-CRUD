const DUPLICATE_FIELDS = [
  { key: "roll_no", field: "roll number", label: "Roll Number" },
  { key: "email", field: "email", label: "Email" },
  { key: "phone", field: "phone", label: "Phone" },
];

const normalizeValue = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getDuplicateDetail = (payload = {}, existing = {}) => {
  for (const candidate of DUPLICATE_FIELDS) {
    const incoming = normalizeValue(payload[candidate.key]);
    const current = normalizeValue(existing[candidate.key]);

    if (!incoming || !current) continue;
    if (incoming === current) {
      return {
        key: candidate.key,
        field: candidate.field,
        label: candidate.label,
        value: payload[candidate.key],
      };
    }
  }

  return null;
};

const buildDuplicateMessage = ({ field, label }) => {
  const formattedField = (label || field || "detail").toLowerCase();

  if (field === "roll number") {
    return "This roll number is already in use. Please enter a different roll number.";
  }

  if (field === "email") {
    return "This email is already in use. Please enter a different email.";
  }

  if (field === "phone") {
    return "This phone number is already in use. Please enter a different phone number.";
  }

  return `This ${formattedField} is already in use. Please enter a different ${formattedField}.`;
};

module.exports = {
  DUPLICATE_FIELDS,
  getDuplicateDetail,
  buildDuplicateMessage,
};
