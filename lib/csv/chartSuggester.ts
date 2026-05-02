import { ChartSuggestion, ColumnInfo } from '@/types'
import { detectDateColumn, getNumericColumns, getCategoricalColumns } from './parser'

export function suggestCharts(columns: ColumnInfo[]): ChartSuggestion[] {
  const suggestions: ChartSuggestion[] = []
  
  const dateCol = detectDateColumn(columns)
  const numericCols = getNumericColumns(columns)
  const categoricalCols = getCategoricalColumns(columns)

  // 1. Trend over time (Line Chart)
  if (dateCol && numericCols.length > 0) {
    suggestions.push({
      chart_type: 'line',
      x_axis: dateCol,
      y_axis: numericCols[0].name,
      title: `${numericCols[0].name} Trend over Time`,
      reasoning: 'Line charts are ideal for showing trends over time using date columns.'
    })
  }

  // 2. Categorical Comparison (Bar Chart)
  if (categoricalCols.length > 0 && numericCols.length > 0) {
    suggestions.push({
      chart_type: 'bar',
      x_axis: categoricalCols[0].name,
      y_axis: numericCols[0].name,
      title: `${numericCols[0].name} by ${categoricalCols[0].name}`,
      reasoning: 'Bar charts are great for comparing values across different categories.'
    })
  }

  // 3. Correlation (Scatter Plot)
  if (numericCols.length >= 2) {
    suggestions.push({
      chart_type: 'scatter',
      x_axis: numericCols[0].name,
      y_axis: numericCols[1].name,
      title: `${numericCols[0].name} vs ${numericCols[1].name}`,
      reasoning: 'Scatter plots help visualize the relationship and correlation between two numeric variables.'
    })
  }

  // 4. Distribution (Pie Chart)
  const smallCategorical = categoricalCols.find(col => col.unique_count > 1 && col.unique_count <= 10)
  if (smallCategorical && numericCols.length > 0) {
    suggestions.push({
      chart_type: 'pie',
      x_axis: smallCategorical.name,
      y_axis: numericCols[0].name,
      title: `${numericCols[0].name} Distribution by ${smallCategorical.name}`,
      reasoning: 'Pie charts are effective for showing proportions when there are few categories.'
    })
  }

  // 5. Volume/Cumulative (Area Chart)
  if (numericCols.length >= 2 && dateCol) {
    suggestions.push({
      chart_type: 'area',
      x_axis: dateCol,
      y_axis: numericCols[0].name,
      title: `Cumulative ${numericCols[0].name} over Time`,
      reasoning: 'Area charts are useful for showing cumulative totals or volume over time.'
    })
  }

  return suggestions.slice(0, 5)
}
