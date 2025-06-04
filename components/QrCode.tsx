import { useQRCode } from "next-qrcode";

const QrCode = ({ text, logo }: { text: string; logo: string }) => {
  const { Canvas } = useQRCode();

  return (
    <Canvas
      text={text}
      options={{
        errorCorrectionLevel: "L",
        margin: 2,
        scale: 5,
        width: 170,
        color: {
          dark: "#000000",
          light: "#e6f0ff",
        },
      }}
      logo={{
        src: logo,
        options: {
          width: 40,
          x: undefined,
          y: undefined,
        },
      }}
    />
  );
};
export default QrCode;
