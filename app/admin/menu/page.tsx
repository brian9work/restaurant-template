"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Edit, MoreVertical, PlusCircle, Search, Trash2, Utensils } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Tipos de datos
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
}

// Datos de ejemplo
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Hamburguesa Clásica",
    description: "Carne de res, lechuga, tomate, cebolla y queso",
    price: 120,
    category: "platos-principales",
    image: "/placeholder.svg?height=150&width=150",
    available: true,
  },
  {
    id: 2,
    name: "Pizza Margarita",
    description: "Salsa de tomate, mozzarella y albahaca",
    price: 150,
    category: "platos-principales",
    image: "/placeholder.svg?height=150&width=150",
    available: true,
  },
  {
    id: 3,
    name: "Ensalada César",
    description: "Lechuga romana, crutones, parmesano y aderezo césar",
    price: 90,
    category: "entradas",
    image: "/placeholder.svg?height=150&width=150",
    available: true,
  },
  {
    id: 4,
    name: "Papas Fritas",
    description: "Papas fritas crujientes con sal",
    price: 50,
    category: "acompañamientos",
    image: "/placeholder.svg?height=150&width=150",
    available: true,
  },
  {
    id: 5,
    name: "Refresco",
    description: "Refresco de cola, naranja o limón",
    price: 30,
    category: "bebidas",
    image: "/placeholder.svg?height=150&width=150",
    available: true,
  },
  {
    id: 6,
    name: "Pastel de Chocolate",
    description: "Pastel de chocolate con ganache",
    price: 80,
    category: "postres",
    image: "/placeholder.svg?height=150&width=150",
    available: false,
  },
]

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  // Función para filtrar items por búsqueda
  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Función para eliminar un item
  const deleteItem = (id: number) => {
    setMenuItems((prevItems) => prevItems.filter((item) => item.id !== id))
    toast({
      title: "Platillo eliminado",
      description: "El platillo ha sido eliminado del menú",
      duration: 2000,
    })
  }

  // Función para cambiar disponibilidad
  const toggleAvailability = (id: number) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, available: !item.available } : item)),
    )

    const item = menuItems.find((item) => item.id === id)
    toast({
      title: item?.available ? "Platillo no disponible" : "Platillo disponible",
      description: item?.available
        ? "El platillo ha sido marcado como no disponible"
        : "El platillo ha sido marcado como disponible",
      duration: 2000,
    })
  }

  // Función para obtener el texto de la categoría
  const getCategoryText = (category: string) => {
    switch (category) {
      case "entradas":
        return "Entradas"
      case "platos-principales":
        return "Platos Principales"
      case "acompañamientos":
        return "Acompañamientos"
      case "bebidas":
        return "Bebidas"
      case "postres":
        return "Postres"
      default:
        return "Desconocido"
    }
  }

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
              href="/admin/menu"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
            >
              <Utensils className="h-4 w-4" />
              Gestión de Menú
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
          <h1 className="font-semibold text-lg">Gestión de Menú</h1>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/menu/agregar">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Agregar Platillo
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar platillos..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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

            {["todos", "entradas", "platos-principales", "acompañamientos", "bebidas", "postres"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems
                    .filter((item) => tabValue === "todos" || item.category === tabValue)
                    .map((item) => (
                      <Card key={item.id}>
                        <div className="relative h-40 w-full">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge variant={item.available ? "success" : "destructive"}>
                              {item.available ? "Disponible" : "No Disponible"}
                            </Badge>
                          </div>
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{item.name}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toggleAvailability(item.id)}>
                                  {item.available ? "Marcar No Disponible" : "Marcar Disponible"}
                                </DropdownMenuItem>
                                <Link href={`/admin/menu/editar/${item.id}`}>
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={() => deleteItem(item.id)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{item.description}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                            <Badge variant="outline">{getCategoryText(item.category)}</Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Link href={`/admin/menu/editar/${item.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </Link>
                          <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}
