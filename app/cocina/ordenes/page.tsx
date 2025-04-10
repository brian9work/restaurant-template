"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle2, ChefHat, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos de datos
interface OrderItem {
  id: number
  name: string
  quantity: number
  status: "enviado" | "recibido" | "preparando" | "listo"
  updatedAt: string
}

interface Order {
  id: string
  customer: string
  table: string
  items: OrderItem[]
  status: "pendiente" | "en-proceso" | "completado"
  createdAt: string
}

// Datos de ejemplo
const mockOrders: Order[] = [
  {
    id: "123",
    customer: "Mesa 5",
    table: "5",
    status: "pendiente",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
    items: [
      {
        id: 1,
        name: "Hamburguesa Clásica",
        quantity: 2,
        status: "enviado",
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 2,
        name: "Papas Fritas",
        quantity: 1,
        status: "enviado",
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: "124",
    customer: "Mesa 3",
    table: "3",
    status: "en-proceso",
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutos atrás
    items: [
      {
        id: 3,
        name: "Pizza Margarita",
        quantity: 1,
        status: "preparando",
        updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      },
      {
        id: 4,
        name: "Ensalada César",
        quantity: 1,
        status: "listo",
        updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
    ],
  },
  {
    id: "125",
    customer: "Mesa 8",
    table: "8",
    status: "completado",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
    items: [
      {
        id: 5,
        name: "Refresco",
        quantity: 3,
        status: "listo",
        updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
      {
        id: 6,
        name: "Pastel de Chocolate",
        quantity: 1,
        status: "listo",
        updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
]

export default function KitchenOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setOrders(mockOrders)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para actualizar el estado de un item
  const updateItemStatus = (orderId: string, itemId: number, newStatus: OrderItem["status"]) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            }
            return item
          })

          // Actualizar el estado de la orden basado en los items
          let orderStatus: Order["status"] = "pendiente"
          if (updatedItems.every((item) => item.status === "listo")) {
            orderStatus = "completado"
          } else if (updatedItems.some((item) => item.status !== "enviado")) {
            orderStatus = "en-proceso"
          }

          return {
            ...order,
            items: updatedItems,
            status: orderStatus,
          }
        }
        return order
      }),
    )

    toast({
      title: "Estado actualizado",
      description: `Item actualizado a "${getStatusText(newStatus)}"`,
      duration: 2000,
    })
  }

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: OrderItem["status"] | Order["status"]) => {
    switch (status) {
      case "enviado":
      case "pendiente":
        return "default"
      case "recibido":
      case "en-proceso":
        return "secondary"
      case "preparando":
        return "warning"
      case "listo":
      case "completado":
        return "success"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: OrderItem["status"]) => {
    switch (status) {
      case "enviado":
        return "Enviado a cocina"
      case "recibido":
        return "Recibido en cocina"
      case "preparando":
        return "En preparación"
      case "listo":
        return "Listo para servir"
      default:
        return "Desconocido"
    }
  }

  // Función para obtener el icono según el estado
  const getStatusIcon = (status: OrderItem["status"] | Order["status"]) => {
    switch (status) {
      case "enviado":
      case "pendiente":
        return <Clock className="h-4 w-4" />
      case "recibido":
      case "en-proceso":
        return <AlertCircle className="h-4 w-4" />
      case "preparando":
        return <ChefHat className="h-4 w-4" />
      case "listo":
      case "completado":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Función para formatear la fecha
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Función para obtener el siguiente estado
  const getNextStatus = (currentStatus: OrderItem["status"]): OrderItem["status"] => {
    switch (currentStatus) {
      case "enviado":
        return "recibido"
      case "recibido":
        return "preparando"
      case "preparando":
        return "listo"
      case "listo":
        return "listo" // No hay siguiente estado
      default:
        return "enviado"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Gestión de Órdenes - Cocina</h1>
      </div>

      <Tabs defaultValue="pendiente">
        <TabsList className="mb-6">
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="en-proceso">En Proceso</TabsTrigger>
          <TabsTrigger value="completado">Completados</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Cargando órdenes...</p>
          </div>
        ) : (
          <>
            {["pendiente", "en-proceso", "completado", "todos"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                <div className="grid gap-6">
                  {orders
                    .filter((order) => tabValue === "todos" || order.status === tabValue)
                    .map((order) => (
                      <Card key={order.id}>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>
                                Orden #{order.id} - {order.customer}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">
                                Recibido: {formatTime(order.createdAt)}
                              </p>
                            </div>
                            <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status === "pendiente"
                                ? "Pendiente"
                                : order.status === "en-proceso"
                                  ? "En Proceso"
                                  : "Completado"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                <div>
                                  <p className="font-medium">
                                    {item.name} x{item.quantity}
                                  </p>
                                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                    <Badge
                                      variant={getStatusColor(item.status)}
                                      className="mr-2 flex items-center gap-1"
                                    >
                                      {getStatusIcon(item.status)}
                                      {getStatusText(item.status)}
                                    </Badge>
                                    <span>Actualizado: {formatTime(item.updatedAt)}</span>
                                  </div>
                                </div>
                                <div>
                                  {item.status !== "listo" && (
                                    <Button
                                      onClick={() => updateItemStatus(order.id, item.id, getNextStatus(item.status))}
                                      variant="outline"
                                      size="sm"
                                    >
                                      {item.status === "enviado"
                                        ? "Recibir"
                                        : item.status === "recibido"
                                          ? "Preparar"
                                          : "Marcar Listo"}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="w-full flex justify-end">
                            {order.status !== "completado" && order.items.every((item) => item.status === "listo") && (
                              <Button>Completar Orden</Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </>
        )}
      </Tabs>
    </div>
  )
}
