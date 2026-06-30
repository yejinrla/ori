export type Recipe = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  ingredients: string[];
  seasonings: string[];
  steps: string[];
  memo: string;
  image: string;
  photo?: string;
  cookTime?: string;
  rating?: number;
  sourceUrl?: string;
  sourceType: 'manual' | 'youtube' | 'instagram' | 'blog';
  favorite: boolean;
  addedAt: string;
};

export type ManualItemRow = {
  id: string;
  name: string;
  amount: string;
};

export type ManualRecipeForm = {
  title: string;
  category: string;
  photo: string | null;
  ingredients: ManualItemRow[];
  seasonings: ManualItemRow[];
  steps: string;
  memo: string;
  tags: string;
};

export type DayMeals = { breakfast: string[]; lunch: string[]; dinner: string[] };

export const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: '백종원 제육볶음',
    category: '한식',
    tags: ['#매운맛', '#저녁', '#돼지고기'],
    ingredients: ['돼지고기 앞다리살 500g', '양파 1개', '대파 1대'],
    seasonings: ['고추장 2큰술', '간장 2큰술', '설탕 1큰술', '고춧가루 1큰술'],
    steps: [
      '돼지고기와 양파를 먹기 좋은 크기로 썬다.',
      '양념 재료를 섞어 고기에 먼저 버무린다.',
      '센 불에서 볶다가 대파를 넣고 마무리한다.',
    ],
    memo: '설탕은 조금 줄이고 청양고추를 추가하면 더 좋다.',
    image: '🥘',
    cookTime: '20분',
    rating: 4.7,
    sourceUrl: 'https://youtube.com/watch?v=sample-jeyuk',
    sourceType: 'youtube',
    favorite: true,
    addedAt: '2026.06.30',
  },
  {
    id: '2',
    title: '에어프라이어 감자구이',
    category: '간식',
    tags: ['#간단', '#에어프라이어', '#10분요리'],
    ingredients: ['감자 2개', '올리브오일 1큰술', '소금 약간'],
    seasonings: ['파슬리 약간', '후추 약간'],
    steps: [
      '감자를 웨지 모양으로 썬다.',
      '오일과 소금, 후추를 버무린다.',
      '에어프라이어 180도에서 15분 조리한다.',
    ],
    memo: '중간에 한 번 뒤집으면 더 고르게 익는다.',
    image: '🥔',
    cookTime: '15분',
    rating: 4.3,
    sourceUrl: 'https://blog.example.com/potato',
    sourceType: 'blog',
    favorite: false,
    addedAt: '2026.06.29',
  },
  {
    id: '3',
    title: '닭가슴살 샐러드볼',
    category: '다이어트',
    tags: ['#다이어트', '#점심', '#샐러드'],
    ingredients: ['닭가슴살 150g', '양상추', '방울토마토', '아보카도 1/2개'],
    seasonings: ['올리브오일 1큰술', '레몬즙 1큰술', '홀그레인 머스터드 1작은술'],
    steps: [
      '닭가슴살을 익혀 찢어둔다.',
      '채소를 씻고 먹기 좋게 손질한다.',
      '드레싱을 뿌려 가볍게 섞는다.',
    ],
    memo: '삶은 계란을 추가하면 포만감이 좋다.',
    image: '🥗',
    cookTime: '10분',
    rating: 4.8,
    sourceType: 'manual',
    favorite: true,
    addedAt: '2026.06.28',
  },
];

export const emptyManualForm: ManualRecipeForm = {
  title: '',
  category: '',
  photo: null,
  ingredients: [
    { id: 'ingredient-1', name: '', amount: '' },
    { id: 'ingredient-2', name: '', amount: '' },
  ],
  seasonings: [
    { id: 'seasoning-1', name: '', amount: '' },
    { id: 'seasoning-2', name: '', amount: '' },
  ],
  steps: '',
  memo: '',
  tags: '',
};

// 요리한 날짜(ISO) → 끼니별 레시피 id 목록
export const cookingLog: Record<string, DayMeals> = {
  '2026-06-25': { breakfast: [], lunch: ['2'], dinner: [] },
  '2026-06-27': { breakfast: [], lunch: [], dinner: ['1'] },
  '2026-06-28': { breakfast: ['3'], lunch: [], dinner: [] },
  '2026-06-29': { breakfast: ['2'], lunch: [], dinner: ['3'] },
  '2026-06-30': { breakfast: [], lunch: ['3'], dinner: ['1'] },
};

export const mealSlots = [
  { key: 'breakfast', label: '아침', emoji: '🌅' },
  { key: 'lunch', label: '점심', emoji: '☀️' },
  { key: 'dinner', label: '저녁', emoji: '🌙' },
] as const;

export const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

export const categoryColors: Record<string, string> = {
  한식: '#D85C43',
  간식: '#E8A93B',
  다이어트: '#5C8D69',
  양식: '#B36A5E',
  일식: '#64748B',
  default: '#A26A42',
};

export function splitIngredientText(item: string) {
  const normalized = item.trim();
  const match = normalized.match(/^(.*?)(\s+\S+)$/);

  if (!match) {
    return { name: normalized, amount: '' };
  }

  return {
    name: match[1].trim(),
    amount: match[2].trim(),
  };
}
