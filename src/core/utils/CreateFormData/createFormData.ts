// export const createFormData = (
//   data: any,
//   images?: { files: File[] | string[]; name: string },
//   image?: { file: File[] | string[]; name: string }
// ) => {
//   const formData = new FormData();
//   if (images) {
//     if (images?.files.length === 0) {
//       formData.append(images?.name, "[]");
//     } else {
//       images?.files?.forEach((img) => {
//         formData.append(images?.name, img);
//       });
//     }
//   }

//   if (image) {
//     if (image?.file.length === 0) {
//       formData.append(image?.name, "[]");
//     } else {
//       formData.append(image?.name, image?.file[0]);
//     }
//   }

//   Object.keys(data).forEach((key) => {
//     if (key !== image?.name && key !== images?.name) {
//       const keyValue = (data as any)[key];

//       if (Array.isArray(keyValue)) {
//         if (keyValue.length === 0) {
//           formData.append(`${key}`, JSON.stringify([]));
//         } else {
//           formData.append(`${key}`, JSON.stringify(keyValue));
//         }
//       } else if (typeof keyValue === "object" && !Array.isArray(keyValue)) {
//         const obj = keyValue;
//         if (keyValue?.$isDayjsObject) {
//           formData.append(key, keyValue.toISOString());
//         } else {
//           formData.append(`${key}`, JSON.stringify(obj) as any);
//         }
//       } else if (JSON.stringify(keyValue) === "{}") {
//         formData.append(`${key}`, JSON.stringify({}));
//       } else {
//         formData.append(key, keyValue);
//       }
//     }
//   });

//   return formData;
// };

export const createFormData = (
  data: any,
  images?: { files: File[] | string[]; name: string },
  image?: { file: File[] | string[]; name: string }
) => {
  const formData = new FormData();

  // Log initial data input
  console.log("Creating FormData with input data:", data);
  console.log("Creating FormData with input images:", images);
  console.log("Creating FormData with input image:", image);
  if (images) {
    console.log("Images provided:", images);
    if (images?.files.length === 0) {
      console.log(`Appending empty array for key '${images?.name}'`);
      formData.append(images?.name, "[]");
    } else {
      images?.files?.forEach((img, index) => {
        console.log(
          `Appending image #${index + 1} to key '${images?.name}':`,
          img
        );
        formData.append(images?.name, img);
      });
    }
  }

  if (image) {
    console.log("Single image provided:", image);
    if (image?.file.length === 0) {
      console.log(`Appending empty array for key '${image?.name}'`);
      formData.append(image?.name, "[]");
    } else {
      console.log(
        `Appending single image to key '${image?.name}':`,
        image?.file[0]
      );
      formData.append(image?.name, image?.file[0]);
    }
  }

  Object.keys(data).forEach((key) => {
    if (key !== image?.name && key !== images?.name) {
      const keyValue = (data as any)[key];

      // Log what is being appended
      if (Array.isArray(keyValue)) {
        if (keyValue.length === 0) {
          console.log(`Appending empty array for key '${key}'`);
          formData.append(`${key}`, JSON.stringify([]));
        } else {
          console.log(`Appending array for key '${key}':`, keyValue);
          formData.append(`${key}`, JSON.stringify(keyValue));
        }
      } else if (typeof keyValue === "object" && !Array.isArray(keyValue)) {
        const obj = keyValue;
        if (keyValue?.$isDayjsObject) {
          console.log(
            `Appending Dayjs object for key '${key}':`,
            keyValue.toISOString()
          );
          formData.append(key, keyValue.toISOString());
        } else {
          console.log(`Appending object for key '${key}':`, obj);
          formData.append(`${key}`, JSON.stringify(obj) as any);
        }
      } else if (JSON.stringify(keyValue) === "{}") {
        console.log(`Appending empty object for key '${key}'`);
        formData.append(`${key}`, JSON.stringify({}));
      } else {
        console.log(`Appending value for key '${key}':`, keyValue);
        formData.append(key, keyValue);
      }
    }
  });

  // Log final FormData contents
  console.log("Final FormData contents:");
  for (const [key, value] of formData.entries()) {
    console.log(`Key: '${key}', Value:`, value);
  }

  return formData;
};
