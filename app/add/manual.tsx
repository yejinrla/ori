import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { FormField } from '../../src/components/FormField';
import { ManualGridEditor } from '../../src/components/ManualGridEditor';
import { Screen } from '../../src/components/Screen';
import { emptyManualForm, splitIngredientText, type ManualItemRow, type Recipe } from '../../src/data';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function ManualFormScreen() {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { addRecipe, getRecipe, updateRecipe } = useRecipes();
  const [manualForm, setManualForm] = useState(emptyManualForm);
  const editingRecipe = editId ? getRecipe(editId) : undefined;
  const isEditing = Boolean(editingRecipe);

  useEffect(() => {
    if (!editingRecipe) {
      setManualForm(emptyManualForm);
      return;
    }

    const toRows = (items: string[], field: 'ingredient' | 'seasoning') =>
      items.length
        ? items.map((item, index) => {
            const parsed = splitIngredientText(item);
            return {
              id: `${field}-${index}`,
              name: parsed.name,
              amount: parsed.amount,
            };
          })
        : [{ id: `${field}-0`, name: '', amount: '' }];

    setManualForm({
      title: editingRecipe.title,
      category: editingRecipe.category,
      photo: editingRecipe.photo ?? null,
      ingredients: toRows(editingRecipe.ingredients, 'ingredient'),
      seasonings: toRows(editingRecipe.seasonings, 'seasoning'),
      steps: editingRecipe.steps.join('\n'),
      memo: editingRecipe.memo,
      tags: editingRecipe.tags.join(' '),
    });
  }, [editingRecipe]);

  const pickPhoto = async () => {
    if (Platform.OS !== 'web') {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]?.uri) {
      return;
    }

    setManualForm((current) => ({ ...current, photo: result.assets[0].uri }));
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

  const removeManualRow = (field: 'ingredients' | 'seasonings', rowId: string) => {
    setManualForm((current) => ({
      ...current,
      [field]: current[field].filter((row) => row.id !== rowId),
    }));
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
      id: editingRecipe?.id ?? Date.now().toString(),
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
      image: editingRecipe?.image ?? '🍳',
      photo: manualForm.photo ?? undefined,
      sourceType: editingRecipe?.sourceType ?? 'manual',
      favorite: editingRecipe?.favorite ?? false,
      addedAt: editingRecipe?.addedAt ?? '2026.06.30',
      cookTime: editingRecipe?.cookTime,
      rating: editingRecipe?.rating,
      sourceUrl: editingRecipe?.sourceUrl,
    };

    if (isEditing) {
      updateRecipe(recipe);
    } else {
      addRecipe(recipe);
    }
    setManualForm(emptyManualForm);
    router.replace(`/recipe/${recipe.id}`);
  };

  return (
    <Screen back title={isEditing ? '레시피 수정' : '직접 작성'}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.screenDescription, styles.manualScreenDescription]}>
          {isEditing
            ? '재료, 양념, 조리 순서와 메모를 수정해 나만의 레시피를 업데이트하세요.'
            : '메모처럼 적어도 번호와 태그가 자동 정리되는 개인 레시피 작성 화면입니다.'}
        </Text>
        <View style={styles.formCard}>
          <Pressable style={styles.photoUploadCard} onPress={pickPhoto}>
            {manualForm.photo ? (
              <>
                <Image source={{ uri: manualForm.photo }} style={styles.photoUploadPreview} />
                <View style={styles.photoUploadFooter}>
                  <Text style={styles.photoUploadAction}>사진 변경</Text>
                  <Pressable
                    hitSlop={8}
                    onPress={(event) => {
                      event.stopPropagation();
                      setManualForm((current) => ({ ...current, photo: null }));
                    }}
                  >
                    <Text style={styles.photoUploadRemove}>삭제</Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.photoUploadPlaceholder}>
                <Text style={styles.photoUploadPlus}>+</Text>
                <Text style={styles.photoUploadTitle}>사진 등록</Text>
                <Text style={styles.photoUploadDescription}>
                  레시피 사진을 올리면 카드와 상세 화면에 함께 보여요.
                </Text>
              </View>
            )}
          </Pressable>
          <FormField label="제목">
            <TextInput
              style={styles.input}
              value={manualForm.title}
              onChangeText={(value) => setManualForm((current) => ({ ...current, title: value }))}
              placeholder="예: 김치찌개"
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
              onAmountChange={(rowId, value) =>
                updateManualRows('ingredients', rowId, 'amount', value)
              }
              onAddRow={() => addManualRow('ingredients')}
              onRemoveRow={(rowId) => removeManualRow('ingredients', rowId)}
            />
          </FormField>
          <FormField label="양념">
            <ManualGridEditor
              rows={manualForm.seasonings}
              namePlaceholder="예: 고추장"
              amountPlaceholder="예: 2큰술"
              onNameChange={(rowId, value) => updateManualRows('seasonings', rowId, 'name', value)}
              onAmountChange={(rowId, value) =>
                updateManualRows('seasonings', rowId, 'amount', value)
              }
              onAddRow={() => addManualRow('seasonings')}
              onRemoveRow={(rowId) => removeManualRow('seasonings', rowId)}
            />
          </FormField>
          <FormField label="조리 순서">
            <TextInput
              style={[styles.input, styles.textArea, styles.stepsTextArea]}
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
            <Text style={styles.primaryButtonText}>{isEditing ? '수정 저장' : '레시피 저장'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}
