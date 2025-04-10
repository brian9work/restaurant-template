"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo
const mockMenuItem = {
  id: 1,
  name: "Hamburguesa Clásica",
  description: "Carne de res, lechuga, tomate, cebolla y queso",
  price: "120",
  category: "platos-principales",
  available: true,
  image: "/placeholder.svg?height=150&width=150",
}

export default function EditMenuItemPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    image: null as File | null,
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      // En una implementación real, aquí se cargarían los datos del platillo desde la API
      setFormData({
        name: mockMenuItem.name,
        description: mockMenuItem.description,
        price: mockMenuItem.price,
        category: mockMenuItem.category,
        available: mockMenuItem.available,
        image: null,
      })
      setImagePreview(mockMenuItem.image)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, available: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, image: file }))

      // Crear preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Aquí se enviaría el formulario a la API
    toast({
      title: "Platillo actualizado",
      description: "El platillo ha sido actualizado exitosamente",
    })

    // Redireccionar a la página de menú
    router.push("/admin/menu")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href="/admin/menu" className="mr-4">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cargando...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/admin/menu" className="mr-4">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Editar Platillo</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Información del Platillo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Platillo *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Ej. Hamburguesa Clásica"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe los ingredientes y preparación"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio (MXN) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select onValueChange={handleSelectChange} defaultValue={formData.category} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entradas">Entradas</SelectItem>
                        <SelectItem value="platos-principales">Platos Principales</SelectItem>
                        <SelectItem value="acompañamientos">Acompañamientos</SelectItem>
                        <SelectItem value="bebidas">Bebidas</SelectItem>
                        <SelectItem value="postres">Postres</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="available" checked={formData.available} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="available">Disponible para ordenar</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Imagen del Platillo</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <label htmlFor="image" className="cursor-pointer flex flex-col items-center gap-2">
                      {imagePreview ? (
                        <div className="relative w-full h-40">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Vista previa"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Haz clic para subir o arrastra y suelta</p>
                          <p className="text-xs text-muted-foreground">SVG, PNG, JPG o GIF (max. 2MB)</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/admin/menu">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
