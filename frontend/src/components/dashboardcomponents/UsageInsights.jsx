import React, { useState, useEffect, useContext } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronRight, Droplets, Calendar, Users, AlertTriangle, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../UserDashboard';
import { axiosInstance } from '../../lib/axios';

const UsageInsights = () => {
  const { darkMode, colors } = useTheme();
  const [expandedMonths, setExpandedMonths] = useState({});
  const [dailyUsageData, setDailyUsageData] = useState([]);
  const [thirtyDayTrend, setThirtyDayTrend] = useState([]);
  const [yearlyOverview, setYearlyOverview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error("User not found in local storage.");
        }
        const user = JSON.parse(userStr);
        if (!user.waterId) {
          throw new Error("Water ID not found for the user.");
        }
        
        const response = await axiosInstance.get(`/user/${user.waterId}/get-insights`);
        
        if (response.data.success) {
          const { dailyUsage, thirtyDayTrend, yearlyOverview } = response.data.data;
          
          const pieColors = {
            'Primary Members': colors.primaryBg,
            'Extra Water': '#f59e0b',
            'Water by Guests': colors.accent || '#10b981',
          };
          
          const formattedPieData = dailyUsage.map(item => ({
            ...item,
            color: pieColors[item.name] || '#cccccc',
          }));
          
          setDailyUsageData(formattedPieData);
          setThirtyDayTrend(thirtyDayTrend);
          setYearlyOverview(yearlyOverview);
        } else {
          throw new Error(response.data.message || "Failed to fetch insights.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [colors.primaryBg, colors.accent]);
  
  const generateFineAmount = () => {
    const amounts = [50, 75, 100, 150, 200, 250, 300, 350, 400, 500];
    return amounts[Math.floor(Math.random() * amounts.length)];
  };

  const generateMonthData = (days) => {
    const data = [];
    for (let i = 1; i <= days; i++) {
      const hasFine = Math.random() < 0.15;
      data.push({
        date: i,
        waterUsed: Math.floor(Math.random() * 200) + 250,
        guests: Math.floor(Math.random() * 8),
        hasFine: hasFine,
        fineAmount: hasFine ? generateFineAmount() : 0,
      });
    }
    return data;
  };

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
  };

  const toggleMonth = (month) => {
    setExpandedMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

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
      );
    }
    return null;
  };
  
  if (loading) {
      return (
          <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
              <div className="text-center">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: colors.primaryBg }} />
                  <p className="text-lg font-semibold" style={{ color: colors.textColor }}>Loading Insights...</p>
              </div>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen p-6 flex items-center justify-center" style={{ backgroundColor: colors.baseColor }}>
              <div className="text-center p-8 rounded-xl" style={{ backgroundColor: colors.cardBg, border: `1px solid ${colors.danger || '#ef4444'}` }}>
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: colors.danger || '#ef4444' }} />
                  <p className="text-lg font-semibold" style={{ color: colors.textColor }}>Failed to load data</p>
                  <p className="text-sm mt-2" style={{ color: colors.mutedText }}>{error}</p>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: colors.baseColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(110, 142, 251, 0.1)' }}>
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
                <p className="text-xl font-bold" style={{ color: colors.textColor }}>{dailyUsageData.reduce((sum, item) => sum + item.value, 0)}L</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(79, 209, 197, 0.1)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#4fd1c5' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.textColor }}>30-Day Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={thirtyDayTrend}>
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
                  stroke={'#4fd1c5'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#4fd1c5' }}
                />
              </LineChart>
            </ResponsiveContainer>
             <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
              <div>
                <p className="text-sm" style={{ color: colors.mutedText }}>Avg. Daily Usage</p>
                <p className="text-lg font-medium" style={{ color: colors.textColor }}>
                  {Math.round(thirtyDayTrend.reduce((sum, item) => sum + item.usage, 0) / (thirtyDayTrend.length || 1))}L
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: colors.mutedText }}>Peak Usage</p>
                <p className="text-lg font-medium" style={{ color: colors.danger || '#ef4444' }}>{Math.max(0, ...thirtyDayTrend.map(item => item.usage))}L</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 transition-all duration-200 hover:shadow-md" style={{ 
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`
          }}>
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(167, 119, 227, 0.1)' }}>
                <Calendar className="w-5 h-5" style={{ color: '#a777e3' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: colors.textColor }}>Yearly Overview</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yearlyOverview}>
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
                  fill={colors.secondaryBg}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: `1px solid ${colors.borderColor}` }}>
              <div>
                <p className="text-sm" style={{ color: colors.mutedText }}>Total Annual Usage</p>
                 <p className="text-lg font-medium" style={{ color: colors.textColor }}>
                  {yearlyOverview.reduce((sum, item) => sum + item.usage, 0)}L
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: colors.mutedText }}>Highest Month</p>
                <p className="text-lg font-medium" style={{ color: colors.secondaryBg }}>
                    {yearlyOverview.length > 0 ? yearlyOverview.reduce((max, item) => item.usage > max.usage ? item : max, yearlyOverview[0]).month : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-5 mb-8" style={{ 
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`
        }}>
          <div className="flex items-center mb-6">
            <div className="p-2 rounded-lg mr-3" style={{ backgroundColor: 'rgba(110, 142, 251, 0.1)' }}>
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
                    backgroundColor: expandedMonths[month] ? colors.hoverBg : 'transparent',
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
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.accent || '#10b981' }} />
                        <span style={{ color: colors.mutedText }}>
                          {data.data.reduce((sum, day) => sum + day.waterUsed, 0)}L
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: colors.danger || '#ef4444' }} />
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
                    backgroundColor: colors.hoverBg,
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
                              <AlertTriangle className="w-4 h-4" style={{ color: colors.danger || '#ef4444' }} />
                            )}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center">
                              <Droplets className="w-3 h-3 mr-2" style={{ color: colors.primaryBg }} />
                              <span style={{ color: colors.mutedText }}>{day.waterUsed}L used</span>
                            </div>
                            <div className="flex items-center">
                              <Users className="w-3 h-3 mr-2" style={{ color: colors.accent || '#10b981' }} />
                              <span style={{ color: colors.mutedText }}>{day.guests} guests</span>
                            </div>
                          </div>
                          
                          {day.hasFine && (
                            <div className="mt-2 text-xs font-medium" style={{ color: colors.danger || '#ef4444' }}>
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

        <div className="rounded-xl p-6 text-center" style={{ 
          backgroundColor: colors.cardBg,
          border: `1px solid ${colors.borderColor}`
        }}>
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 rounded-full mr-2" style={{ backgroundColor: 'rgba(110, 142, 251, 0.1)' }}>
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

export default UsageInsights;