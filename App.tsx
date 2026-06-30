import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Recipe = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  ingredients: string[];
  seasonings: string[];
  steps: string[];
  memo: string;
  image: string;
  sourceUrl?: string;
  sourceType: 'manual' | 'youtube' | 'instagram' | 'blog';
  favorite: boolean;
  addedAt: string;
};

type ViewState =
  | { name: 'home' }
  | { name: 'add' }
  | { name: 'link' }
  | { name: 'manual' }
  | { name: 'detail'; recipeId: string };

type ManualRecipeForm = {
  title: string;
  category: string;
  image: string;
  ingredients: string;
  seasonings: string;
  steps: string;
  memo: string;
  tags: string;
};

const initialRecipes: Recipe[] = [
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
    sourceType: 'manual',
    favorite: true,
    addedAt: '2026.06.28',
  },
];

const emptyManualForm: ManualRecipeForm = {
  title: '',
  category: '',
  image: '🍳',
  ingredients: '',
  seasonings: '',
  steps: '',
  memo: '',
  tags: '',
};

const categoryColors: Record<string, string> = {
  한식: '#D85C43',
  간식: '#E8A93B',
  다이어트: '#5C8D69',
  양식: '#B36A5E',
  일식: '#64748B',
  default: '#A26A42',
};

export default function App() {
  const [recipes, setRecipes] = useState(initialRecipes);
  const [view, setView] = useState<ViewState>({ name: 'home' });
  const [query, setQuery] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const [manualForm, setManualForm] = useState<ManualRecipeForm>(emptyManualForm);

  const filteredRecipes = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return recipes;
    }

    return recipes.filter((recipe) => {
      const corpus = [
        recipe.title,
        recipe.category,
        recipe.tags.join(' '),
        recipe.ingredients.join(' '),
        recipe.seasonings.join(' '),
      ]
        .join(' ')
        .toLowerCase();

      return corpus.includes(normalized);
    });
  }, [query, recipes]);

  const favoriteRecipes = recipes.filter((recipe) => recipe.favorite);
  const recentRecipes = [...recipes].slice(0, 3);
  const selectedRecipe =
    view.name === 'detail'
      ? recipes.find((recipe) => recipe.id === view.recipeId)
      : undefined;

  const createRecipeFromLink = () => {
    const url = linkInput.trim();
    if (!url) {
      return;
    }

    const sourceType: Recipe['sourceType'] = url.includes('instagram')
      ? 'instagram'
      : url.includes('youtube') || url.includes('youtu.be')
        ? 'youtube'
        : 'blog';

    const titleSeed = sourceType === 'youtube' ? '유튜브 레시피' : sourceType === 'instagram' ? '인스타 레시피' : '블로그 레시피';
    const recipe: Recipe = {
      id: Date.now().toString(),
      title: `${titleSeed} 자동 정리`,
      category: sourceType === 'instagram' ? '간식' : '한식',
      tags: ['#AI정리', '#링크가져오기', sourceType === 'youtube' ? '#영상레시피' : '#스크랩'],
      ingredients: ['주재료 1', '주재료 2', '채소 1종'],
      seasonings: ['간장 1큰술', '설탕 1작은술', '고춧가루 1큰술'],
      steps: [
        '링크 본문에서 재료와 양념을 추출한다.',
        '중복 표현을 정리하고 계량을 통일한다.',
        '조리 순서를 보기 쉬운 단계형 레시피로 재구성한다.',
      ],
      memo: 'AI가 자동 생성한 초안입니다. 내 입맛에 맞게 수정해보세요.',
      image: sourceType === 'instagram' ? '📸' : sourceType === 'youtube' ? '🎬' : '📝',
      sourceUrl: url,
      sourceType,
      favorite: false,
      addedAt: '2026.06.30',
    };

    setRecipes((current) => [recipe, ...current]);
    setLinkInput('');
    setView({ name: 'detail', recipeId: recipe.id });
  };

  const createManualRecipe = () => {
    if (!manualForm.title.trim()) {
      return;
    }

    const toList = (value: string) =>
      value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: manualForm.title.trim(),
      category: manualForm.category.trim() || '기타',
      tags: manualForm.tags
        .split(/[,\s]+/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (item.startsWith('#') ? item : `#${item}`)),
      ingredients: toList(manualForm.ingredients),
      seasonings: toList(manualForm.seasonings),
      steps: toList(manualForm.steps),
      memo: manualForm.memo.trim(),
      image: manualForm.image.trim() || '🍳',
      sourceType: 'manual',
      favorite: false,
      addedAt: '2026.06.30',
    };

    setRecipes((current) => [recipe, ...current]);
    setManualForm(emptyManualForm);
    setView({ name: 'detail', recipeId: recipe.id });
  };

  const toggleFavorite = (recipeId: string) => {
    setRecipes((current) =>
      current.map((recipe) =>
        recipe.id === recipeId ? { ...recipe, favorite: !recipe.favorite } : recipe,
      ),
    );
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.searchCard}>
        <Text style={styles.sectionTitle}>레시피 찾기</Text>
        <TextInput
          placeholder="음식, 재료, 태그로 검색"
          placeholderTextColor="#8C7A70"
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
        />
        <Text style={styles.searchHintLabel}>이런 식으로 찾아보세요</Text>
        <View style={styles.searchHintTags}>
          <View style={styles.searchHintChip}>
            <Text style={styles.searchHintChipText}>김치</Text>
          </View>
          <View style={styles.searchHintChip}>
            <Text style={styles.searchHintChipText}>감자</Text>
          </View>
          <View style={styles.searchHintChip}>
            <Text style={styles.searchHintChipText}>닭</Text>
          </View>
          <View style={styles.searchHintChip}>
            <Text style={styles.searchHintChipText}>매운맛</Text>
          </View>
          <View style={styles.searchHintChip}>
            <Text style={styles.searchHintChipText}>간단</Text>
          </View>
        </View>
      </View>

      <SectionHeader title="최근 추가한 레시피" />
      <View style={styles.listColumn}>
        {recentRecipes.map((recipe) => (
          <RecipeListCard
            key={recipe.id}
            recipe={recipe}
            onPress={() => setView({ name: 'detail', recipeId: recipe.id })}
            onFavorite={() => toggleFavorite(recipe.id)}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderAdd = () => (
    <View style={styles.content}>
      <Text style={styles.screenTitle}>레시피 추가</Text>
      <Text style={styles.screenDescription}>
        인터넷 링크를 가져오거나 직접 작성해서 나만의 레시피북에 저장하세요.
      </Text>
      <Pressable style={styles.primaryOption} onPress={() => setView({ name: 'link' })}>
        <OptionIcon variant="link" tone="dark" />
        <View style={styles.optionTextBlock}>
          <Text style={styles.optionTitle}>링크 가져오기</Text>
          <Text style={styles.optionDescriptionOnDark}>
            YouTube, Instagram, 블로그 링크를 AI가 레시피로 정리
          </Text>
        </View>
      </Pressable>
      <Pressable style={styles.secondaryOption} onPress={() => setView({ name: 'manual' })}>
        <OptionIcon variant="note" tone="light" />
        <View style={styles.optionTextBlock}>
          <Text style={styles.optionTitle}>직접 작성</Text>
          <Text style={styles.optionDescription}>재료, 양념, 조리 순서, 메모를 직접 입력해 저장</Text>
        </View>
      </Pressable>
    </View>
  );

  const renderLinkImporter = () => (
    <View style={styles.content}>
      <Text style={styles.screenTitle}>링크 가져오기</Text>
      <Text style={styles.screenDescription}>
        링크를 붙여넣으면 AI가 본문을 분석해 제목, 재료, 양념, 순서를 정리합니다.
      </Text>
      <View style={styles.panel}>
        <Text style={styles.label}>지원 채널</Text>
        <Text style={styles.helperText}>YouTube · Instagram · 네이버 블로그 · 브런치</Text>
        <TextInput
          style={styles.input}
          placeholder="https://"
          placeholderTextColor="#8C7A70"
          value={linkInput}
          onChangeText={setLinkInput}
          autoCapitalize="none"
        />
        <Pressable style={styles.primaryButton} onPress={createRecipeFromLink}>
          <Text style={styles.primaryButtonText}>AI로 레시피 정리</Text>
        </Pressable>
      </View>
      <View style={styles.aiPreview}>
        <Text style={styles.aiPreviewTitle}>AI 정리 예시</Text>
        <Text style={styles.aiPreviewText}>제목: 백종원 제육볶음</Text>
        <Text style={styles.aiPreviewText}>재료: 돼지고기, 양파, 대파</Text>
        <Text style={styles.aiPreviewText}>양념: 고추장, 간장, 설탕, 고춧가루</Text>
        <Text style={styles.aiPreviewText}>순서: 준비 → 양념 → 볶기</Text>
      </View>
    </View>
  );

  const renderManualForm = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.screenTitle}>직접 작성</Text>
      <Text style={styles.screenDescription}>메모처럼 적어도 번호와 태그가 자동 정리되는 개인 레시피 작성 화면입니다.</Text>
      <View style={styles.formCard}>
        <FormField label="제목">
          <TextInput
            style={styles.input}
            value={manualForm.title}
            onChangeText={(value) => setManualForm((current) => ({ ...current, title: value }))}
            placeholder="예: 김치찌개"
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="사진 또는 이모지">
          <TextInput
            style={styles.input}
            value={manualForm.image}
            onChangeText={(value) => setManualForm((current) => ({ ...current, image: value }))}
            placeholder="예: 🍲"
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="카테고리">
          <TextInput
            style={styles.input}
            value={manualForm.category}
            onChangeText={(value) => setManualForm((current) => ({ ...current, category: value }))}
            placeholder="예: 한식"
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="재료">
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={manualForm.ingredients}
            onChangeText={(value) => setManualForm((current) => ({ ...current, ingredients: value }))}
            placeholder={'한 줄에 하나씩 입력\n돼지고기 500g\n양파 1개'}
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="양념">
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={manualForm.seasonings}
            onChangeText={(value) => setManualForm((current) => ({ ...current, seasonings: value }))}
            placeholder={'한 줄에 하나씩 입력\n고추장 2큰술\n간장 1큰술'}
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="조리 순서">
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={manualForm.steps}
            onChangeText={(value) => setManualForm((current) => ({ ...current, steps: value }))}
            placeholder={'한 줄에 하나씩 입력\n재료를 손질한다\n양념을 섞는다'}
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="태그">
          <TextInput
            style={styles.input}
            value={manualForm.tags}
            onChangeText={(value) => setManualForm((current) => ({ ...current, tags: value }))}
            placeholder="#간단 #매운맛"
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <FormField label="메모">
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={manualForm.memo}
            onChangeText={(value) => setManualForm((current) => ({ ...current, memo: value }))}
            placeholder="예: 나는 설탕 조금 줄임"
            placeholderTextColor="#8C7A70"
          />
        </FormField>
        <Pressable style={styles.primaryButton} onPress={createManualRecipe}>
          <Text style={styles.primaryButtonText}>레시피 저장</Text>
        </Pressable>
      </View>
    </ScrollView>
  );

  const renderDetail = () => {
    if (!selectedRecipe) {
      return (
        <View style={styles.content}>
          <Text style={styles.screenTitle}>레시피를 찾을 수 없습니다.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.detailHero}>
          <Text style={styles.detailEmoji}>{selectedRecipe.image}</Text>
          <View style={styles.detailHeroText}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor:
                    categoryColors[selectedRecipe.category] ?? categoryColors.default,
                },
              ]}
            >
              <Text style={styles.categoryBadgeText}>{selectedRecipe.category}</Text>
            </View>
            <Text style={styles.detailTitle}>{selectedRecipe.title}</Text>
            <Text style={styles.detailMeta}>
              {selectedRecipe.addedAt}
              {selectedRecipe.sourceUrl ? ` · 원본 링크 저장됨` : ' · 직접 작성'}
            </Text>
          </View>
        </View>

        <TagRow tags={selectedRecipe.tags} />

        <DetailSection title="재료" items={selectedRecipe.ingredients} chips />
        <DetailSection title="양념" items={selectedRecipe.seasonings} chips />
        <DetailSection title="조리 순서" items={selectedRecipe.steps} numbered />

        <View style={styles.panel}>
          <Text style={styles.label}>메모</Text>
          <Text style={styles.detailText}>{selectedRecipe.memo || '메모 없음'}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.label}>원본 링크</Text>
          <Text style={styles.detailText}>{selectedRecipe.sourceUrl ?? '직접 작성 레시피'}</Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => toggleFavorite(selectedRecipe.id)}
        >
          <Text style={styles.primaryButtonText}>
            {selectedRecipe.favorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
          </Text>
        </Pressable>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.appShell}>
        <View style={styles.topBar}>
          <Text style={styles.topBarTitle}>오늘의 요리</Text>
          {view.name !== 'home' ? (
            <Pressable onPress={() => setView({ name: 'home' })}>
              <Text style={styles.topBarAction}>Home</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.mainArea}>
          {view.name === 'home' && renderHome()}
          {view.name === 'add' && renderAdd()}
          {view.name === 'link' && renderLinkImporter()}
          {view.name === 'manual' && renderManualForm()}
          {view.name === 'detail' && renderDetail()}
        </View>

        <View style={styles.bottomNav}>
          <NavItem label="Home" active={view.name === 'home'} onPress={() => setView({ name: 'home' })} />
          <NavItem label="Add +" active={view.name === 'add' || view.name === 'link' || view.name === 'manual'} onPress={() => setView({ name: 'add' })} />
        </View>
      </View>
    </SafeAreaView>
  );
}

