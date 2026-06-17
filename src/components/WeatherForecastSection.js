import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import weatherData from "../../brasilia_week.json";
import colors from "../theme/colors";
import typography from "../theme/typography";

export default function WeatherForecastSection() {
  const generatedAt = new Date(weatherData.generatedAt).toLocaleString("pt-BR");

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.sectionTitle}>Previsão da semana em Brasília</Text>
          <Text style={styles.sectionSubtitle}>
            Painel local atualizado via Open-Meteo em {generatedAt}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {weatherData.forecast.map((day) => (
          <View
            key={day.date}
            style={[
              styles.card,
              {
                backgroundColor: day.palette.background,
                borderColor: day.palette.border,
              },
            ]}
          >
            <Text style={styles.date}>{day.displayDate}</Text>
            <Text style={styles.emoji}>{day.emoji}</Text>
            <Text style={[styles.label, { color: day.palette.accent }]}>
              {day.climateLabel}
            </Text>
            <Text style={styles.condition}>{day.condition}</Text>

            <View style={styles.metricRow}>
              <Text style={styles.metric}>Max {day.temperatureMax}°C</Text>
              <Text style={styles.metric}>Min {day.temperatureMin}°C</Text>
            </View>
            <Text style={styles.metric}>Chuva {day.rainVolume} mm</Text>

            <Text style={styles.recommendation}>{day.recommendation}</Text>

            <View style={styles.actionsWrap}>
              {day.suggestedActions.map((action) => (
                <View key={`${day.date}-${action}`} style={styles.actionChip}>
                  <Text style={styles.actionText}>{action}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  headerRow: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 30,
    color: colors.text,
    fontFamily: typography.display,
  },
  sectionSubtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSoft,
    fontFamily: typography.body,
  },
  scrollContent: {
    paddingRight: 8,
  },
  card: {
    width: 250,
    borderRadius: 26,
    borderWidth: 1,
    padding: 18,
    marginRight: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.7,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  date: {
    fontSize: 13,
    color: colors.textSoft,
    marginBottom: 8,
    fontFamily: typography.body,
  },
  emoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  label: {
    fontSize: 28,
    marginBottom: 6,
    fontFamily: typography.display,
  },
  condition: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 12,
    lineHeight: 20,
    fontFamily: typography.body,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 6,
  },
  metric: {
    fontSize: 13,
    color: colors.text,
    fontFamily: typography.body,
  },
  recommendation: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: colors.text,
    fontFamily: typography.body,
  },
  actionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  actionChip: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 12,
    color: colors.text,
    fontFamily: typography.body,
  },
});
