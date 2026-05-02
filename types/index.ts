export interface Dataset { 
  id: string 
  user_id: string 
  name: string 
  description: string | null 
  file_name: string 
  row_count: number 
  column_count: number 
  columns: ColumnInfo[] 
  preview_data: Record<string, any>[] 
  full_data?: Record<string, any>[] 
  file_size: number 
  created_at: string 
  updated_at: string 
} 

export interface ColumnInfo { 
  name: string 
  type: 'number' | 'string' | 'date' | 'boolean' 
  sample_values: any[] 
  unique_count: number 
  null_count: number 
  min?: number 
  max?: number 
  mean?: number 
} 

export interface Dashboard { 
  id: string 
  user_id: string 
  dataset_id: string 
  name: string 
  description: string | null 
  is_pinned: boolean 
  created_at: string 
  updated_at: string 
  dataset?: Dataset 
  charts?: Chart[] 
} 

export interface Chart { 
  id: string 
  dashboard_id: string 
  user_id: string 
  title: string 
  chart_type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed' 
  x_axis: string | null 
  y_axis: string | null 
  group_by: string | null 
  aggregation: 'sum' | 'count' | 'average' | 'min' | 'max' 
  config: Record<string, any> 
  position: number 
  created_at: string 
} 

export interface Insight { 
  id: string 
  dashboard_id: string 
  user_id: string 
  type: 'summary' | 'anomaly' | 'trend' | 'recommendation' | 'answer' 
  title: string 
  content: string 
  question: string | null 
  created_at: string 
} 

export interface DataChat { 
  id: string 
  dashboard_id: string 
  user_id: string 
  role: 'user' | 'assistant' 
  content: string 
  chart_suggestion: ChartSuggestion | null 
  created_at: string 
} 

export interface ChartSuggestion { 
  chart_type: string 
  x_axis: string 
  y_axis: string 
  title: string 
  reasoning: string 
} 

export interface ParsedCSV { 
  columns: ColumnInfo[] 
  data: Record<string, any>[] 
  row_count: number 
  column_count: number 
  preview?: any[] 
} 

export interface AIAnalysisResult { 
  summary: string 
  key_insights: string[] 
  anomalies: string[] 
  trends: string[] 
  recommendations: string[] 
  chart_suggestions: ChartSuggestion[] 
} 