function SectionHeader({
  title,
  actionLabel,
  onPress,
}: {
  title: string;
  actionLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable disabled={!onPress} onPress={onPress}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function RecipePreviewCard({
  recipe,
  onPress,
}: {
  recipe: Recipe;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.previewCard}>
      <Text style={styles.previewEmoji}>{recipe.image}</Text>
      <Text style={styles.previewTitle}>{recipe.title}</Text>
      <Text style={styles.previewSubtitle}>{recipe.category}</Text>
    </Pressable>
  );
}

function RecipeListCard({
  recipe,
  onPress,
  onFavorite,
}: {
  recipe: Recipe;
  onPress: () => void;
  onFavorite: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.listCard}>
      <View style={styles.listCardHeader}>
        <Text style={styles.listCardEmoji}>{recipe.image}</Text>
        <View style={styles.listCardTextBlock}>
          <Text style={styles.listCardTitle}>{recipe.title}</Text>
          <Text style={styles.listCardMeta}>
            {recipe.category} · {recipe.addedAt}
          </Text>
        </View>
        <Pressable hitSlop={8} onPress={onFavorite}>
          <Text style={styles.favoriteToggle}>{recipe.favorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Text style={styles.cardSnippet} numberOfLines={2}>
        {recipe.ingredients.join(' · ')}
      </Text>
      <TagRow tags={recipe.tags} />
    </Pressable>
  );
}

function TagRow({ tags }: { tags: string[] }) {
  return (
    <View style={styles.tagRow}>
      {tags.map((tag) => (
        <View key={tag} style={styles.tagChip}>
          <Text style={styles.tagText}>{tag}</Text>
        </View>
      ))}
    </View>
  );
}

function DetailSection({
  title,
  items,
  numbered,
  chips,
}: {
  title: string;
  items: string[];
  numbered?: boolean;
  chips?: boolean;
}) {
  return (
    <View style={styles.panel}>
      <Text style={styles.label}>{title}</Text>
      {chips ? (
        <View style={styles.ingredientGrid}>
          {items.map((item, index) => (
            <View key={`${title}-${index}`} style={styles.ingredientRow}>
              <Text style={styles.ingredientName}>{splitIngredientText(item).name}</Text>
              <Text style={styles.ingredientAmount}>{splitIngredientText(item).amount}</Text>
            </View>
          ))}
        </View>
      ) : (
        items.map((item, index) => (
          <Text key={`${title}-${index}`} style={styles.detailText}>
            {numbered ? `${index + 1}. ${item}` : `• ${item}`}
          </Text>
        ))
      )}
    </View>
  );
}

function splitIngredientText(item: string) {
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

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

function NavItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function OptionIcon({
  variant,
  tone,
}: {
  variant: 'link' | 'note';
  tone: 'dark' | 'light';
}) {
  const isDark = tone === 'dark';
  const stroke = isDark ? '#FFFFFF' : '#6F5549';
  const background = isDark ? 'rgba(255,255,255,0.06)' : '#F4E6D8';

  return (
    <View style={[styles.optionIconFrame, { backgroundColor: background, borderColor: stroke }]}>
      {variant === 'link' ? (
        <View style={styles.optionLinkIcon}>
          <View style={[styles.optionLinkLoop, { borderColor: stroke }]} />
          <View style={[styles.optionLinkBridge, { backgroundColor: stroke }]} />
          <View style={[styles.optionLinkLoop, { borderColor: stroke, marginLeft: -6 }]} />
        </View>
      ) : (
        <View style={styles.optionNoteIcon}>
          <View style={[styles.optionNoteSheet, { borderColor: stroke }]}>
            <View style={[styles.optionNoteLine, { backgroundColor: stroke }]} />
            <View style={[styles.optionNoteLineShort, { backgroundColor: stroke }]} />
          </View>
          <View style={[styles.optionPenBody, { backgroundColor: stroke }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6EFE7',
  },
  appShell: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#36231B',
  },
  topBarAction: {
    fontSize: 16,
    fontWeight: '700',
    color: '#A34C31',
  },
  mainArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 150,
    gap: 16,
  },
  searchCard: {
    backgroundColor: '#FCE8C8',
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  searchInput: {
    backgroundColor: '#FFF9F4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#36231B',
  },
  searchHintLabel: {
    color: '#7C5D4F',
    fontSize: 13,
    fontWeight: '600',
  },
  searchHintTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchHintChip: {
    backgroundColor: '#F3D9AC',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  searchHintChipText: {
    color: '#745748',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#36231B',
  },
  sectionAction: {
    color: '#A34C31',
    fontSize: 14,
    fontWeight: '700',
  },
  rowGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  previewCard: {
    flex: 1,
    minHeight: 146,
    backgroundColor: '#FFF9F4',
    borderRadius: 22,
    padding: 16,
    justifyContent: 'space-between',
  },
  previewEmoji: {
    fontSize: 32,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#36231B',
  },
  previewSubtitle: {
    fontSize: 13,
    color: '#8C6D5E',
  },
  favoriteList: {
    gap: 10,
  },
  favoriteItem: {
    backgroundColor: '#FFF9F4',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  favoriteEmoji: {
    fontSize: 22,
  },
  favoriteTextBlock: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#36231B',
  },
  favoriteSubtitle: {
    fontSize: 13,
    color: '#8C6D5E',
  },
  listColumn: {
    gap: 12,
  },
  listCard: {
    backgroundColor: '#FFF9F4',
    borderRadius: 22,
    padding: 16,
    gap: 12,
  },
  listCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listCardEmoji: {
    fontSize: 28,
  },
  listCardTextBlock: {
    flex: 1,
  },
  listCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#36231B',
  },
  listCardMeta: {
    fontSize: 13,
    color: '#8C6D5E',
  },
  favoriteToggle: {
    fontSize: 24,
    color: '#D85C43',
  },
  cardSnippet: {
    color: '#5F463B',
    fontSize: 14,
    lineHeight: 20,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: '#F3E0CF',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    color: '#7B5544',
    fontSize: 12,
    fontWeight: '700',
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#36231B',
    marginBottom: 8,
  },
  screenDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: '#947B6E',
    marginBottom: 8,
  },
  primaryOption: {
    backgroundColor: '#36231B',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  secondaryOption: {
    backgroundColor: '#FFF9F4',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D7CA',
  },
  optionIconFrame: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLinkIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionLinkLoop: {
    width: 12,
    height: 8,
    borderWidth: 1.5,
    borderRadius: 999,
    transform: [{ rotate: '-35deg' }],
  },
  optionLinkBridge: {
    width: 7,
    height: 1.5,
    marginHorizontal: -2,
  },
  optionNoteIcon: {
    width: 18,
    height: 18,
    justifyContent: 'center',
  },
  optionNoteSheet: {
    width: 14,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 3,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  optionNoteLine: {
    height: 1.5,
    borderRadius: 999,
    marginBottom: 3,
  },
  optionNoteLineShort: {
    width: 7,
    height: 1.5,
    borderRadius: 999,
  },
  optionPenBody: {
    position: 'absolute',
    width: 9,
    height: 1.5,
    right: -1,
    bottom: 2,
    transform: [{ rotate: '-35deg' }],
  },
  optionTextBlock: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#36231B',
  },
  optionDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#71594D',
  },
  optionDescriptionOnDark: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  panel: {
    backgroundColor: '#FFF9F4',
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '800',
    color: '#36231B',
  },
  helperText: {
    fontSize: 13,
    color: '#8C6D5E',
  },
  input: {
    backgroundColor: '#F6EFE7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#36231B',
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  primaryButton: {
    backgroundColor: '#D85C43',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF9F4',
    fontSize: 16,
    fontWeight: '800',
  },
  aiPreview: {
    backgroundColor: '#FCE8C8',
    borderRadius: 22,
    padding: 18,
    gap: 8,
  },
  aiPreviewTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#36231B',
  },
  aiPreviewText: {
    fontSize: 14,
    color: '#654E43',
  },
  formCard: {
    backgroundColor: '#FFF9F4',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  fieldBlock: {
    gap: 8,
  },
  detailHero: {
    backgroundColor: '#FFF9F4',
    borderRadius: 26,
    padding: 20,
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  detailEmoji: {
    fontSize: 52,
  },
  detailHeroText: {
    flex: 1,
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  categoryBadgeText: {
    color: '#FFF9F4',
    fontSize: 12,
    fontWeight: '800',
  },
  detailTitle: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: '#36231B',
  },
  detailMeta: {
    fontSize: 13,
    color: '#8C6D5E',
  },
  detailText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#533F36',
  },
  ingredientGrid: {
    borderTopWidth: 1,
    borderTopColor: '#EFE3D7',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EFE3D7',
  },
  ingredientName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#36231B',
  },
  ingredientAmount: {
    minWidth: 92,
    marginLeft: 16,
    textAlign: 'right',
    color: '#6B4E41',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#36231B',
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    gap: 12,
  },
  navItem: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navItemActive: {
    backgroundColor: '#D85C43',
  },
  navLabel: {
    color: '#EADFD6',
    fontWeight: '700',
    fontSize: 15,
  },
  navLabelActive: {
    color: '#FFF9F4',
  },
});
