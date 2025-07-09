"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
  Wallet,
} from "lucide-react"

// Mock financial data
const generateFinancialData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const currentYear = new Date().getFullYear()
  const data = []

  for (let i = 0; i < 12; i++) {
    const baseRevenue = 50000 + Math.random() * 20000
    const baseCosts = baseRevenue * (0.6 + Math.random() * 0.2)

    data.push({
      month: months[i],
      year: currentYear,
      revenue: Math.round(baseRevenue),
      costs: Math.round(baseCosts),
      profit: Math.round(baseRevenue - baseCosts),
      cashFlow: Math.round(baseRevenue - baseCosts + (Math.random() - 0.5) * 5000),
      assets: Math.round(200000 + i * 5000 + Math.random() * 10000),
      liabilities: Math.round(80000 + i * 2000 + Math.random() * 5000),
      equity: 0, // Will be calculated
    })
  }

  // Calculate equity
  data.forEach((item) => {
    item.equity = item.assets - item.liabilities
  })

  return data
}

const KPICard = ({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: {
  title: string
  value: string
  change: string
  icon: any
  trend: "up" | "down" | "neutral"
}) => {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
  const bgColor = trend === "up" ? "bg-green-50" : trend === "down" ? "bg-red-50" : "bg-gray-50"

  return (
    <Card
      className={`${bgColor} border-l-4 ${trend === "up" ? "border-l-green-500" : trend === "down" ? "border-l-red-500" : "border-l-gray-500"}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-2">
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : trend === "down" ? (
                <TrendingDown className="h-4 w-4 mr-1" />
              ) : null}
              <span className={`text-sm font-medium ${trendColor}`}>{change}</span>
            </div>
          </div>
          <Icon className={`h-8 w-8 ${trendColor}`} />
        </div>
      </CardContent>
    </Card>
  )
}

const SimpleChart = ({
  data,
  type,
  title,
}: {
  data: any[]
  type: "line" | "bar" | "area"
  title: string
}) => {
  const maxValue = Math.max(...data.map((d) => Math.max(d.revenue || 0, d.profit || 0, d.cashFlow || 0)))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="h-64 flex items-end justify-between space-x-2 border-b border-l border-gray-200 p-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div className="flex flex-col items-center space-y-1 w-full">
              {type === "bar" && (
                <>
                  <div
                    className="bg-blue-500 w-full rounded-t"
                    style={{ height: `${(item.revenue / maxValue) * 200}px` }}
                    title={`Revenue: $${item.revenue?.toLocaleString()}`}
                  />
                  <div
                    className="bg-green-500 w-full"
                    style={{ height: `${(item.profit / maxValue) * 200}px` }}
                    title={`Profit: $${item.profit?.toLocaleString()}`}
                  />
                </>
              )}
              {type === "line" && (
                <div className="relative w-full h-48 flex items-end">
                  <div
                    className="absolute bottom-0 w-2 h-2 bg-blue-500 rounded-full"
                    style={{ bottom: `${(item.cashFlow / maxValue) * 180}px` }}
                    title={`Cash Flow: $${item.cashFlow?.toLocaleString()}`}
                  />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-600 transform -rotate-45">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Revenue</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Profit</span>
        </div>
      </div>
    </div>
  )
}

const FinancialStatement = ({
  data,
  type,
}: {
  data: any[]
  type: "income" | "balance" | "cashflow"
}) => {
  const latestData = data[data.length - 1]

  if (type === "income") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Income Statement</h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Revenue</span>
            <span className="text-green-600">${latestData.revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Cost of Goods Sold</span>
            <span className="text-red-600">-${latestData.costs.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-b font-semibold">
            <span>Gross Profit</span>
            <span className={latestData.profit > 0 ? "text-green-600" : "text-red-600"}>
              ${latestData.profit.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between py-2 text-sm text-gray-600">
            <span>Gross Margin</span>
            <span>{((latestData.profit / latestData.revenue) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    )
  }

  if (type === "balance") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Balance Sheet</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">Assets</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Assets</span>
                <span>${latestData.assets.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Liabilities & Equity</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Liabilities</span>
                <span>${latestData.liabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Equity</span>
                <span>${latestData.equity.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cash Flow Statement</h3>
      <div className="space-y-2">
        <div className="flex justify-between py-2 border-b">
          <span>Operating Cash Flow</span>
          <span className={latestData.cashFlow > 0 ? "text-green-600" : "text-red-600"}>
            ${latestData.cashFlow.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 text-sm text-gray-600">
          <span>Cash Flow Margin</span>
          <span>{((latestData.cashFlow / latestData.revenue) * 100).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  )
}

const ForecastingPanel = ({ data }: { data: any[] }) => {
  const forecast = useMemo(() => {
    const lastThreeMonths = data.slice(-3)
    const avgGrowth =
      lastThreeMonths.reduce((acc, curr, index) => {
        if (index === 0) return acc
        const prevMonth = lastThreeMonths[index - 1]
        return acc + (curr.revenue - prevMonth.revenue) / prevMonth.revenue
      }, 0) / 2

    const lastMonth = data[data.length - 1]
    const nextMonthRevenue = lastMonth.revenue * (1 + avgGrowth)
    const nextMonthProfit = nextMonthRevenue * (lastMonth.profit / lastMonth.revenue)

    return {
      revenue: Math.round(nextMonthRevenue),
      profit: Math.round(nextMonthProfit),
      confidence: Math.min(85, Math.max(65, 75 + Math.random() * 20)),
    }
  }, [data])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Next Month Forecast</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Projected Revenue</p>
              <p className="text-2xl font-bold text-blue-600">${forecast.revenue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Projected Profit</p>
              <p className="text-2xl font-bold text-green-600">${forecast.profit.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <Target className="h-4 w-4 text-blue-500" />
        <span className="text-sm text-gray-600">
          Confidence Level: <span className="font-medium">{forecast.confidence.toFixed(0)}%</span>
        </span>
      </div>
    </div>
  )
}

export default function FinancialDashboard() {
  const [financialData, setFinancialData] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState("12m")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setFinancialData(generateFinancialData())
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setFinancialData(generateFinancialData())
      setIsLoading(false)
    }, 1000)
  }

  const latestData = financialData[financialData.length - 1] || {}
  const previousData = financialData[financialData.length - 2] || {}

  const revenueChange =
    latestData.revenue && previousData.revenue
      ? (((latestData.revenue - previousData.revenue) / previousData.revenue) * 100).toFixed(1)
      : "0"

  const profitChange =
    latestData.profit && previousData.profit
      ? (((latestData.profit - previousData.profit) / previousData.profit) * 100).toFixed(1)
      : "0"

  const cashFlowChange =
    latestData.cashFlow && previousData.cashFlow
      ? (((latestData.cashFlow - previousData.cashFlow) / previousData.cashFlow) * 100).toFixed(1)
      : "0"

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Health Dashboard</h1>
            <p className="text-gray-600">Real-time insights for SME financial management</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={refreshData} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Monthly Revenue"
            value={`$${latestData.revenue?.toLocaleString() || "0"}`}
            change={`${revenueChange}% vs last month`}
            icon={DollarSign}
            trend={
              Number.parseFloat(revenueChange) > 0 ? "up" : Number.parseFloat(revenueChange) < 0 ? "down" : "neutral"
            }
          />
          <KPICard
            title="Net Profit"
            value={`$${latestData.profit?.toLocaleString() || "0"}`}
            change={`${profitChange}% vs last month`}
            icon={TrendingUp}
            trend={
              Number.parseFloat(profitChange) > 0 ? "up" : Number.parseFloat(profitChange) < 0 ? "down" : "neutral"
            }
          />
          <KPICard
            title="Cash Flow"
            value={`$${latestData.cashFlow?.toLocaleString() || "0"}`}
            change={`${cashFlowChange}% vs last month`}
            icon={Wallet}
            trend={
              Number.parseFloat(cashFlowChange) > 0 ? "up" : Number.parseFloat(cashFlowChange) < 0 ? "down" : "neutral"
            }
          />
          <KPICard
            title="Profit Margin"
            value={`${latestData.revenue ? ((latestData.profit / latestData.revenue) * 100).toFixed(1) : "0"}%`}
            change="Healthy range"
            icon={PieChart}
            trend={latestData.revenue && latestData.profit / latestData.revenue > 0.15 ? "up" : "down"}
          />
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="statements">Financial Statements</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Revenue vs Profit Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleChart data={financialData} type="bar" title="" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Cash Flow Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleChart data={financialData} type="line" title="" />
                </CardContent>
              </Card>
            </div>

            {/* Financial Health Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Health Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Liquidity</p>
                      <p className="text-sm text-gray-600">Strong cash position</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="font-medium">Profitability</p>
                      <p className="text-sm text-gray-600">Monitor margins closely</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">Growth</p>
                      <p className="text-sm text-gray-600">Positive trend</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Statement</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialStatement data={financialData} type="income" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Balance Sheet</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialStatement data={financialData} type="balance" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <FinancialStatement data={financialData} type="cashflow" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profitability Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {financialData.slice(-6).map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{item.month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (item.profit / item.revenue) * 100 * 5)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {((item.profit / item.revenue) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Ratios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Current Ratio</span>
                      <Badge variant="outline">2.1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Debt-to-Equity</span>
                      <Badge variant="outline">0.4</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ROE</span>
                      <Badge variant="outline">15.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>ROA</span>
                      <Badge variant="outline">8.7%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecasting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ForecastingPanel data={financialData} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Projected Annual Revenue</span>
                      <span className="font-bold text-blue-600">${(latestData.revenue * 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Projected Annual Profit</span>
                      <span className="font-bold text-green-600">${(latestData.profit * 12).toLocaleString()}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">Based on current trends and seasonal adjustments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
