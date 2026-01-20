import { FormConfig } from './FormBuilder.type';

const config: FormConfig = {
  "title": "User Profile Form",
  "fields": [
    {
      "id": "firstName",
      "label": "First Name",
      "type": "text",
      "placeholder": "Enter your first name"
    },
    {
      "id": "middleName",
      "label": "Middle Name",
      "type": "text",
      "placeholder": "Enter your middle name"
    },
    {
      "id": "lastName",
      "label": "Last Name",
      "type": "text",
      "placeholder": "Enter your last name"
    },
    {
      "id": "gender",
      "label": "Gender",
      "type": "dropdown",
      "options": [
        { "label": "Male", "value": "male" },
        { "label": "Female", "value": "female" },
        { "label": "Other", "value": "other" }
      ]
    },
    {
      "id": "birthDate",
      "label": "Date of Birth",
      "type": "date"
    },
    {
      "id": "amount",
      "label": "Amount",
      "type": "number",
      "placeholder": "Insurance Amount"
    },
    {
      "id": "age",
      "label": "Age",
      "type": "number",
      "placeholder": "Enter your age"
    },
    {
      "id": "dataForXYZInsuranceCompany",
      "label": "Data for Admin",
      "type": "text",
      "adminOnly": true
    },
    {
      "id": "addresses",
      "label": "Addresses",
      "type": "multiple",
      "fields": [
        {
          "id": "street",
          "label": "Street",
          "type": "text",
          "placeholder": "Enter street"
        },
        {
          "id": "city",
          "label": "City",
          "type": "text",
          "placeholder": "Enter city"
        },
        {
          "id": "type",
          "label": "Address Type",
          "type": "dropdown",
          "options": [
            { "label": "Home", "value": "home" },
            { "label": "Work", "value": "work" }
          ]
        }
      ]
    }
  ]
};

export default config;
