"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Download, Search, Utensils } from "lucide-react"

// Tipos de datos
interface Order {
  id: string
  customer: string
  table: string
  items: number
  total: number
  status: "pendiente" | "en-proceso" | "completado" | "cancelado"
  createdAt: string
}

// Datos de ejemplo
const mockOrders: Order[] = Array.from({ length: 50 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - Math.floor(Math.random() * 30))

  return {
    id: (1000 + i).toString(),
    customer: `Mesa ${Math.floor(Math.random() * 15) + 1}`,
    table: (Math.floor(Math.random() * 15) + 1).toString(),
    items: Math.floor(Math.random() * 10) + 1,
    total: Math.floor(Math.random() * 500) + 50,
    status: ["pendiente", "en-proceso", "completado", "cancelado"][Math.floor(Math.random() * 4)] as Order["status"],
    createdAt: date.toISOString(),
  }
})

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 10

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para filtrar órdenes por búsqueda
  const filteredOrders = orders.filter(
    (order) => order.id.includes(searchQuery) || order.customer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return "default"
      case "en-proceso":
        return "secondary"
      case "completado":
        return "success"
      case "cancelado":
        return "destructive"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pendiente":
        return "Pendiente"
      case "en-proceso":
        return "En Proceso"
      case "completado":
        return "Completado"
      case "cancelado":
        return "Cancelado"
      default:
        return "Desconocido"
    }
  }

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Paginación
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

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
              href="/admin/ordenes"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Calendar className="h-4 w-4" />
              Historial de Órdenes
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
          <h1 className="font-semibold text-lg">Historial de Órdenes</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por ID o cliente..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="todos">
            <TabsList className="mb-6">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
              <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
              <TabsTrigger value="completado">Completados</TabsTrigger>
              <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p>Cargando órdenes...</p>
              </div>
            ) : (
              <>
                {["todos", "pendiente", "en-proceso", "completado", "cancelado"].map((tabValue) => (
                  <TabsContent key={tabValue} value={tabValue} className="mt-0">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          Órdenes {tabValue !== "todos" ? getStatusText(tabValue as Order["status"]) : ""}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b bg-muted/50">
                                <th className="py-3 px-4 text-left font-medium">ID</th>
                                <th className="py-3 px-4 text-left font-medium">Cliente</th>
                                <th className="py-3 px-4 text-left font-medium">Fecha</th>
                                <th className="py-3 px-4 text-left font-medium">Items</th>
                                <th className="py-3 px-4 text-left font-medium">Total</th>
                                <th className="py-3 px-4 text-left font-medium">Estado</th>
                                <th className="py-3 px-4 text-left font-medium">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentOrders
                                .filter((order) => tabValue === "todos" || order.status === tabValue)
                                .map((order) => (
                                  <tr key={order.id} className="border-b">
                                    <td className="py-3 px-4 font-medium">#{order.id}</td>
                                    <td className="py-3 px-4">{order.customer}</td>
                                    <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                                    <td className="py-3 px-4">{order.items}</td>
                                    <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                                    <td className="py-3 px-4">
                                      <Badge variant={getStatusColor(order.status)}>
                                        {getStatusText(order.status)}
                                      </Badge>
                                    </td>
                                    <td className="py-3 px-4">
                                      <Link href={`/admin/ordenes/${order.id}`}>
                                        <Button variant="outline" size="sm">
                                          Ver Detalles
                                        </Button>
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Paginación */}
                        {filteredOrders.length > ordersPerPage && (
                          <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                              <span className="sr-only">Página anterior</span>
                            </Button>
                            <div className="text-sm">
                              Página {currentPage} de {totalPages}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                              <span className="sr-only">Página siguiente</span>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
