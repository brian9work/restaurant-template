"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export interface Ingrediente {
  id: string
  nombre: string
  disponible: boolean
  precio?: number
}

export interface Preparacion {
  id: string
  nombre: string
}

export interface Adicional {
  id: string
  nombre: string
  precio: number
}

interface PlatilloPersonalizadoModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (opciones: PersonalizacionPlatillo) => void
  platillo: {
    id: number
    name: string
    price: number
  }
  ingredientes: Ingrediente[]
  preparaciones: Preparacion[]
  adicionales: Adicional[]
}

export interface PersonalizacionPlatillo {
  ingredientesExcluidos: string[]
  preparacion: string
  adicionales: string[]
  cantidad: number
  notasEspeciales: string
}

export function PlatilloPersonalizadoModal({
  isOpen,
  onClose,
  onConfirm,
  platillo,
  ingredientes,
  preparaciones,
  adicionales,
}: PlatilloPersonalizadoModalProps) {
  const [personalizacion, setPersonalizacion] = useState<PersonalizacionPlatillo>({
    ingredientesExcluidos: [],
    preparacion: preparaciones[0]?.id || "",
    adicionales: [],
    cantidad: 1,
    notasEspeciales: "",
  })

  const [seccionesExpandidas, setSeccionesExpandidas] = useState({
    ingredientes: true,
    preparacion: true,
    adicionales: true,
    notas: true,
  })

  const toggleSeccion = (seccion: keyof typeof seccionesExpandidas) => {
    setSeccionesExpandidas((prev) => ({
      ...prev,
      [seccion]: !prev[seccion],
    }))
  }

  const toggleExcluirIngrediente = (ingredienteId: string) => {
    setPersonalizacion((prev) => {
      if (prev.ingredientesExcluidos.includes(ingredienteId)) {
        return {
          ...prev,
          ingredientesExcluidos: prev.ingredientesExcluidos.filter((id) => id !== ingredienteId),
        }
      } else {
        return {
          ...prev,
          ingredientesExcluidos: [...prev.ingredientesExcluidos, ingredienteId],
        }
      }
    })
  }

  const toggleAdicional = (adicionalId: string) => {
    setPersonalizacion((prev) => {
      if (prev.adicionales.includes(adicionalId)) {
        return {
          ...prev,
          adicionales: prev.adicionales.filter((id) => id !== adicionalId),
        }
      } else {
        return {
          ...prev,
          adicionales: [...prev.adicionales, adicionalId],
        }
      }
    })
  }

  const handleCantidadChange = (delta: number) => {
    setPersonalizacion((prev) => ({
      ...prev,
      cantidad: Math.max(1, prev.cantidad + delta),
    }))
  }

  const calcularPrecioTotal = () => {
    let precioBase = platillo.price * personalizacion.cantidad

    // Sumar precio de adicionales
    adicionales.forEach((adicional) => {
      if (personalizacion.adicionales.includes(adicional.id)) {
        precioBase += adicional.precio * personalizacion.cantidad
      }
    })

    return precioBase
  }

  const handleConfirm = () => {
    onConfirm(personalizacion)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Personalizar {platillo.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Cantidad */}
          <div className="flex items-center justify-between">
            <Label>Cantidad</Label>
            <div className="flex items-center border rounded-md">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleCantidadChange(-1)}
                disabled={personalizacion.cantidad <= 1}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{personalizacion.cantidad}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2"
                onClick={() => handleCantidadChange(1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Sección de Ingredientes */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleSeccion("ingredientes")}
            >
              <h3 className="font-medium">Ingredientes</h3>
              {seccionesExpandidas.ingredientes ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            {seccionesExpandidas.ingredientes && (
              <div className="grid gap-2 pl-2">
                {ingredientes.map((ingrediente) => (
                  <div key={ingrediente.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ingrediente-${ingrediente.id}`}
                      checked={!personalizacion.ingredientesExcluidos.includes(ingrediente.id)}
                      onCheckedChange={() => toggleExcluirIngrediente(ingrediente.id)}
                    />
                    <Label htmlFor={`ingrediente-${ingrediente.id}`}>
                      {ingrediente.nombre}
                      {!ingrediente.disponible && <span className="text-destructive ml-1">(No disponible)</span>}
                    </Label>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground pt-1">Desmarca los ingredientes que deseas excluir</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Sección de Preparación */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleSeccion("preparacion")}
            >
              <h3 className="font-medium">Preparación</h3>
              {seccionesExpandidas.preparacion ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            {seccionesExpandidas.preparacion && (
              <div className="pl-2">
                <RadioGroup
                  value={personalizacion.preparacion}
                  onValueChange={(valor) => setPersonalizacion((prev) => ({ ...prev, preparacion: valor }))}
                >
                  {preparaciones.map((prep) => (
                    <div key={prep.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={prep.id} id={`prep-${prep.id}`} />
                      <Label htmlFor={`prep-${prep.id}`}>{prep.nombre}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>

          <Separator />

          {/* Sección de Adicionales */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleSeccion("adicionales")}
            >
              <h3 className="font-medium">Adicionales</h3>
              {seccionesExpandidas.adicionales ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
            {seccionesExpandidas.adicionales && (
              <div className="grid gap-2 pl-2">
                {adicionales.map((adicional) => (
                  <div key={adicional.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`adicional-${adicional.id}`}
                      checked={personalizacion.adicionales.includes(adicional.id)}
                      onCheckedChange={() => toggleAdicional(adicional.id)}
                    />
                    <Label htmlFor={`adicional-${adicional.id}`}>
                      {adicional.nombre} (+${adicional.precio.toFixed(2)})
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Sección de Notas Especiales */}
          <div>
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => toggleSeccion("notas")}
            >
              <h3 className="font-medium">Notas Especiales</h3>
              {seccionesExpandidas.notas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
            {seccionesExpandidas.notas && (
              <div className="pl-2">
                <Textarea
                  placeholder="Instrucciones especiales para la cocina..."
                  value={personalizacion.notasEspeciales}
                  onChange={(e) => setPersonalizacion((prev) => ({ ...prev, notasEspeciales: e.target.value }))}
                  className="resize-none"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <div className="text-lg font-bold">Total: ${calcularPrecioTotal().toFixed(2)}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm}>Agregar a Orden</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
