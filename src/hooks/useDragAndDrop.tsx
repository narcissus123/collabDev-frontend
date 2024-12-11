import { useState, useCallback, Dispatch, SetStateAction } from "react";
import { UseFormSetValue } from "react-hook-form";

type HookReturnValue = [
  (acceptedFiles: File[]) => void,
  File[],
  Dispatch<SetStateAction<File[]>>,
];

export const useDragAndDrop = (
  multipleImages: boolean,
  setValue: UseFormSetValue<any>,
  fieldName: string,
  imagesDefaultValue: any[] | []
): HookReturnValue => {
  const [images, setImages] = useState<File[]>(imagesDefaultValue);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
      });

      if (multipleImages) {
        const newImages = [...images, ...acceptedFiles];
        setImages(newImages);
        setValue(fieldName, newImages);
      } else {
        setImages([acceptedFiles[0]]);
        setValue(fieldName, [acceptedFiles[0]]);
      }
    },
    [multipleImages, setValue, fieldName, images]
  );

  return [onDrop, images, setImages];
};
