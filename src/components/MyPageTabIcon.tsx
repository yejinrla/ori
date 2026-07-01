import Svg, { Circle, G, Path } from 'react-native-svg';

export function MyPageTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 512 512" fill="none">
      <G stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx={256} cy={172} r={72} />
        <Path d="M136 412V400C136 337 187 286 250 286H262C325 286 376 337 376 400V412" />
      </G>
    </Svg>
  );
}
