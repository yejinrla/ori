import Svg, { Circle, G, Path } from 'react-native-svg';

export function MyPageTabIcon({ color }: { color: string }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 512 512" fill="none">
      <G stroke={color} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={256} cy={150} r={62} />
        <Path d="M132 397V358C132 300 179 253 237 253H275C333 253 380 300 380 358V397H132Z" />
      </G>
    </Svg>
  );
}
