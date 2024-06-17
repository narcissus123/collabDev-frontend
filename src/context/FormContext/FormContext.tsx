import { ReactNode, createContext, useContext, useState } from "react";

import { getDefaultValues } from "../../configs/defaultValues/defauleValues";
import { ProjectForm } from "../../configs/types/projectTypes";

interface FormContextProps {
  data: ProjectForm;
  updateFormData: (updated: ProjectForm) => void;
}

const FormContext = createContext<FormContextProps>({
  data: getDefaultValues(),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateFormData: (updated: ProjectForm) => {},
});

interface formProviderProps {
  children: ReactNode;
}

export const FormProvider = ({ children }: formProviderProps) => {
  const [data, setData] = useState<ProjectForm>(getDefaultValues());

  const updateFormData = (updated: ProjectForm) => {
    setData((prev) => ({ ...prev, ...updated }));
  };

  return (
    <FormContext.Provider value={{ updateFormData, data }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  return useContext(FormContext);
};
