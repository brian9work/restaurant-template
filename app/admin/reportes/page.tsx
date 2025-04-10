"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BarChart3, Download, LineChart, PieChart, Utensils } from "lucide-react"

export default function SalesReportsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Utensils className="h-6 w-6" />
            <span>Restaurante Admin</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/reportes"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              Reportes de Ventas
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <Link href="/admin/dashboard" className="md:hidden">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-semibold text-lg">Reportes de Ventas</h1>
          <div className="ml-auto flex items-center gap-2">
            <Select defaultValue="7d" onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 días</SelectItem>
                <SelectItem value="30d">Últimos 30 días</SelectItem>
                <SelectItem value="90d">Últimos 90 días</SelectItem>
                <SelectItem value="year">Este año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$15,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$265.82</div>
                <p className="text-xs text-muted-foreground">+5.4% respecto al período anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platillos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,324</div>
                <p className="text-xs text-muted-foreground">+19% respecto al período anterior</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ventas">
            <TabsList>
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="categorias">Categorías</TabsTrigger>
              <TabsTrigger value="horas">Horas Pico</TabsTrigger>
            </TabsList>
            <TabsContent value="ventas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Día</CardTitle>
                  <CardDescription>
                    Tendencia de ventas para los{" "}
                    {timeRange === "7d"
                      ? "últimos 7 días"
                      : timeRange === "30d"
                        ? "últimos 30 días"
                        : timeRange === "90d"
                          ? "últimos 90 días"
                          : "este año"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <LineChart className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Gráfico de ventas por día</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="productos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>Top productos por cantidad vendida</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Gráfico de productos más vendidos</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="categorias" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>Distribución de ventas por categoría de producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <PieChart className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Gráfico de ventas por categoría</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="horas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Horas Pico de Ventas</CardTitle>
                  <CardDescription>Distribución de ventas por hora del día</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded-md">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Gráfico de horas pico de ventas</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Detalles de Ventas</CardTitle>
              <CardDescription>Desglose detallado de ventas por día</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="py-3 px-4 text-left font-medium">Fecha</th>
                      <th className="py-3 px-4 text-left font-medium">Órdenes</th>
                      <th className="py-3 px-4 text-left font-medium">Ventas</th>
                      <th className="py-3 px-4 text-left font-medium">Ticket Promedio</th>
                      <th className="py-3 px-4 text-left font-medium">Platillos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(7)].map((_, i) => {
                      const date = new Date()
                      date.setDate(date.getDate() - i)
                      return (
                        <tr key={i} className="border-b">
                          <td className="py-3 px-4">{date.toLocaleDateString()}</td>
                          <td className="py-3 px-4">{Math.floor(Math.random() * 100) + 50}</td>
                          <td className="py-3 px-4">${(Math.random() * 2000 + 1000).toFixed(2)}</td>
                          <td className="py-3 px-4">${(Math.random() * 100 + 150).toFixed(2)}</td>
                          <td className="py-3 px-4">{Math.floor(Math.random() * 200) + 100}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
