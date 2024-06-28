import Image from "next/image";
type ShowImageProps = {
  imageData: string;
};
export const ShowImage = ({ imageData }: ShowImageProps) => {
  return (
    <Image
      src={`data:image/png;base64,${imageData}`}
      alt="Received Data"
      width={250}
      height={250}
    />
  );
};
