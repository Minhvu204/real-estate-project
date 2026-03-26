import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { RootStackParamList } from "../../types/navigation";
import { useCreateAppointment } from "../../hooks/useAppointments";

type BookRouteProp = RouteProp<RootStackParamList, "BookAppointment">;

interface TimeSlot {
  time: Date | null;
  note: string;
}

const MAX_SLOTS = 3;

export default function BookAppointmentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<BookRouteProp>();
  const { propertyId } = route.params;

  const createMutation = useCreateAppointment();

  /* ── State ── */
  const [slots, setSlots] = useState<TimeSlot[]>([{ time: null, note: "" }]);
  const [location, setLocation] = useState("");

  // DateTimePicker state (Android shows modal, iOS inline)
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  /* ── Slot management ── */
  const addSlot = useCallback(() => {
    if (slots.length >= MAX_SLOTS) return;
    setSlots((prev) => [...prev, { time: null, note: "" }]);
  }, [slots.length]);

  const removeSlot = useCallback(
    (index: number) => {
      if (slots.length <= 1) return;
      setSlots((prev) => prev.filter((_, i) => i !== index));
    },
    [slots.length]
  );

  const updateNote = useCallback((index: number, text: string) => {
    setSlots((prev) =>
      prev.map((s, i) => (i === index ? { ...s, note: text } : s))
    );
  }, []);

  /* ── Date/Time picker ── */
  const openDatePicker = useCallback((index: number) => {
    setActiveSlotIndex(index);
    setTempDate(new Date());
    setPickerMode("date");
    setPickerVisible(true);
  }, []);

  const onPickerChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === "dismissed") {
        setPickerVisible(false);
        return;
      }

      const chosen = selectedDate || tempDate;

      if (pickerMode === "date") {
        // User picked date → now pick time
        setTempDate(chosen);
        if (Platform.OS === "android") {
          setPickerMode("time");
          // On Android, DateTimePicker closes after each pick, re-open for time
        } else {
          // iOS inline — switch to time mode
          setPickerMode("time");
        }
        return;
      }

      // pickerMode === "time" — finalize
      setPickerVisible(false);

      const finalDate = new Date(tempDate);
      finalDate.setHours(chosen.getHours(), chosen.getMinutes(), 0, 0);

      setSlots((prev) =>
        prev.map((s, i) =>
          i === activeSlotIndex ? { ...s, time: finalDate } : s
        )
      );
    },
    [pickerMode, tempDate, activeSlotIndex]
  );

  /* ── Validation & Submit ── */
  const handleSubmit = useCallback(() => {
    // Check at least 1 slot has time
    const filledSlots = slots.filter((s) => s.time !== null);
    if (filledSlots.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 khung giờ.");
      return;
    }

    // Check max 3
    if (filledSlots.length > MAX_SLOTS) {
      Alert.alert("Lỗi", `Chỉ được chọn tối đa ${MAX_SLOTS} khung giờ.`);
      return;
    }

    // Check future time
    const now = new Date();
    for (const slot of filledSlots) {
      if (slot.time! <= now) {
        Alert.alert("Lỗi", "Thời gian lịch hẹn phải ở tương lai.");
        return;
      }
    }

    // Check duplicate
    const timeSet = new Set<number>();
    for (const slot of filledSlots) {
      const val = slot.time!.getTime();
      if (timeSet.has(val)) {
        Alert.alert("Lỗi", "Khung giờ bị trùng. Vui lòng chọn thời gian khác nhau.");
        return;
      }
      timeSet.add(val);
    }

    // Build payload — convert Date → ISO string
    const times = filledSlots.map((s) => ({
      time: s.time!.toISOString(),
      ...(s.note.trim() ? { note: s.note.trim() } : {}),
    }));

    const body: any = { propertyId, times };
    if (location.trim()) body.location = location.trim();

    createMutation.mutate(body, {
      onSuccess: () => navigation.goBack(),
    });
  }, [slots, location, propertyId, createMutation, navigation]);

  const isLoading = createMutation.isPending;

  /* ── Format helper ── */
  const formatDateTime = (date: Date) => {
    return date.toLocaleString("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ── Render ── */
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Đặt lịch xem nhà</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#0ea5e9" />
          <Text style={styles.infoText}>
            Chọn tối đa 3 khung giờ. Agent sẽ xác nhận 1 trong các khung giờ bạn đề xuất.
          </Text>
        </View>

        {/* Time Slots */}
        <Text style={styles.sectionLabel}>Khung giờ đề xuất *</Text>
        {slots.map((slot, index) => (
          <View key={index} style={styles.slotCard}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotTitle}>Khung giờ {index + 1}</Text>
              {slots.length > 1 && (
                <Pressable onPress={() => removeSlot(index)} hitSlop={8}>
                  <Ionicons name="close-circle" size={22} color="#ef4444" />
                </Pressable>
              )}
            </View>

            {/* Pick date/time button */}
            <Pressable
              style={styles.datePickerBtn}
              onPress={() => openDatePicker(index)}
            >
              <Ionicons name="calendar-outline" size={18} color="#0ea5e9" />
              <Text
                style={[
                  styles.datePickerText,
                  !slot.time && styles.datePickerPlaceholder,
                ]}
              >
                {slot.time ? formatDateTime(slot.time) : "Chọn ngày & giờ…"}
              </Text>
            </Pressable>

            {/* Note */}
            <TextInput
              style={styles.noteInput}
              placeholder="Ghi chú (tuỳ chọn)…"
              placeholderTextColor="#94a3b8"
              value={slot.note}
              onChangeText={(text) => updateNote(index, text)}
            />
          </View>
        ))}

        {/* Add Slot Button */}
        {slots.length < MAX_SLOTS && (
          <Pressable style={styles.addSlotBtn} onPress={addSlot}>
            <Ionicons name="add-circle-outline" size={20} color="#0ea5e9" />
            <Text style={styles.addSlotText}>Thêm khung giờ</Text>
          </Pressable>
        )}

        {/* Location */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>
          Địa điểm hẹn (tuỳ chọn)
        </Text>
        <TextInput
          style={styles.locationInput}
          placeholder="Nhập địa điểm cụ thể…"
          placeholderTextColor="#94a3b8"
          value={location}
          onChangeText={setLocation}
        />

        {/* Submit */}
        <Pressable
          style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="#fff" />
              <Text style={styles.submitBtnText}>Gửi yêu cầu đặt lịch</Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      {/* DateTimePicker (Android modal / iOS inline) */}
      {pickerVisible && (
        <DateTimePicker
          value={tempDate}
          mode={pickerMode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={new Date()}
          onChange={onPickerChange}
        />
      )}
    </SafeAreaView>
  );
}

/* ── Styles ── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e2e8f0",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0f172a" },
  body: { flex: 1 },
  bodyContent: { padding: 20, paddingBottom: 40 },

  infoBanner: {
    flexDirection: "row",
    backgroundColor: "#e0f2fe",
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoText: { flex: 1, fontSize: 13, color: "#0369a1", lineHeight: 20 },

  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },

  slotCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e8f0",
  },
  slotHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  slotTitle: { fontSize: 14, fontWeight: "600", color: "#475569" },

  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 10,
    gap: 10,
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#cbd5e1",
  },
  datePickerText: { fontSize: 14, color: "#0f172a", fontWeight: "500" },
  datePickerPlaceholder: { color: "#94a3b8", fontWeight: "400" },

  noteInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: "#0f172a",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e8f0",
  },

  addSlotBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#0ea5e9",
    borderStyle: "dashed",
  },
  addSlotText: { fontSize: 14, fontWeight: "600", color: "#0ea5e9" },

  locationInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: "#0f172a",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e8f0",
  },

  submitBtn: {
    flexDirection: "row",
    backgroundColor: "#0ea5e9",
    paddingVertical: 16,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 32,
    shadowColor: "#0ea5e9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
});
