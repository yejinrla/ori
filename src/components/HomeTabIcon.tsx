import Svg, { Path } from 'react-native-svg';

export function HomeTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 512 512" fill="none">
      <Path
        d="M104 244L256 120L408 244"
        stroke={color}
        strokeWidth={36}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M142 232V390C142 407.673 156.327 422 174 422H338C355.673 422 370 407.673 370 390V232"
        stroke={color}
        strokeWidth={36}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M222 422V320C222 311.163 229.163 304 238 304H274C282.837 304 290 311.163 290 320V422"
        stroke={color}
        strokeWidth={36}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
