"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, MinusCircle, PlusCircle, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { PersonalizacionPlatillo, Adicional } from "@/components/platillo-personalizado-modal"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

interface OrderItem {
  menuItem: MenuItem
  quantity: number
  personalizacion?: PersonalizacionPlatillo
  itemId: string
}

const mockOrderItems: OrderItem[] = [
  {
    menuItem: {
      id: 1,
      name: "Hamburguesa Clásica",
      description: "Carne de res, lechuga, tomate, cebolla y queso",
      price: 120,
      category: "platos-principales",
      image: "/placeholder.svg?height=150&width=150",
    },
    quantity: 1,
    personalizacion: {
      ingredientesExcluidos: ["1-3", "1-5"],
      preparacion: "prep-3",
      adicionales: ["ad-1", "ad-3"],
      cantidad: 1,
      notasEspeciales: "Pan sin semillas por favor",
    },
    itemId: "1-custom-1",
  },
  {
    menuItem: {
      id: 2,
      name: "Pizza Margarita",
      description: "Salsa de tomate, mozzarella y albahaca",
      price: 150,
      category: "platos-principales",
      image: "/placeholder.svg?height=150&width=150",
    },
    quantity: 2,
    itemId: "2",
  },
  {
    menuItem: {
      id: 4,
      name: "Papas Fritas",
      description: "Papas fritas crujientes con sal",
      price: 50,
      category: "acompañamientos",
      image: "/placeholder.svg?height=150&width=150",
    },
    quantity: 1,
    itemId: "4",
  },
]

// Datos de ejemplo para ingredientes, preparaciones y adicionales
const ingredientesDisponibles: { [key: number]: { id: string; nombre: string }[] } = {
  1: [
    { id: "1-1", nombre: "Carne de res" },
    { id: "1-2", nombre: "Lechuga" },
    { id: "1-3", nombre: "Tomate" },
    { id: "1-4", nombre: "Cebolla" },
    { id: "1-5", nombre: "Queso" },
    { id: "1-6", nombre: "Pepinillos" },
  ],
  2: [
    { id: "2-1", nombre: "Salsa de tomate" },
    { id: "2-2", nombre: "Mozzarella" },
    { id: "2-3", nombre: "Albahaca" },
    { id: "2-4", nombre: "Aceite de oliva" },
  ],
}

const preparacionesDisponibles: { [key: number]: { id: string; nombre: string }[] } = {
  1: [
    { id: "prep-1", nombre: "Término tres cuartos" },
    { id: "prep-2", nombre: "Término medio" },
    { id: "prep-3", nombre: "Bien cocido" },
  ],
  2: [
    { id: "prep-4", nombre: "Masa delgada" },
    { id: "prep-5", nombre: "Masa gruesa" },
  ],
}

const adicionalesDisponibles: { [key: number]: Adicional[] } = {
  1: [
    { id: "ad-1", nombre: "Tocino extra", precio: 15 },
    { id: "ad-2", nombre: "Queso extra", precio: 10 },
    { id: "ad-3", nombre: "Guacamole", precio: 20 },
  ],
  2: [
    { id: "ad-4", nombre: "Queso extra", precio: 15 },
    { id: "ad-5", nombre: "Champiñones", precio: 20 },
    { id: "ad-6", nombre: "Pepperoni", precio: 25 },
  ],
}

