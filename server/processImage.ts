const processImage = (
  file: File
): Promise<{ base64: string; imgType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target as any).result.split(",")[1];
      const imgType = file.type.split("/")[1];
      resolve({ base64, imgType });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};

export { processImage }