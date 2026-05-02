import { ColumnInfo, ParsedCSV } from '@/types'
const Papa = require('papaparse')

export function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const data = results.data
        const fields = results.meta.fields || []
        const columns = analyzeColumns(data, fields)
        
        resolve({
          columns,
          data,
          row_count: data.length,
          column_count: fields.length
        })
      },
      error: (error: any) => {
        reject(error)
      }
    })
  })
}

export function analyzeColumns(
  data: Record<string, any>[],
  fields: string[]
): ColumnInfo[] {
  return fields.map(field => {
    const values = data.map(row => row[field]).filter(val => val !== null && val !== undefined)
    const uniqueValues = new Set(values)
    const nullCount = data.length - values.length
    
    // Type detection
    let type: 'number' | 'string' | 'date' | 'boolean' = 'string'
    
    if (values.length > 0) {
      const allNumbers = values.every(val => typeof val === 'number')
      const allBooleans = values.every(val => typeof val === 'boolean')
      const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?Z?$/
      const allDates = values.every(val => {
        if (typeof val !== 'string') return false
        return !isNaN(Date.parse(val)) && (datePattern.test(val) || !isNaN(new Date(val).getTime()))
      })

      if (allNumbers) {
        type = 'number'
      } else if (allBooleans) {
        type = 'boolean'
      } else if (allDates) {
        type = 'date'
      }
    }

    const columnInfo: ColumnInfo = {
      name: field,
      type,
      unique_count: uniqueValues.size,
      null_count: nullCount,
      sample_values: values.slice(0, 3)
    }

    if (type === 'number') {
      const numericValues = values as number[]
      columnInfo.min = Math.min(...numericValues)
      columnInfo.max = Math.max(...numericValues)
      columnInfo.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
    }

    return columnInfo
  })
}

export function aggregateData(
  data: Record<string, any>[],
  xAxis: string,
  yAxis: string,
  aggregation: string,
  groupBy?: string
): Record<string, any>[] {
  const groups: Record<string, any[]> = {}

  data.forEach(row => {
    const key = String(row[xAxis])
    if (!groups[key]) groups[key] = []
    groups[key].push(row)
  })

  return Object.entries(groups).map(([key, groupRows]) => {
    const result: Record<string, any> = { [xAxis]: key }

    if (groupBy) {
      const subGroups: Record<string, any[]> = {}
      groupRows.forEach(row => {
        const subKey = String(row[groupBy])
        if (!subGroups[subKey]) subGroups[subKey] = []
        subGroups[subKey].push(row)
      })

      Object.entries(subGroups).forEach(([subKey, subGroupRows]) => {
        result[subKey] = performAggregation(subGroupRows, yAxis, aggregation)
      })
    } else {
      result[yAxis] = performAggregation(groupRows, yAxis, aggregation)
    }

    return result
  })
}

function performAggregation(data: any[], field: string, type: string): number {
  const values = data.map(row => row[field]).filter(val => typeof val === 'number')
  if (values.length === 0) return 0

  switch (type) {
    case 'sum':
      return values.reduce((a, b) => a + b, 0)
    case 'count':
      return values.length
    case 'average':
      return values.reduce((a, b) => a + b, 0) / values.length
    case 'min':
      return Math.min(...values)
    case 'max':
      return Math.max(...values)
    default:
      return 0
  }
}

export function detectDateColumn(columns: ColumnInfo[]): string | null {
  const dateCol = columns.find(col => col.type === 'date')
  return dateCol ? dateCol.name : null
}

export function getNumericColumns(columns: ColumnInfo[]): ColumnInfo[] {
  return columns.filter(col => col.type === 'number')
}

export function getCategoricalColumns(columns: ColumnInfo[]): ColumnInfo[] {
  return columns.filter(col => 
    (col.type === 'string' || col.type === 'boolean') && col.unique_count < 50
  )
}
