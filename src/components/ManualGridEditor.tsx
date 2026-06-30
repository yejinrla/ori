import { Pressable, Text, TextInput, View } from 'react-native';

import type { ManualItemRow } from '../data';
import { styles } from '../styles';

export function ManualGridEditor({
  rows,
  namePlaceholder,
  amountPlaceholder,
  onNameChange,
  onAmountChange,
  onAddRow,
  onRemoveRow,
}: {
  rows: ManualItemRow[];
  namePlaceholder: string;
  amountPlaceholder: string;
  onNameChange: (rowId: string, value: string) => void;
  onAmountChange: (rowId: string, value: string) => void;
  onAddRow: () => void;
  onRemoveRow: (rowId: string) => void;
}) {
  return (
    <View style={styles.manualGridBox}>
      <View style={styles.manualGridHeader}>
        <Text style={styles.manualGridHeaderText}>항목</Text>
        <Text style={styles.manualGridHeaderText}>수량</Text>
        <View style={styles.manualGridRowActionSpacer} />
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
          <Pressable
            style={styles.manualGridDelete}
            onPress={() => onRemoveRow(row.id)}
            hitSlop={6}
          >
            <Text style={styles.manualGridDeleteText}>−</Text>
          </Pressable>
        </View>
      ))}
      <Pressable style={styles.manualGridAddButton} onPress={onAddRow}>
        <Text style={styles.manualGridAddText}>+ 행 추가</Text>
      </Pressable>
    </View>
  );
}
