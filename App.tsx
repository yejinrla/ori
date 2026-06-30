import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Platform,
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
  cookTime?: string;
  rating?: number;
  sourceUrl?: string;
  sourceType: 'manual' | 'youtube' | 'instagram' | 'blog';
  favorite: boolean;
  addedAt: string;
};

type ViewState =
  | { name: 'home' }
  | { name: 'search' }
  | { name: 'add' }
  | { name: 'link' }
  | { name: 'manual' }
  | { name: 'detail'; recipeId: string };

const webInputReset =
  Platform.OS === 'web'
    ? ({
        outlineStyle: 'solid',
        outlineWidth: 0,
        outlineColor: 'transparent',
        borderWidth: 0,
        boxShadow: 'none',
      } as const)
    : {};

type ManualRecipeForm = {
  title: string;
  category: string;
  image: string;
  ingredients: ManualItemRow[];
  seasonings: ManualItemRow[];
  steps: string;
  memo: string;
  tags: string;
};

type ManualItemRow = {
  id: string;
  name: string;
  amount: string;
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

const emptyManualForm: ManualRecipeForm = {
  title: '',
  category: '',
  image: '🍳',
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

const categoryColors: Record<string, string> = {
  한식: '#D85C43',
  간식: '#E8A93B',
  다이어트: '#5C8D69',
  양식: '#B36A5E',
  일식: '#64748B',
  default: '#A26A42',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    MaruBuri: require('./assets/MaruBuri-Regular.ttf'),
    MaruBuriSemiBold: require('./assets/MaruBuri-SemiBold.ttf'),
  });
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
  const recommendedRecipes = [...recipes].reverse();
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

    const toList = (rows: ManualItemRow[]) =>
      rows
        .map((row) => [row.name.trim(), row.amount.trim()].filter(Boolean).join(' '))
        .filter(Boolean);
    const toStepList = (value: string) =>
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
      steps: toStepList(manualForm.steps),
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

  const updateManualRows = (
    field: 'ingredients' | 'seasonings',
    rowId: string,
    key: 'name' | 'amount',
    value: string,
  ) => {
    setManualForm((current) => ({
      ...current,
      [field]: current[field].map((row) => (row.id === rowId ? { ...row, [key]: value } : row)),
    }));
  };

  const addManualRow = (field: 'ingredients' | 'seasonings') => {
    setManualForm((current) => ({
      ...current,
      [field]: [
        ...current[field],
        { id: `${field}-${Date.now()}-${current[field].length}`, name: '', amount: '' },
      ],
    }));
  };

  const renderHome = () => (
    <ScrollView contentContainerStyle={styles.homeContent}>
      <View style={styles.homeIntro}>
        <Text style={styles.homeIntroEyebrow}>👋 안녕하세요!</Text>
        <Text style={styles.homeIntroTitle}>6월 30일 화요일,</Text>
        <Text style={styles.homeIntroSubtitle}>오늘은 무엇을 만들어볼까요?</Text>
      </View>
      <Pressable style={styles.homeSearchWrap} onPress={() => setView({ name: 'search' })}>
        <SearchIcon />
        <Text style={query ? styles.homeSearchValue : styles.homeSearchPlaceholder}>
          {query || '재료나 음식 검색'}
        </Text>
      </Pressable>
      <Text style={styles.homeRailTitle}>최근 저장한 레시피</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredRail}
      >
        {recentRecipes.map((recipe, index) => (
          <FeaturedCard
            key={recipe.id}
            recipe={recipe}
            emoji={index === 0 ? '🍋' : index === 1 ? '🥩' : '🥗'}
            onPress={() => setView({ name: 'detail', recipeId: recipe.id })}
          />
        ))}
      </ScrollView>

      <Text style={[styles.homeRailTitle, styles.homeRailTitleSpaced]}>오늘의 추천</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.featuredRail}
      >
        {recommendedRecipes.map((recipe) => (
          <FeaturedCard
            key={recipe.id}
            recipe={recipe}
            emoji={recipe.image}
            onPress={() => setView({ name: 'detail', recipeId: recipe.id })}
          />
        ))}
      </ScrollView>
    </ScrollView>
  );

  const renderSearch = () => {
    const trimmed = query.trim();

    return (
      <View style={styles.searchScreen}>
        <View style={styles.homeSearchWrap}>
          <SearchIcon />
          <TextInput
            autoFocus
            placeholder="재료나 음식 검색"
            placeholderTextColor="#AFACA6"
            style={styles.homeSearchInput}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
          {query.length > 0 ? (
            <Pressable hitSlop={8} onPress={() => setQuery('')}>
              <Text style={styles.searchClear}>✕</Text>
            </Pressable>
          ) : null}
        </View>
        <ScrollView
          contentContainerStyle={styles.searchResults}
          keyboardShouldPersistTaps="handled"
        >
          {trimmed.length === 0 ? (
            <Text style={styles.searchHint}>레시피 이름, 재료, 태그로 검색해보세요.</Text>
          ) : filteredRecipes.length === 0 ? (
            <Text style={styles.searchHint}>‘{trimmed}’에 대한 결과가 없어요.</Text>
          ) : (
            <>
              <Text style={styles.searchCount}>{filteredRecipes.length}개의 레시피</Text>
              {filteredRecipes.map((recipe) => (
                <RecipeListCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => setView({ name: 'detail', recipeId: recipe.id })}
                  onFavorite={() => toggleFavorite(recipe.id)}
                />
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

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
          <ManualGridEditor
            rows={manualForm.ingredients}
            namePlaceholder="예: 돼지고기"
            amountPlaceholder="예: 500g"
            onNameChange={(rowId, value) => updateManualRows('ingredients', rowId, 'name', value)}
            onAmountChange={(rowId, value) => updateManualRows('ingredients', rowId, 'amount', value)}
            onAddRow={() => addManualRow('ingredients')}
          />
        </FormField>
        <FormField label="양념">
          <ManualGridEditor
            rows={manualForm.seasonings}
            namePlaceholder="예: 고추장"
            amountPlaceholder="예: 2큰술"
            onNameChange={(rowId, value) => updateManualRows('seasonings', rowId, 'name', value)}
            onAmountChange={(rowId, value) => updateManualRows('seasonings', rowId, 'amount', value)}
            onAddRow={() => addManualRow('seasonings')}
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

    const recipe = selectedRecipe;

    return (
      <ScrollView contentContainerStyle={styles.detailContent}>
        <Text style={styles.detailTitleTop}>{recipe.title}</Text>

        <View style={styles.detailPhoto}>
          <Text style={styles.detailPhotoEmoji}>{recipe.image}</Text>
        </View>

        <View style={styles.detailMetaList}>
          {recipe.cookTime ? (
            <Text style={styles.detailMetaLine}>
              <Text style={styles.detailMetaLabel}>조리 시간: </Text>
              {recipe.cookTime}
            </Text>
          ) : null}
          <Text style={styles.detailMetaLine}>
            <Text style={styles.detailMetaLabel}>분류: </Text>
            {recipe.category}
          </Text>
          {typeof recipe.rating === 'number' ? (
            <Text style={styles.detailMetaLine}>
              <Text style={styles.detailMetaLabel}>평점: </Text>
              {`★ ${recipe.rating.toFixed(1)}`}
            </Text>
          ) : null}
          <Text style={styles.detailMetaLine}>
            <Text style={styles.detailMetaLabel}>저장일: </Text>
            {recipe.addedAt}
          </Text>
        </View>

        {recipe.tags.length ? <TagRow tags={recipe.tags} /> : null}

        <Text style={styles.detailSectionHeading}>재료</Text>
        <View style={styles.ingredientGrid}>
          {recipe.ingredients.map((item, index) => {
            const parsed = splitIngredientText(item);
            return (
              <View key={`ing-${index}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{parsed.name}</Text>
                <Text style={styles.ingredientAmount}>{parsed.amount}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.detailSectionHeading}>양념</Text>
        <View style={styles.ingredientGrid}>
          {recipe.seasonings.map((item, index) => {
            const parsed = splitIngredientText(item);
            return (
              <View key={`sea-${index}`} style={styles.ingredientRow}>
                <Text style={styles.ingredientName}>{parsed.name}</Text>
                <Text style={styles.ingredientAmount}>{parsed.amount}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.detailSectionHeading}>조리 순서</Text>
        <View style={styles.detailSteps}>
          {recipe.steps.map((item, index) => (
            <Text key={`step-${index}`} style={styles.detailStepText}>
              <Text style={styles.detailStepNumber}>{`${index + 1}. `}</Text>
              {item}
            </Text>
          ))}
        </View>

        <Text style={styles.detailSectionHeading}>메모</Text>
        <Text style={styles.detailText}>{recipe.memo || '메모 없음'}</Text>

        {recipe.sourceUrl ? (
          <>
            <Text style={styles.detailSectionHeading}>원본 링크</Text>
            <Text style={styles.detailText}>{recipe.sourceUrl}</Text>
          </>
        ) : null}

        <Pressable style={styles.detailFavoriteButton} onPress={() => toggleFavorite(recipe.id)}>
          <Text style={styles.detailFavoriteText}>
            {recipe.favorite ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}
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
          {view.name !== 'home' ? (
            <Pressable
              onPress={() => setView({ name: 'home' })}
              style={styles.topBarBackWrap}
              hitSlop={8}
            >
              <Text style={styles.topBarBack}>‹</Text>
            </Pressable>
          ) : null}
          <Text style={[styles.topBarTitle, fontsLoaded && styles.topBarTitleLoaded]}>오늘의 요리</Text>
        </View>

        <View style={styles.mainArea}>
          {view.name === 'home' && renderHome()}
          {view.name === 'search' && renderSearch()}
          {view.name === 'add' && renderAdd()}
          {view.name === 'link' && renderLinkImporter()}
          {view.name === 'manual' && renderManualForm()}
          {view.name === 'detail' && renderDetail()}
        </View>

        <View style={styles.bottomNav}>
          <NavItem
            icon="⌂"
            label="홈"
            active={view.name === 'home'}
            onPress={() => setView({ name: 'home' })}
          />
          <NavItem
            icon="▤"
            activeIcon="▣"
            label="레시피"
            active={view.name === 'detail'}
            onPress={() => setView({ name: 'home' })}
          />
          <Pressable style={styles.navCenter} onPress={() => setView({ name: 'add' })}>
            <View style={styles.navAddButton}>
              <Text style={styles.navAddIcon}>+</Text>
            </View>
          </Pressable>
          <NavItem
            icon="▦"
            activeIcon="▣"
            label="캘린더"
            active={false}
            onPress={() => setView({ name: 'home' })}
          />
          <NavItem
            icon="◍"
            activeIcon="◉"
            label="마이페이지"
            active={false}
            onPress={() => setView({ name: 'home' })}
          />
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

function ManualGridEditor({
  rows,
  namePlaceholder,
  amountPlaceholder,
  onNameChange,
  onAmountChange,
  onAddRow,
}: {
  rows: ManualItemRow[];
  namePlaceholder: string;
  amountPlaceholder: string;
  onNameChange: (rowId: string, value: string) => void;
  onAmountChange: (rowId: string, value: string) => void;
  onAddRow: () => void;
}) {
  return (
    <View style={styles.manualGridBox}>
      <View style={styles.manualGridHeader}>
        <Text style={styles.manualGridHeaderText}>항목</Text>
        <Text style={styles.manualGridHeaderText}>수량</Text>
      </View>
      {rows.map((row) => (
        <View key={row.id} style={styles.manualGridRow}>
          <TextInput
            style={[styles.manualGridInput, styles.manualGridNameInput]}
            value={row.name}
            onChangeText={(value) => onNameChange(row.id, value)}
            placeholder={namePlaceholder}
            placeholderTextColor="#9A877C"
          />
          <TextInput
            style={[styles.manualGridInput, styles.manualGridAmountInput]}
            value={row.amount}
            onChangeText={(value) => onAmountChange(row.id, value)}
            placeholder={amountPlaceholder}
            placeholderTextColor="#9A877C"
          />
        </View>
      ))}
      <Pressable style={styles.manualGridAddButton} onPress={onAddRow}>
        <Text style={styles.manualGridAddText}>+ 행 추가</Text>
      </Pressable>
    </View>
  );
}

function NavItem({
  icon,
  activeIcon,
  label,
  active,
  onPress,
}: {
  icon: string;
  activeIcon?: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}>
      <Text style={[styles.navIcon, active && styles.navIconActive]}>{active ? activeIcon ?? icon : icon}</Text>
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
    </Pressable>
  );
}

function FeaturedCard({
  recipe,
  emoji,
  onPress,
}: {
  recipe: Recipe;
  emoji: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.featuredCard} onPress={onPress}>
      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {recipe.title.replace(/ /g, '\n')}
        </Text>
        <Text style={styles.featuredMeta}>{recipe.category}</Text>
        <View style={styles.featuredInfoRow}>
          {recipe.cookTime ? (
            <View style={styles.featuredInfoItem}>
              <Text style={styles.featuredTimeIcon}>{'⏱︎'}</Text>
              <Text style={styles.featuredInfo}>{recipe.cookTime}</Text>
            </View>
          ) : null}
          {typeof recipe.rating === 'number' ? (
            <View style={styles.featuredInfoItem}>
              <Text style={styles.featuredStarIcon}>★</Text>
              <Text style={styles.featuredInfo}>{recipe.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
      </View>
      <View style={styles.featuredImageArea}>
        <Text style={styles.featuredEmoji}>{emoji}</Text>
      </View>
    </Pressable>
  );
}

function SearchIcon() {
  return (
    <View style={styles.searchIcon}>
      <View style={styles.searchIconGlass} />
      <View style={styles.searchIconHandle} />
    </View>
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
    backgroundColor: '#FFFFFF',
  },
  appShell: {
    flex: 1,
  },
  topBar: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 18,
    minHeight: 64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#36231B',
    letterSpacing: 2.4,
  },
  topBarTitleLoaded: {
    fontFamily: 'MaruBuri',
    fontWeight: '400',
  },
  topBarBackWrap: {
    position: 'absolute',
    left: 16,
    top: 14,
    bottom: 18,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  topBarBack: {
    fontSize: 40,
    lineHeight: 42,
    fontWeight: '400',
    color: '#36231B',
  },
  mainArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 150,
    gap: 16,
  },
  homeContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 150,
  },
  featuredRail: {
    paddingRight: 28,
    gap: 14,
  },
  homeRailTitle: {
    fontFamily: 'MaruBuriSemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1B18',
    marginTop: 10,
    marginBottom: 12,
  },
  homeRailTitleSpaced: {
    marginTop: 28,
  },
  homeIntro: {
    marginBottom: 18,
    gap: 2,
  },
  homeSearchWrap: {
    marginBottom: 18,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 18,
    gap: 11,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  homeSearchInput: {
    fontFamily: 'MaruBuri',
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: '#36231B',
    padding: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...webInputReset,
  },
  homeSearchPlaceholder: {
    fontFamily: 'MaruBuri',
    flex: 1,
    fontSize: 15,
    color: '#AFACA6',
  },
  homeSearchValue: {
    fontFamily: 'MaruBuri',
    flex: 1,
    fontSize: 15,
    color: '#36231B',
  },
  searchScreen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  searchClear: {
    fontSize: 14,
    color: '#AFACA6',
  },
  searchResults: {
    paddingBottom: 150,
    gap: 12,
  },
  searchCount: {
    fontFamily: 'MaruBuri',
    fontSize: 13,
    color: '#8C6D5E',
    marginBottom: 2,
  },
  searchHint: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    lineHeight: 21,
    color: '#947B6E',
    paddingTop: 24,
    textAlign: 'center',
  },
  searchIcon: {
    width: 17,
    height: 17,
  },
  searchIconGlass: {
    width: 13,
    height: 13,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#BDBAB4',
  },
  searchIconHandle: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 7,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#BDBAB4',
    transform: [{ rotate: '45deg' }],
  },
  homeIntroEyebrow: {
    fontFamily: 'MaruBuri',
    fontSize: 12,
    color: '#9A948D',
    marginBottom: 10,
  },
  homeIntroTitle: {
    fontFamily: 'MaruBuri',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    color: '#1F1B18',
  },
  homeIntroSubtitle: {
    fontFamily: 'MaruBuri',
    fontSize: 15,
    lineHeight: 22,
    color: '#1F1B18',
  },
  featuredCard: {
    backgroundColor: '#F2F1ED',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    width: 168,
  },
  featuredEyebrow: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    lineHeight: 18,
    color: '#4A4039',
  },
  featuredEmoji: {
    fontSize: 98,
    textAlign: 'center',
    marginTop: 0,
  },
  featuredBody: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 2,
  },
  featuredTitle: {
    fontFamily: 'MaruBuriSemiBold',
    fontSize: 18,
    lineHeight: 24,
    minHeight: 48,
    fontWeight: '600',
    color: '#1F1B18',
  },
  featuredMeta: {
    fontFamily: 'MaruBuri',
    color: '#8E857D',
    fontSize: 12,
    fontWeight: '400',
  },
  featuredInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  featuredInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  featuredTimeIcon: {
    fontSize: 12,
    color: '#8B8B8B',
  },
  featuredStarIcon: {
    fontSize: 12,
    color: '#F6B73C',
  },
  featuredInfo: {
    fontFamily: 'MaruBuri',
    fontSize: 12,
    color: '#6B5F56',
  },
  featuredImageArea: {
    minHeight: 150,
    backgroundColor: '#F2F1ED',
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 18,
    justifyContent: 'center',
  },
  searchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 8,
  },
  searchInput: {
    fontFamily: 'MaruBuri',
    backgroundColor: '#FFF9F4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#36231B',
    borderWidth: 0,
    ...webInputReset,
  },
  searchHintLabel: {
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    fontSize: 18,
    fontWeight: '800',
    color: '#36231B',
  },
  sectionAction: {
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    fontSize: 16,
    fontWeight: '800',
    color: '#36231B',
  },
  previewSubtitle: {
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    fontSize: 16,
    fontWeight: '700',
    color: '#36231B',
  },
  favoriteSubtitle: {
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    fontSize: 18,
    fontWeight: '800',
    color: '#36231B',
  },
  listCardMeta: {
    fontFamily: 'MaruBuri',
    fontSize: 13,
    color: '#8C6D5E',
  },
  favoriteToggle: {
    fontSize: 24,
    color: '#D85C43',
  },
  cardSnippet: {
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    color: '#7B5544',
    fontSize: 12,
    fontWeight: '700',
  },
  screenTitle: {
    fontFamily: 'MaruBuri',
    fontSize: 24,
    fontWeight: '800',
    color: '#36231B',
    marginBottom: 8,
  },
  screenDescription: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    lineHeight: 21,
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
    fontFamily: 'MaruBuri',
    fontSize: 18,
    fontWeight: '800',
    color: '#36231B',
  },
  optionDescription: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    lineHeight: 20,
    color: '#71594D',
  },
  optionDescriptionOnDark: {
    fontFamily: 'MaruBuri',
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    gap: 10,
  },
  label: {
    fontFamily: 'MaruBuri',
    fontSize: 15,
    fontWeight: '800',
    color: '#36231B',
  },
  helperText: {
    fontFamily: 'MaruBuri',
    fontSize: 13,
    color: '#8C6D5E',
  },
  input: {
    fontFamily: 'MaruBuri',
    backgroundColor: '#F6EFE7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#36231B',
    borderWidth: 0,
    ...webInputReset,
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
    fontFamily: 'MaruBuri',
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
    fontFamily: 'MaruBuri',
    fontSize: 16,
    fontWeight: '800',
    color: '#36231B',
  },
  aiPreviewText: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    color: '#654E43',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    gap: 14,
  },
  fieldBlock: {
    gap: 8,
  },
  manualGridBox: {
    backgroundColor: '#F6EFE7',
    borderRadius: 18,
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
  },
  manualGridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingBottom: 8,
  },
  manualGridHeaderText: {
    fontFamily: 'MaruBuri',
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#8B7266',
  },
  manualGridRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8DDD3',
  },
  manualGridInput: {
    fontFamily: 'MaruBuri',
    minWidth: 0,
    flexShrink: 1,
    fontSize: 16,
    color: '#36231B',
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...webInputReset,
  },
  manualGridNameInput: {
    flex: 1,
  },
  manualGridAmountInput: {
    width: 96,
    flexShrink: 0,
    textAlign: 'right',
  },
  manualGridAddButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF9F4',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E3D4C8',
  },
  manualGridAddText: {
    fontFamily: 'MaruBuri',
    color: '#7B5C4E',
    fontSize: 13,
    fontWeight: '700',
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
    fontFamily: 'MaruBuri',
    color: '#FFF9F4',
    fontSize: 12,
    fontWeight: '800',
  },
  detailTitle: {
    fontFamily: 'MaruBuri',
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '800',
    color: '#36231B',
  },
  detailMeta: {
    fontFamily: 'MaruBuri',
    fontSize: 12,
    color: '#8C6D5E',
  },
  detailText: {
    fontFamily: 'MaruBuri',
    fontSize: 14,
    lineHeight: 22,
    color: '#533F36',
  },
  detailContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 150,
  },
  detailTitleTop: {
    fontFamily: 'MaruBuriSemiBold',
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    color: '#1F1B18',
    textAlign: 'center',
    marginBottom: 18,
  },
  detailPhoto: {
    width: '100%',
    height: 280,
    borderRadius: 20,
    backgroundColor: '#F2F1ED',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  detailPhotoEmoji: {
    fontSize: 150,
  },
  detailMetaList: {
    gap: 6,
    marginBottom: 4,
  },
  detailMetaLine: {
    fontFamily: 'MaruBuri',
    fontSize: 15,
    lineHeight: 24,
    color: '#4A4039',
  },
  detailMetaLabel: {
    fontFamily: 'MaruBuriSemiBold',
    fontWeight: '700',
    color: '#1F1B18',
  },
  detailSectionHeading: {
    fontFamily: 'MaruBuriSemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1B18',
    marginTop: 26,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E7DDD2',
  },
  detailSteps: {
    gap: 12,
  },
  detailStepText: {
    fontFamily: 'MaruBuri',
    fontSize: 15,
    lineHeight: 23,
    color: '#3F2F27',
  },
  detailStepNumber: {
    fontFamily: 'MaruBuriSemiBold',
    fontWeight: '700',
    color: '#A34C31',
  },
  detailFavoriteButton: {
    marginTop: 28,
    borderWidth: 1.5,
    borderColor: '#D85C43',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  detailFavoriteText: {
    fontFamily: 'MaruBuriSemiBold',
    color: '#D85C43',
    fontSize: 16,
    fontWeight: '700',
  },
  ingredientGrid: {
    borderTopWidth: 0,
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
    fontFamily: 'MaruBuri',
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#36231B',
  },
  ingredientAmount: {
    fontFamily: 'MaruBuri',
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
    backgroundColor: '#F3ECE2',
    borderRadius: 0,
    borderTopWidth: 1,
    borderTopColor: '#DCCFC2',
    paddingHorizontal: 8,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  navItem: {
    flex: 1,
    borderRadius: 0,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D85C43',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D85C43',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  navAddIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },
  navItemActive: {
    backgroundColor: 'transparent',
  },
  navIcon: {
    fontSize: 18,
    lineHeight: 20,
    color: '#9A948D',
  },
  navIconActive: {
    color: '#111111',
    fontWeight: '700',
  },
  navLabel: {
    color: '#7E786F',
    fontWeight: '600',
    fontSize: 9,
    letterSpacing: 0.4,
  },
  navLabelActive: {
    color: '#111111',
    fontWeight: '700',
  },
});
