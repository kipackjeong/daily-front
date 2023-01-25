import { FormLabel, Input, Select } from "@chakra-ui/react";
import useForm from "../hooks/useForm";

// TODO: 1/15/2023 integrate generic UI Form.
const Form = ({ fields, onSubmit, onCancel }) => {
  const formHook = useForm({}, onSubmit);

  return (
    <form onSubmit={formHook.handleSubmit}>
      {fields.map((field) => (
        <div key={field.name}>
          {field.type == "text-input" && (
            <>
              <Input
                ref={field.ref}
                width="100%"
                placeholder=" "
                defaultValue={field.defaultValue}
              />

              <FormLabel>{field.name}</FormLabel>
            </>
          )}

          {field.type == "selection" && (
            <>
              <Select
                style={{ width: "300px" }}
                variant="outline"
                placeholder="Outline"   
              >
                {field.options.map((c) => (
                  <option key={c.code} value={c.name}>
                    {" "}
                    {c.code}
                  </option>
                ))}
              </Select>

              <FormLabel>{field.name}</FormLabel>
            </>
          )}

          {field.type == "custom" && field.component}

          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={formHook.formData[field.name] || ""}
            onChange={formHook.handleChange}
            required={field.required}
          />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