export default function CartPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      setOrderItems(mockOrderItems)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const updateQuantity = (itemId: string, delta: number) => {
    setOrderItems((prevItems) =>
      prevItems.map((item) => {
        if (item.itemId === itemId) {
          const newQuantity = Math.max(1, item.quantity + delta)
          return {
            ...item,
            quantity: newQuantity,
          }
        }
        return item
      }),
    )
  }

  const removeItem = (itemId: string) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId))
    toast({
      title: "Artículo eliminado",
      description: "El artículo ha sido eliminado de tu pedido",
      duration: 2000,
    })
  }

  const getTotalItems = () => {
    return orderItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => {
      let itemPrice = item.menuItem.price * item.quantity

      // Agregar precio de adicionales si hay personalizacion
      if (item.personalizacion && item.personalizacion.adicionales.length > 0) {
        const adicionales = adicionalesDisponibles[item.menuItem.id] || []
        adicionales.forEach((adicional) => {
          if (item.personalizacion?.adicionales.includes(adicional.id)) {
            itemPrice += adicional.precio * item.quantity
          }
        })
      }

      return total + itemPrice
    }, 0)
  }

  const enviarPedido = () => {
    toast({
      title: "Pedido enviado",
      description: "Tu pedido ha sido enviado a cocina",
      duration: 2000,
    })
    // Redireccionar a la página de estado del pedido
    window.location.href = "/cliente/estado-pedido?orderId=125"
  }

  // Función para renderizar especificaciones del platillo
  const renderEspecificaciones = (item: OrderItem) => {
    if (!item.personalizacion) return null

    const { ingredientesExcluidos, preparacion, adicionales, notasEspeciales } = item.personalizacion
    const itemId = item.menuItem.id

    // Obtener nombres de ingredientes excluidos
    const ingredientesExcluidosNombres = ingredientesExcluidos
      .map((id) => {
        const ingrediente = (ingredientesDisponibles[itemId] || []).find((ing) => ing.id === id)
        return ingrediente?.nombre
      })
      .filter(Boolean)

    // Obtener nombre de preparación
    const preparacionNombre = (preparacionesDisponibles[itemId] || []).find((prep) => prep.id === preparacion)?.nombre

    // Obtener nombres de adicionales
    const adicionalesNombres = adicionales
      .map((id) => {
        const adicional = (adicionalesDisponibles[itemId] || []).find((add) => add.id === id)
        return adicional ? `${adicional.nombre} (+$${adicional.precio})` : null
      })
      .filter(Boolean)

    return (
      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
        {ingredientesExcluidosNombres.length > 0 && (
          <div>
            <span className="font-medium">Sin:</span> {ingredientesExcluidosNombres.join(", ")}
          </div>
        )}
        {preparacionNombre && (
          <div>
            <span className="font-medium">Preparación:</span> {preparacionNombre}
          </div>
        )}
        {adicionalesNombres.length > 0 && (
          <div>
            <span className="font-medium">Adicionales:</span> {adicionalesNombres.join(", ")}
          </div>
        )}
        {notasEspeciales && (
          <div>
            <span className="font-medium">Notas:</span> {notasEspeciales}
          </div>
        )}
      </div>
    )
  }

  // Calcular precio de item con adicionales
  const calcularPrecioItem = (item: OrderItem) => {
    let precio = item.menuItem.price

    if (item.personalizacion?.adicionales.length) {
      const adicionales = adicionalesDisponibles[item.menuItem.id] || []
      adicionales.forEach((adicional) => {
        if (item.personalizacion?.adicionales.includes(adicional.id)) {
          precio += adicional.precio
        }
      })
    }

    return precio * item.quantity
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/cliente/menu" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Tu Pedido</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando pedido...</p>
        </div>
      ) : orderItems.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Tu carrito está vacío</h2>
          <p className="text-muted-foreground mb-6">Agrega algunos platillos a tu pedido</p>
          <Link href="/cliente/menu">
            <Button>Ver Menú</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Artículos ({getTotalItems()})</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {orderItems.map((item) => (
                  <div key={item.itemId} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.menuItem.image || "/placeholder.svg"}
                          alt={item.menuItem.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.menuItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.menuItem.description}</p>
                        {renderEspecificaciones(item)}
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <div className="text-right">
                          <div className="font-bold">${calcularPrecioItem(item).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">${item.menuItem.price.toFixed(2)} c/u</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.itemId, -1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.itemId, 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeItem(item.itemId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Link href="/cliente/menu" className="w-full">
                  <Button variant="outline" className="w-full">
                    Agregar más artículos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumen de Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span>
                      {item.quantity} x {item.menuItem.name}
                      {item.personalizacion ? " (Personalizado)" : ""}
                    </span>
                    <span>${calcularPrecioItem(item).toFixed(2)}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Impuestos (16%)</span>
                  <span>${(getTotalPrice() * 0.16).toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(getTotalPrice() * 1.16).toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button className="w-full" onClick={enviarPedido}>
                  Enviar a Cocina
                </Button>
                <Link href="/cliente/menu" className="w-full">
                  <Button variant="outline" className="w-full">
                    Seguir Comprando
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
