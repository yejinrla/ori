import Svg, { Path } from 'react-native-svg';

export function RecipeTabIcon({ color }: { color: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 512 512" fill="none">
      <Path
        d="M168 84H344C358 84 368 94 368 108V404C368 418 358 428 344 428H168C154 428 144 418 144 404V108C144 94 154 84 168 84Z"
        stroke={color}
        strokeWidth={36}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M198 176H314" stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M198 256H314" stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M198 336H272" stroke={color} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
