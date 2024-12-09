import { useState } from "react";
import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";

type HookReturnValue = [(acceptedFiles: File[]) => void, File[]];

export const useDragAndDrop = (
  multipleImages: boolean,
  setValue: UseFormSetValue<any>,
  fieldName: string,
  imagesDefaultValue: File[] | []
): HookReturnValue => {
  // Saving image from the file system.
  const [images, setImages] = useState<File[]>(imagesDefaultValue);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedImages = acceptedFiles.map((file) => {
        const reader = new FileReader();

        reader.onabort = () =>
          //console.log("File reading was aborted for:", file.name);
        reader.onerror = () =>
          //console.log("File reading has failed for:", file.name);
        reader.onload = function () {
          multipleImages === true
            ? setImages((prevImages) => [...prevImages, file])
            : setImages([file]);
        };

        reader.readAsDataURL(file);

        return file;
      });

      multipleImages === true
        ? setValue(fieldName, [...imagesDefaultValue, ...updatedImages])
        : setValue(fieldName, updatedImages);

      multipleImages === true
        ? setValue(fieldName, images)
        : setValue(fieldName, images);
    },
    [multipleImages, setValue, fieldName, images]
  );

  return [onDrop, images];
};
