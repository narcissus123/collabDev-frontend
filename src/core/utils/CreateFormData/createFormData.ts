export const createFormData = (
  data: any,
  images?: { files: File[] | string[]; name: string },
  image?: { file: File[] | string[]; name: string }
) => {
  const formData = new FormData();
  if (images) {
    if (images?.files.length === 0) {
      formData.append(images?.name, "[]");
    } else {
      images?.files?.forEach((img) => {
        formData.append(images?.name, img);
      });
    }
  }

  if (image) {
    if (image?.file.length === 0) {
      formData.append(image?.name, "[]");
    } else {
      formData.append(image?.name, image?.file[0]);
    }
  }

  Object.keys(data).forEach((key) => {
    if (key !== image?.name && key !== images?.name) {
      const keyValue = (data as any)[key];

      if (Array.isArray(keyValue)) {
        if (keyValue.length === 0) {
          formData.append(`${key}`, JSON.stringify([]));
        } else {
          formData.append(`${key}`, JSON.stringify(keyValue));
        }
      } else if (typeof keyValue === "object" && !Array.isArray(keyValue)) {
        const obj = keyValue;
        if (keyValue?.$isDayjsObject) {
          formData.append(key, keyValue.toISOString());
        } else {
          formData.append(`${key}`, JSON.stringify(obj) as any);
        }
      } else if (JSON.stringify(keyValue) === "{}") {
        formData.append(`${key}`, JSON.stringify({}));
      } else {
        formData.append(key, keyValue);
      }
    }
  });

  return formData;
};
