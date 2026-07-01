import Svg, { G, Path, Rect } from 'react-native-svg';

export function CalendarTabIcon({ color }: { color: string }) {
  return (
    <Svg width={21} height={24} viewBox="0 0 24 28" fill="none">
      <G stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
        <Rect x={3} y={4.5} width={18} height={21.5} rx={3} />
        <Path d="M3 10.5 H21" />
        <Path d="M8 2 V6.5" />
        <Path d="M16 2 V6.5" />
      </G>
      <G fill={color}>
        <Rect x={6.3} y={13} width={2.4} height={2.4} rx={0.6} />
        <Rect x={10.8} y={13} width={2.4} height={2.4} rx={0.6} />
        <Rect x={15.3} y={13} width={2.4} height={2.4} rx={0.6} />
        <Rect x={6.3} y={17.6} width={2.4} height={2.4} rx={0.6} />
        <Rect x={10.8} y={17.6} width={2.4} height={2.4} rx={0.6} />
        <Rect x={15.3} y={17.6} width={2.4} height={2.4} rx={0.6} />
        <Rect x={6.3} y={22.2} width={2.4} height={2.4} rx={0.6} />
        <Rect x={10.8} y={22.2} width={2.4} height={2.4} rx={0.6} />
        <Rect x={15.3} y={22.2} width={2.4} height={2.4} rx={0.6} />
      </G>
    </Svg>
  );
}
