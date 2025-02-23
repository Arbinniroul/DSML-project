// types.ts
// Define an interface for form controls
export interface FormControl {
    name: string;
    id: string;
    placeholder: string;
    label: string;
    componentType: 'input' | 'select' | 'textarea'; // You can add more types as needed
    type?: string; // Optional, since only inputs may need this
  }
  
  // loginComponent.ts
  export const loginComponent: FormControl[] = [
    {
      name: 'email',
      id: 'email',
      placeholder: 'Enter your email',
      label: 'Email',
      componentType: 'input',
      type: 'email',
    },
    {
      name: 'password',
      id: 'password',
      placeholder: 'Enter your password',
      label: 'Password',
      componentType: 'input',
      type: 'password',
    },
  ];
  
  // registerComponent.ts
  export const registerComponent: FormControl[] = [
    {
      name: 'name',
      id: 'name',
      placeholder: 'Enter your name',
      label: 'Name',
      componentType: 'input',
      type: 'text',
    },
    {
      name: 'email',
      id: 'email',
      placeholder: 'Enter your email',
      label: 'Email',
      componentType: 'input',
      type: 'email',
    },
    {
      name: 'password',
      id: 'password',
      placeholder: 'Enter your password',
      label: 'Password',
      componentType: 'input',
      type: 'password',
    },
  ];
  