import Groq from 'groq-sdk'
import { 
  ColumnInfo, 
  AIAnalysisResult, 
  DataChat, 
  ChartSuggestion, 
  Insight 
} from '@/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
const MODEL = 'llama-3.3-70b-versatile'

/**
 * Utility to clean JSON responses from LLM (removes markdown backticks)
 */
function cleanJSONResponse(text: string): string {
  return text.replace(/```json\n?|```/g, '').trim()
}

export async function analyzeDataset(
  columns: ColumnInfo[],
  sampleData: Record<string, any>[],
  datasetName: string
): Promise<AIAnalysisResult> {
  try {
    const prompt = `You are a data analyst expert. Analyze this dataset and provide insights. Return ONLY valid JSON, no markdown.

Dataset: ${datasetName}
Columns: ${JSON.stringify(columns)}
Sample Data (first 10 rows): ${JSON.stringify(sampleData.slice(0, 10))}

Return this exact JSON structure:
{
  "summary": "2-3 sentence overview of the dataset",
  "key_insights": ["insight 1", "insight 2", "insight 3"],
  "anomalies": ["anomaly 1 if any"],
  "trends": ["trend 1", "trend 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "chart_suggestions": [
    {
      "chart_type": "bar|line|pie|area|scatter",
      "x_axis": "column name",
      "y_axis": "column name",
      "title": "chart title",
      "reasoning": "why this chart"
    }
  ]
}`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user' as const, content: prompt }],
      model: MODEL,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content || ''
    return JSON.parse(cleanJSONResponse(content))
  } catch (error) {
    console.error('Error in analyzeDataset:', error)
    throw error
  }
}

export async function answerDataQuestion(
  question: string,
  columns: ColumnInfo[],
  sampleData: Record<string, any>[],
  chatHistory: DataChat[]
): Promise<{ answer: string; chartSuggestion: ChartSuggestion | null }> {
  try {
    const systemPrompt = `You are a data analyst assistant. Answer questions about the dataset clearly and concisely. If a chart would help visualize the answer, suggest one. Return ONLY valid JSON:
{ 
  "answer": "text answer", 
  "chart_suggestion": null or { "chart_type": "string", "x_axis": "string", "y_axis": "string", "title": "string", "reasoning": "string" } 
}`

    const contextPrompt = `Dataset Columns: ${JSON.stringify(columns)}
Sample Data: ${JSON.stringify(sampleData.slice(0, 5))}
Question: ${question}`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-6).map(chat => ({
        role: chat.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: chat.content
      })),
      { role: 'user' as const, content: contextPrompt }
    ]

    const completion = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content || ''
    const parsed = JSON.parse(cleanJSONResponse(content))
    
    return {
      answer: parsed.answer,
      chartSuggestion: parsed.chart_suggestion
    }
  } catch (error) {
    console.error('Error in answerDataQuestion:', error)
    throw error
  }
}

export async function generateInsightSummary(
  insights: Insight[]
): Promise<string> {
  try {
    const prompt = `Summarize all the following data insights into one executive paragraph. Return only the plain text string.

Insights:
${insights.map(i => `- ${i.title}: ${i.content}`).join('\n')}`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user' as const, content: prompt }],
      model: MODEL,
      temperature: 0.5,
    })

    return completion.choices[0]?.message?.content?.trim() || ''
  } catch (error) {
    console.error('Error in generateInsightSummary:', error)
    throw error
  }
}

export async function detectAnomalies(
  data: Record<string, any>[],
  columns: ColumnInfo[]
): Promise<string[]> {
  try {
    const numericCols = columns.filter(c => c.type === 'number')
    const prompt = `Look for statistical anomalies in the numeric columns of this dataset. Focus on outliers, unexpected distributions, or strange correlations. Return a JSON array of up to 5 anomaly descriptions. Return ONLY the JSON array, no markdown.

Columns: ${JSON.stringify(numericCols)}
Data Sample: ${JSON.stringify(data.slice(0, 20))}

Example output: ["The 'Revenue' column has 3 significant outliers above $1M", "Unexpected negative values found in 'StockLevel'"]`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user' as const, content: prompt }],
      model: MODEL,
      temperature: 0.3,
    })

    const content = completion.choices[0]?.message?.content || ''
    return JSON.parse(cleanJSONResponse(content))
  } catch (error) {
    console.error('Error in detectAnomalies:', error)
    return []
  }
}
