"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, ChefHat, ClipboardList, DollarSign, Home, PlusCircle, Settings, Utensils } from "lucide-react"

export default function AdminDashboardPage() {
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
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/menu"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Utensils className="h-4 w-4" />
              Gestión de Menú
            </Link>
            <Link
              href="/admin/ordenes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ClipboardList className="h-4 w-4" />
              Historial de Órdenes
            </Link>
            <Link
              href="/admin/reportes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <BarChart3 className="h-4 w-4" />
              Reportes de Ventas
            </Link>
            <Link
              href="/admin/configuracion"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Settings className="h-4 w-4" />
              Configuración
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
          <Link href="/" className="md:hidden">
            <Utensils className="h-6 w-6" />
          </Link>
          <h1 className="font-semibold text-lg">Dashboard</h1>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$15,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+201 respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platillos Vendidos</CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,324</div>
                <p className="text-xs text-muted-foreground">+19% respecto al mes anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
                <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.2 min</div>
                <p className="text-xs text-muted-foreground">-2.4 min respecto al mes anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Ventas Recientes</CardTitle>
                <CardDescription>Ventas de los últimos 7 días</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Gráfico de ventas recientes</p>
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Platillos Más Vendidos</CardTitle>
                <CardDescription>Top 5 platillos más vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Hamburguesa Clásica</p>
                        <p className="text-muted-foreground">245 vendidos</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[80%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Pizza Margarita</p>
                        <p className="text-muted-foreground">189 vendidos</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[65%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Ensalada César</p>
                        <p className="text-muted-foreground">156 vendidos</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[55%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Papas Fritas</p>
                        <p className="text-muted-foreground">132 vendidos</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[45%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">Pastel de Chocolate</p>
                        <p className="text-muted-foreground">98 vendidos</p>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[35%] rounded-full bg-primary"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/admin/menu/agregar">
                  <Button className="w-full justify-start" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Platillo
                  </Button>
                </Link>
                <Link href="/admin/ordenes">
                  <Button className="w-full justify-start" variant="outline">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    Ver Órdenes
                  </Button>
                </Link>
                <Link href="/admin/reportes">
                  <Button className="w-full justify-start" variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Generar Reporte
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
