import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Screen } from '../../src/components/Screen';
import { cookingLog, mealSlots, weekdayLabels, type DayMeals, type Recipe } from '../../src/data';
import { useRecipes } from '../../src/store';
import { styles } from '../../src/styles';

export default function CalendarScreen() {
  const { recipes } = useRecipes();
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // 0-indexed: 5 = 6월
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-06-30');

  const toIso = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);

  const goMonth = (delta: number) => {
    setSelectedDate(null);
    const next = calendarMonth + delta;
    if (next < 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else if (next > 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth(next);
    }
  };

  const dayMeals = selectedDate ? cookingLog[selectedDate] : undefined;
  const recipesForMeal = (key: keyof DayMeals) =>
    (dayMeals?.[key] ?? [])
      .map((id) => recipes.find((recipe) => recipe.id === id))
      .filter((recipe): recipe is Recipe => Boolean(recipe));

  const selectedLabel = selectedDate
    ? `${Number(selectedDate.slice(5, 7))}월 ${Number(selectedDate.slice(8, 10))}일`
    : null;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.calendarContent} showsVerticalScrollIndicator={false}>
        <View style={styles.calMonthBar}>
          <Pressable hitSlop={8} onPress={() => goMonth(-1)} style={styles.calMonthNav}>
            <Text style={styles.calMonthNavText}>‹</Text>
          </Pressable>
          <Text style={styles.calMonthLabel}>
            {calendarYear}년 {calendarMonth + 1}월
          </Text>
          <Pressable hitSlop={8} onPress={() => goMonth(1)} style={styles.calMonthNav}>
            <Text style={styles.calMonthNavText}>›</Text>
          </Pressable>
        </View>

        <View style={styles.calWeekRow}>
          {weekdayLabels.map((labelText, index) => (
            <View key={labelText} style={styles.calCell}>
              <Text
                style={[
                  styles.calWeekText,
                  index === 0 && styles.calSunday,
                  index === 6 && styles.calSaturday,
                ]}
              >
                {labelText}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.calGrid}>
          {cells.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.calCell} />;
            }
            const iso = toIso(calendarYear, calendarMonth, day);
            const isSelected = iso === selectedDate;
            const dayLog = cookingLog[iso];
            const hasLog = dayLog
              ? dayLog.breakfast.length + dayLog.lunch.length + dayLog.dinner.length > 0
              : false;
            const weekday = index % 7;
            return (
              <View key={iso} style={styles.calCell}>
                <Pressable
                  onPress={() => setSelectedDate(iso)}
                  style={[styles.calDay, isSelected && styles.calDaySelected]}
                >
                  <Text
                    style={[
                      styles.calDayText,
                      weekday === 0 && styles.calSunday,
                      weekday === 6 && styles.calSaturday,
                      isSelected && styles.calDayTextSelected,
                    ]}
                  >
                    {day}
                  </Text>
                  <View
                    style={[
                      styles.calDot,
                      hasLog && styles.calDotActive,
                      isSelected && hasLog && styles.calDotOnSelected,
                    ]}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>

        <View style={styles.calLogSection}>
          <Text style={styles.calLogTitle}>
            {selectedLabel ? `${selectedLabel} 식단` : '날짜를 선택해보세요'}
          </Text>
          {selectedDate
            ? mealSlots.map((meal) => {
                const list = recipesForMeal(meal.key);
                return (
                  <View key={meal.key} style={styles.calMealBlock}>
                    <Text style={styles.calMealLabel}>
                      {meal.emoji} {meal.label}
                    </Text>
                    {list.length === 0 ? (
                      <Text style={styles.calMealEmpty}>기록 없음</Text>
                    ) : (
                      list.map((recipe) => (
                        <Pressable
                          key={`${meal.key}-${recipe.id}`}
                          style={styles.calRecipeRow}
                          onPress={() => router.push(`/recipe/${recipe.id}`)}
                        >
                          <Text style={styles.calRecipeEmoji}>{recipe.image}</Text>
                          <View style={styles.calRecipeText}>
                            <Text style={styles.calRecipeTitle}>{recipe.title}</Text>
                            <Text style={styles.calRecipeMeta}>
                              {recipe.category}
                              {recipe.cookTime ? ` · ${recipe.cookTime}` : ''}
                            </Text>
                          </View>
                          <Text style={styles.calRecipeChevron}>›</Text>
                        </Pressable>
                      ))
                    )}
                  </View>
                );
              })
            : null}
        </View>
      </ScrollView>
    </Screen>
  );
}
