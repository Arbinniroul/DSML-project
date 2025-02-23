import React from 'react';

interface CommonFormProps {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
  name: string;
  id: string;
  value: string;
  placeholder?: string;
}

const CommonForm: React.FC<CommonFormProps> = ({
  label,
  onChange,
  type = 'text',
  name,
  id,
  value,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-gray-800">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 shadow-md hover:shadow-lg"
      />
    </div>
  );
};

interface FormControl {
  id: string;
  label: string;
  name: string;
  componentType: string;
  type?: string;
  placeholder?: string;
}

interface CombinedFormProps {
  formControls: FormControl[];
  formData: Record<string, string>;
  setFormData: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  buttonText?: string;
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const CombinedForm: React.FC<CombinedFormProps> = ({
  formControls,
  formData,
  setFormData,
  buttonText,
  onHandleSubmit,
}) => {
  return (
    <form onSubmit={onHandleSubmit} className="space-y-5 w-full">
      {formControls.map((control) => (
        <CommonForm
          key={control.id}
          label={control.label}
          name={control.name}
          id={control.id}
          type={control.type}
          placeholder={control.placeholder}
          value={formData[control.name] || ''} // Ensure value defaults to an empty string if undefined
          onChange={(e) =>
            setFormData((prevData) => ({
              ...prevData,
              [e.target.name]: e.target.value,
            }))
          }
        />
      ))}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-200 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {buttonText || 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default CombinedForm;
