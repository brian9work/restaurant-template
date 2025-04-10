"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MinusCircle, PlusCircle, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  PlatilloPersonalizadoModal,
  type PersonalizacionPlatillo,
  type Ingrediente,
  type Preparacion,
  type Adicional,
} from "@/components/platillo-personalizado-modal"

// Tipos de datos
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

// Datos de ejemplo
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    description: "Carne de res, lechuga, tomate, cebolla y queso",
    price: 120,
    category: "platos-principales",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 2,
    name: "Pizza Margarita",
    description: "Salsa de tomate, mozzarella y albahaca",
    price: 150,
    category: "platos-principales",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 3,
    name: "Ensalada César",
    description: "Lechuga romana, crutones, parmesano y aderezo césar",
    price: 90,
    category: "entradas",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 4,
    name: "Papas Fritas",
    description: "Papas fritas crujientes con sal",
    price: 50,
    category: "acompañamientos",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 5,
    name: "Refresco",
    description: "Refresco de cola, naranja o limón",
    price: 30,
    category: "bebidas",
    image: "/placeholder.svg?height=150&width=150",
  },
  {
    id: 6,
    name: "Pastel de Chocolate",
    description: "Pastel de chocolate con ganache",
    price: 80,
    category: "postres",
    image: "/placeholder.svg?height=150&width=150",
  },
]

const ingredientesDisponibles: { [key: number]: Ingrediente[] } = {
  1: [
    { id: "1-1", nombre: "Carne de res", disponible: true },
    { id: "1-2", nombre: "Lechuga", disponible: true },
    { id: "1-3", nombre: "Tomate", disponible: true },
    { id: "1-4", nombre: "Cebolla", disponible: true },
    { id: "1-5", nombre: "Queso", disponible: true },
    { id: "1-6", nombre: "Pepinillos", disponible: true },
  ],
  2: [
    { id: "2-1", nombre: "Salsa de tomate", disponible: true },
    { id: "2-2", nombre: "Mozzarella", disponible: true },
    { id: "2-3", nombre: "Albahaca", disponible: true },
    { id: "2-4", nombre: "Aceite de oliva", disponible: true },
  ],
}

const preparacionesDisponibles: { [key: number]: Preparacion[] } = {
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

export default function MenuPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const { toast } = useToast()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const addToOrder = (menuItem: MenuItem) => {
    // Si es un ítem con personalización posible, mostrar el modal
    if (
      ingredientesDisponibles[menuItem.id] ||
      preparacionesDisponibles[menuItem.id] ||
      adicionalesDisponibles[menuItem.id]
    ) {
      setSelectedItem(menuItem)
      setModalIsOpen(true)
    } else {
      // Si no tiene opciones de personalización, agregar directamente
      addItemToOrder(menuItem)
    }
  }

  const addItemToOrder = (menuItem: MenuItem, opciones?: PersonalizacionPlatillo) => {
    setOrderItems((prevItems) => {
      // Generamos un ID único para esta combinación de item y opciones
      const itemId = opciones ? `${menuItem.id}-${Date.now()}` : menuItem.id.toString()

      if (!opciones) {
        // Manejo normal sin personalización
        const existingItem = prevItems.find((item) => item.menuItem.id === menuItem.id && !item.personalizacion)

        if (existingItem) {
          return prevItems.map((item) =>
            item.menuItem.id === menuItem.id && !item.personalizacion ? { ...item, quantity: item.quantity + 1 } : item,
          )
        } else {
          return [...prevItems, { menuItem, quantity: 1, itemId }]
        }
      } else {
        // Con personalización, siempre agregamos como un nuevo item
        return [
          ...prevItems,
          {
            menuItem,
            quantity: opciones.cantidad,
            personalizacion: opciones,
            itemId,
          },
        ]
      }
    })

    toast({
      title: "Añadido al pedido",
      description: `${menuItem.name} añadido a tu pedido`,
      duration: 2000,
    })
  }

  const removeFromOrder = (itemId: string) => {
    setOrderItems((prevItems) => prevItems.filter((item) => item.itemId !== itemId))
  }

  const getItemQuantity = (menuItemId: number) => {
    return orderItems
      .filter((item) => item.menuItem.id === menuItemId && !item.personalizacion)
      .reduce((total, item) => total + item.quantity, 0)
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

  const sendOrder = () => {
    if (orderItems.length === 0) {
      toast({
        title: "Error",
        description: "No hay items en tu pedido",
        variant: "destructive",
      })
      return
    }

    // Aquí se enviaría la orden a la cocina
    toast({
      title: "Pedido enviado",
      description: "Tu pedido ha sido enviado a cocina",
    })

    // Redirigir a la página de estado del pedido
    // En una implementación real, se guardaría el ID de la orden
    window.location.href = "/cliente/estado-pedido?orderId=123"
  }

  const handlePersonalizacionConfirm = (opciones: PersonalizacionPlatillo) => {
    if (selectedItem) {
      addItemToOrder(selectedItem, opciones)
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
        <h1 className="text-2xl font-bold">Menú del Restaurante</h1>
        <div className="ml-auto flex items-center">
          <Link href="/cliente/carrito">
            <Button variant="outline" className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
              <span>Carrito</span>
              {getTotalItems() > 0 && <Badge className="absolute -top-2 -right-2">{getTotalItems()}</Badge>}
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="mb-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="entradas">Entradas</TabsTrigger>
          <TabsTrigger value="platos-principales">Platos Principales</TabsTrigger>
          <TabsTrigger value="acompañamientos">Acompañamientos</TabsTrigger>
          <TabsTrigger value="bebidas">Bebidas</TabsTrigger>
          <TabsTrigger value="postres">Postres</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={getItemQuantity(item.id)}
                onAdd={() => addToOrder(item)}
                onRemove={() => removeFromOrder(item.id.toString())}
              />
            ))}
          </div>
        </TabsContent>

        {["entradas", "platos-principales", "acompañamientos", "bebidas", "postres"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantity={getItemQuantity(item.id)}
                    onAdd={() => addToOrder(item)}
                    onRemove={() => removeFromOrder(item.id.toString())}
                  />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium">{getTotalItems()} items en el pedido</p>
              <p className="text-xl font-bold">${getTotalPrice().toFixed(2)}</p>
            </div>
            <Button onClick={sendOrder}>Enviar a Cocina</Button>
          </div>
        </div>
      )}

      {modalIsOpen && selectedItem && (
        <PlatilloPersonalizadoModal
          isOpen={modalIsOpen}
          onClose={() => setModalIsOpen(false)}
          onConfirm={handlePersonalizacionConfirm}
          platillo={selectedItem}
          ingredientes={ingredientesDisponibles[selectedItem.id] || []}
          preparaciones={preparacionesDisponibles[selectedItem.id] || []}
          adicionales={adicionalesDisponibles[selectedItem.id] || []}
        />
      )}
    </div>
  )
}

interface MenuItemCardProps {
  item: MenuItem
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40 w-full">
        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
      </div>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{item.description}</p>
        <p className="text-lg font-bold mt-2">${item.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        {quantity > 0 ? (
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={onRemove}>
              <MinusCircle className="h-4 w-4" />
            </Button>
            <span className="font-medium">{quantity}</span>
            <Button variant="outline" size="icon" onClick={onAdd}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={onAdd}>Agregar</Button>
        )}
      </CardFooter>
    </Card>
  )
}
