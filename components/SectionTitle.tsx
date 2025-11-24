import { Text } from "react-native";
import colors from "../theme/colors";


type SectionTitleProps = {
  children: React.ReactNode;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Text
      style={{
        color: colors.yellow,
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 20,
      }}
    >
      {children}
    </Text>
  );
}
