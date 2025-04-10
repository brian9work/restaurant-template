"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, CheckCircle2, ChefHat } from "lucide-react"

// Tipos de datos
interface OrderItem {
  id: number
  name: string
  quantity: number
  status: "enviado" | "recibido" | "preparando" | "listo"
  updatedAt: string
}

// Datos de ejemplo
const mockOrderItems: OrderItem[] = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    quantity: 2,
    status: "preparando",
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutos atrás
  },
  {
    id: 2,
    name: "Papas Fritas",
    quantity: 1,
    status: "recibido",
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutos atrás
  },
  {
    id: 3,
    name: "Refresco",
    quantity: 2,
    status: "listo",
    updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutos atrás
  },
]

export default function OrderStatusPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId") || "123"
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setOrderItems(mockOrderItems)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: OrderItem["status"]) => {
    switch (status) {
      case "enviado":
        return "default"
      case "recibido":
        return "secondary"
      case "preparando":
        return "warning"
      case "listo":
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
  const getStatusIcon = (status: OrderItem["status"]) => {
    switch (status) {
      case "enviado":
        return <Clock className="h-4 w-4" />
      case "recibido":
        return <CheckCircle2 className="h-4 w-4" />
      case "preparando":
        return <ChefHat className="h-4 w-4" />
      case "listo":
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/cliente/menu" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Estado del Pedido #{orderId}</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando estado del pedido...</p>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">
                        {item.name} x{item.quantity}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <Badge variant={getStatusColor(item.status)} className="mr-2 flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          {getStatusText(item.status)}
                        </Badge>
                        <span>Actualizado: {formatTime(item.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiempo Estimado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-4xl font-bold">15-20 min</p>
                <p className="text-muted-foreground mt-2">Tiempo estimado para completar tu pedido</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
