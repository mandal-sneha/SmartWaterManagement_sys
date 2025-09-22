import React, { useState, useContext } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts'
import { ChevronDown, ChevronRight, Droplets, Calendar, Users, AlertTriangle } from 'lucide-react'
import { ThemeContext } from '../UserDashboard'

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  const { darkMode } = context;
  
  // Enhanced colors specifically for UsageInsights with better dark mode contrast
  const colors = {
    baseColor: darkMode ? '#0f0f23' : '#f8f6ff',
    cardBg: darkMode ? '#1a1a2e' : '#ffffff',
    textColor: darkMode ? '#e2e8f0' : '#4b0082',
    mutedText: darkMode ? '#94a3b8' : '#666666',
    borderColor: darkMode ? '#334155' : '#e0e0e0',
    primaryBg: darkMode ? '#4c6ef5' : '#6e8efb',
    primaryHover: darkMode ? '#3b5bdb' : '#5a67d8',
    secondaryBg: darkMode ? '#7c3aed' : '#a777e3',
    secondaryHover: darkMode ? '#6d28d9' : '#8b5cf6',
    accent: darkMode ? '#10b981' : '#48bb78',
    accentHover: darkMode ? '#059669' : '#38a169',
    danger: darkMode ? '#ef4444' : '#f56565',
    dangerHover: darkMode ? '#dc2626' : '#e53e3e',
    chartLine: darkMode ? '#06b6d4' : '#4fd1c5',
    chartBar: darkMode ? '#8b5cf6' : '#9f7aea',
    chartPie1: darkMode ? '#4c6ef5' : '#667eea',
    chartPie2: darkMode ? '#f59e0b' : '#f6ad55',
    chartPie3: darkMode ? '#10b981' : '#68d391',
    highlight: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(102, 126, 234, 0.1)',
    hoverBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'
  };
  
  return { darkMode, colors };
};

const UsageInsights = () => {
  const { darkMode, colors } = useTheme();
  const [expandedMonths, setExpandedMonths] = useState({})

  const dailyUsageData = [
    { name: 'Primary Members', value: 220, color: colors.chartPie1 },
    { name: 'Extra Water', value: 85, color: colors.chartPie2 },
    { name: 'Water by Guests', value: 30, color: colors.chartPie3 }
  ]

  const monthlyLineData = [
    { day: 1, usage: 280 }, { day: 2, usage: 320 }, { day: 3, usage: 290 },
    { day: 4, usage: 350 }, { day: 5, usage: 310 }, { day: 6, usage: 270 },
    { day: 7, usage: 400 }, { day: 8, usage: 290 }, { day: 9, usage: 310 },
    { day: 10, usage: 330 }, { day: 11, usage: 280 }, { day: 12, usage: 360 },
    { day: 13, usage: 290 }, { day: 14, usage: 320 }, { day: 15, usage: 340 },
    { day: 16, usage: 310 }, { day: 17, usage: 290 }, { day: 18, usage: 380 },
    { day: 19, usage: 320 }, { day: 20, usage: 300 }, { day: 21, usage: 290 },
    { day: 22, usage: 350 }, { day: 23, usage: 310 }, { day: 24, usage: 290 },
    { day: 25, usage: 330 }, { day: 26, usage: 370 }, { day: 27, usage: 290 },
    { day: 28, usage: 320 }, { day: 29, usage: 310 }, { day: 30, usage: 340 }
  ]

  const yearlyBarData = [
    { month: 'Jan', usage: 9500 }, { month: 'Feb', usage: 8800 }, { month: 'Mar', usage: 9200 },
    { month: 'Apr', usage: 9800 }, { month: 'May', usage: 10200 }, { month: 'Jun', usage: 11500 },
    { month: 'Jul', usage: 12800 }, { month: 'Aug', usage: 12200 }, { month: 'Sep', usage: 10800 },
    { month: 'Oct', usage: 9600 }, { month: 'Nov', usage: 8900 }, { month: 'Dec', usage: 9100 }
  ]

  const generateFineAmount = () => {
    // Generate random fine amounts between ₹50 to ₹500
    const amounts = [50, 75, 100, 150, 200, 250, 300, 350, 400, 500];
    return amounts[Math.floor(Math.random() * amounts.length)];
  }

  const generateMonthData = (days) => {
    const data = []
    for (let i = 1; i <= days; i++) {
      const hasFine = Math.random() < 0.15
      data.push({
        date: i,
        waterUsed: Math.floor(Math.random() * 200) + 250,
        guests: Math.floor(Math.random() * 8),
        hasFine: hasFine,
        fineAmount: hasFine ? generateFineAmount() : 0
      })
    }
    return data
  }

  const monthsData = {
    'January': { days: 31, data: generateMonthData(31) },
    'February': { days: 28, data: generateMonthData(28) },
    'March': { days: 31, data: generateMonthData(31) },
    'April': { days: 30, data: generateMonthData(30) },
    'May': { days: 31, data: generateMonthData(31) },
    'June': { days: 30, data: generateMonthData(30) },
    'July': { days: 31, data: generateMonthData(31) },
    'August': { days: 31, data: generateMonthData(31) },
    'September': { days: 30, data: generateMonthData(30) },
    'October': { days: 31, data: generateMonthData(31) },
    'November': { days: 30, data: generateMonthData(30) },
    'December': { days: 31, data: generateMonthData(31) }
  }

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }))
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-lg shadow-md border" style={{ 
          backgroundColor: colors.cardBg, 
          borderColor: colors.borderColor,
          boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <p className="font-medium" style={{ color: colors.textColor }}>{`${label}: ${payload[0].value}L`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.baseColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {/* Today's Usage Card */}
          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: darkMode ? 'rgba(76, 110, 245, 0.3)' : 'rgba(102, 126, 234, 0.1)' }}>
                <Droplets className="w-5 h-5" style={{ color: colors.primaryBg }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.textColor }}>Today's Usage</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={dailyUsageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dailyUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
              <div>
                <p className="text-sm" style={{ color: colors.mutedText }}>Total Consumption</p>
                <p className="text-xl font-bold" style={{ color: colors.textColor }}>335L</p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: colors.mutedText }}>Compared to avg.</p>
                <p className="text-lg font-medium" style={{ color: colors.accent }}>+12%</p>
              </div>
            </div>
          </div>

          {/* Monthly Trend Card */}
          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: darkMode ? 'rgba(6, 182, 212, 0.3)' : 'rgba(79, 209, 197, 0.1)' }}>
                <Calendar className="w-5 h-5" style={{ color: colors.chartLine }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.textColor }}>30-Day Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyLineData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.mutedText, fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.mutedText, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke={colors.chartLine}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: colors.chartLine }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
              <div>
                <p className="text-sm" style={{ color: colors.mutedText }}>Avg. Daily Usage</p>
                <p className="text-lg font-medium" style={{ color: colors.textColor }}>315L</p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: colors.mutedText }}>Peak Usage</p>
                <p className="text-lg font-medium" style={{ color: colors.danger }}>400L</p>
              </div>
            </div>
          </div>

          {/* Yearly Overview Card */}
          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
            boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: darkMode ? 'rgba(124, 58, 237, 0.3)' : 'rgba(159, 122, 234, 0.1)' }}>
                <Calendar className="w-5 h-5" style={{ color: colors.chartBar }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.textColor }}>Yearly Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yearlyBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.borderColor} vertical={false} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.mutedText, fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: colors.mutedText, fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="usage" 
                  fill={colors.chartBar}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
              <div>
                <p className="text-sm" style={{ color: colors.mutedText }}>Total Annual Usage</p>
                <p className="text-lg font-medium" style={{ color: colors.textColor }}>112,500L</p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: colors.mutedText }}>Highest Month</p>
                <p className="text-lg font-medium" style={{ color: colors.secondaryBg }}>July</p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Breakdown Card */}
        <div className="rounded-xl p-5 mb-8" style={{ 
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`,
          boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: darkMode ? 'rgba(76, 110, 245, 0.3)' : 'rgba(102, 126, 234, 0.1)' }}>
              <Calendar className="w-5 h-5" style={{ color: colors.primaryBg }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: colors.textColor }}>Monthly Breakdown</h2>
          </div>
          
          <div className="space-y-3">
            {Object.entries(monthsData).map(([month, data]) => (
              <div key={month} className="rounded-lg overflow-hidden" style={{ 
                border: `1px solid ${colors.borderColor}`
              }}>
                <button
                  onClick={() => toggleMonth(month)}
                  className="w-full p-4 flex items-center justify-between transition-colors duration-200"
                  style={{ 
                    backgroundColor: expandedMonths[month] ? colors.highlight : 'transparent',
                  }}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-4" style={{ 
                      color: colors.textColor,
                      minWidth: '100px',
                      textAlign: 'left'
                    }}>{month}</span>
                    <div className="flex space-x-3">
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.primaryBg }} />
                        <span style={{ color: colors.mutedText }}>{data.days} days</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.accent }} />
                        <span style={{ color: colors.mutedText }}>
                          {data.data.reduce((sum, day) => sum + day.waterUsed, 0)}L
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.danger }} />
                        <span style={{ color: colors.mutedText }}>
                          {data.data.filter(day => day.hasFine).length} fines
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedMonths[month] ? 
                    <ChevronDown className="w-5 h-5" style={{ color: colors.mutedText }} /> : 
                    <ChevronRight className="w-5 h-5" style={{ color: colors.mutedText }} />
                  }
                </button>
                
                {expandedMonths[month] && (
                  <div className="p-4" style={{ 
                    backgroundColor: colors.highlight,
                    borderTop: `1px solid ${colors.borderColor}`
                  }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-2">
                      {data.data.map((day) => (
                        <div
                          key={day.date}
                          className="p-3 rounded-lg transition-all duration-200 hover:shadow-sm"
                          style={{
                            backgroundColor: day.hasFine 
                              ? (darkMode ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 101, 101, 0.1)')
                              : colors.cardBg,
                            border: `1px solid ${day.hasFine 
                              ? (darkMode ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 101, 101, 0.2)')
                              : colors.borderColor}`,
                          }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium" style={{ color: colors.textColor }}>Day {day.date}</span>
                            {day.hasFine && (
                              <AlertTriangle className="w-4 h-4" style={{ color: colors.danger }} />
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Droplets className="w-3 h-3 mr-2" style={{ color: colors.primaryBg }} />
                              <span style={{ color: colors.mutedText }}>{day.waterUsed}L used</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-2" style={{ color: colors.accent }} />
                              <span style={{ color: colors.mutedText }}>{day.guests} guests</span>
                            </div>
                          </div>
                          
                          {day.hasFine && (
                            <div className="mt-2 text-xs font-medium" style={{ color: colors.danger }}>
                              ⚠️ Fine: ₹{day.fineAmount}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Card */}
        <div className="rounded-xl p-6 text-center" style={{ 
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`,
          boxShadow: darkMode ? '0 1px 3px rgba(0, 0, 0, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 rounded-full mr-2" style={{ backgroundColor: darkMode ? 'rgba(76, 110, 245, 0.3)' : 'rgba(102, 126, 234, 0.1)' }}>
              <Droplets className="w-5 h-5" style={{ color: colors.primaryBg }} />
            </div>
            <span className="text-xl">💧</span>
          </div>
          <h3 className="text-lg font-medium mb-1" style={{ color: colors.textColor }}>Smart Water Management</h3>
          <p className="text-sm" style={{ color: colors.mutedText }}>
            Track, analyze and optimize your water consumption
          </p>
        </div>
      </div>
    </div>
  )
}

export default UsageInsights